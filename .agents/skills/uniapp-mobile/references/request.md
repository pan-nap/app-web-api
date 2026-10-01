---
name: request
description: API调用、请求封装
---

# 请求封装规范

## request 封装（utils/request.uts）

```typescript
interface ResponseData {
  code?: number;
  msg?: string;
  data?: any;
}

export function request(url: string, data: any, method: RequestMethod = "GET"): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    const requestData = buildRequestData(data); // 自动附加设备信息
    uni.request({
      url: getRequestUrl(url), // 自动拼接 baseUrl
      data: requestData,
      method,
      header: {
        "Content-Type": "application/json",
        Authorization: getAuthorizationHeader()
      },
      success(res) {
        const result = res.data as ResponseData;
        if (result.code == 1) {
          resolve(result.data ?? {});
        } else {
          const errorMessage = result.msg ?? "接口异常";
          showToast(errorMessage);
          reject(errorMessage);
        }
      },
      fail(err: RequestFail) {
        const errMsg = err.errMsg;
        showToast(errMsg);
        reject(err);
      }
    });
  });
}

export default request;
```

**特点**：

- 自动附加设备信息（device、browser、os、version）
- 自动根据平台拼接 baseUrl（Web 端加 `/sf-web` 前缀，App 端读 config.json）
- 自动注入 Authorization 请求头（从 userStore 获取 token）
- 自动解析响应，`code == 1` 时返回 `data`，否则 reject
- 返回 `Promise<any>`，调用方需自行转换类型

**蒸汽模式标准 TS 写法**：

- 使用 `interface` 定义响应类型，而非 `type` + `UTSJSONObject`
- 使用 `as ResponseData` 类型断言后直接 `.code/.msg/.data` 访问
- 使用 `??` 空值合并运算符提供默认值
- `any` 类型已包含 null/undefined，无需写 `any | null`

## 补充：uniapp-x 两种联网方式

### 方式一：标准 TS 类型断言（推荐）

定义 `interface`，用 `as` 断言后直接访问属性：

```typescript
interface Item {
  plugin_name: string;
}
interface Res {
  code: number;
  data: Item[];
}

uni.request({
  url: "https://example.com/api",
  success: (res) => {
    const result = res.data as Res;
    const list = result.data; // 类型为 Item[]
    console.log(list[0].plugin_name);
  }
});
```

有类型提示，代码简洁，蒸汽模式推荐写法。

### 方式二：uni.request 泛型

在 `uni.request` 的泛型中传入响应类型：

```typescript
interface Item {
  plugin_name: string;
}
interface Res {
  code: number;
  data: Item[];
}

uni.request<Res>({
  url: "https://example.com/api",
  success: (res) => {
    const list = res.data.data; // 类型为 Item[]
    console.log(list[0].plugin_name);
  }
});
```

有类型提示与校验，性能更好。

### 注意

- **App 端** request 暂不支持 Promise，返回 **RequestTask**；complete 中建议将 task 置空。
- 使用泛型时务必显式写：`uni.request<Person>(options)`。
- 流式响应（AI 等）：设置响应体为 **arraybuffer**，监听 **onChunkReceived** 流式接收。

## 调用方式

```typescript
// Store 层调用 — 统一 async/await + try/catch
async login(data: LoginFormData): Promise<void> {
  try {
    const res = await request('/login', data, 'POST')
    const userData = toUser(res)
    this.setUserInfo(userData)
  } catch (err) {
    console.log('登录失败=>>>>>', err)
  }
}

async queryByIdCard(idCard: string): Promise<Student[]> {
  try {
    const res = await request('/student', { idCard }, 'GET')
    const rawArray = res as any[]
    return rawArray.map((item) => toStudent(item))
  } catch (err) {
    showToast('查询失败')
    return []  // 返回空数组，页面无需判断异常
  }
}
```
