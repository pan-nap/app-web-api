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
- 按平台拼接请求地址：两端**都保留 `/his-web` 前缀**，区别只在于是否拼绝对地址（详见下节）
- 自动注入 Authorization 请求头（从 userStore 获取 token；Android 下 header 不能传 null 值，未登录时不附加）
- 自动解析响应，`code == 1` 时返回 `data`，否则 reject；并发相同接口+相同参数会复用同一个 Promise，错误提示做时间窗口防抖
- 返回 `Promise<any>`，调用方需自行转换类型

## `/his-web` 前缀：两端都不能剥

后端（网关后服务）的 context-path 就是 `/his-web`，所以 `utils/request.uts` 的 `getRequestUrl` **两端均不剥前缀**，只做「拼不拼绝对地址」的差异：

```typescript
function getRequestUrl(url: string): string {
  // #ifdef WEB
  return url; // 相对路径，由 vite 反向代理原样转发（rewrite 保留前缀）
  // #endif
  // #ifndef WEB
  const baseUrl = config["baseUrl"] as string;
  return baseUrl + url; // 直连没有代理，拼绝对地址，前缀照样保留
  // #endif
}
```

- 业务代码统一按带前缀写（如 `request<User>("/his-web/sys/login", data, "POST")`）；**页面、store 里不要自己拼 `baseUrl`**。
- 确实需要绕开 `request.uts` 发请求时：App 端按 `baseUrl + 带前缀路径` 拼绝对地址。开发期的接口文档页 `components/api-doc/api-doc.uvue` **只面向 WEB**（`pages.json` 中也仅在 `#ifdef H5` 注册），因此直接写相对路径交给 vite 代理，不拼 `baseUrl`、不写平台条件编译。
- ⚠️ **一旦前缀被剥掉**（路径写成 `/sys/login`）：网关 `try_files` 会兜底返回前端 SPA 的 `index.html`——状态码仍是 **200**、`content-type: text/html`、体积约 2KB；此时 `res.data` 是 string，强转会报错，`request.uts` 的 `code == 1` 判定走进 reject 分支（toast 表现为“接口异常”）。
- 排查顺序：先看 `res.header["content-type"]` 确认是不是路由没命中，再核对该调用路径是否带 `/his-web`。
- **已知遗留**：`uploadFile` 内部写的是 `getRequestUrl("/upload")`，不带 `/his-web`，按上述规则会落到兜底页（Web 端 vite 也没代理 `/upload`）；用到上传接口时先确认服务路由再补前缀，不要改 `getRequestUrl` 去兼容它。

**蒸汽模式标准 TS 写法**：

- 使用 `interface` / `type` 定义响应类型，`as` 断言后直接 `.` 访问（不要绕 `UTSJSONObject`）
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

→ **Store 内部完整写法（login 的 try-catch + mapper 例子）只在 [状态管理](state-management.md)「Store 结构」维护**，本文不重复；只固定两条调用约束：

- **只在 store 里调 `request`**：页面不直接发请求、不写 try/catch，只 `await store.方法()`（职责划分见 state-management「数据解耦规范」）。
- **路径必须带 `/his-web`**（上一节）：写 `/his-web/sys/login`、`/his-web/sys/access_token`，不要写 `/login`、`/sys/login`；也不要自己拼 `baseUrl`。

```typescript
// 正确形态（代码内容以 state-management 为准，此处只示路径与层级）
async login(data: LoginFormData): Promise<void> {
  try {
    const res = await request("/his-web/sys/login", data, "POST");
    this.setUserInfo(toUser(res));
  } catch (err) {
    /* 内部消化，不往外抛 */
  }
}
```
