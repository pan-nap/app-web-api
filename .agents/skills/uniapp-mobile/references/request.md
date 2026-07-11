---
name: request
description: API调用、请求封装
---

# 请求封装规范

## request 封装（utils/request.uts）

```typescript
export default function (url: string, data: any | null, method: RequestMethod = 'GET'): Promise<any> {
  return new Promise<any>((reslove, reject) => {
    const requestData = buildRequestData(data) // 自动附加设备信息
    uni.request({
      url: getRequestUrl(url), // 自动拼接 baseUrl
      data: requestData,
      method,
      success(res) {
        const result = res.data as UTSJSONObject
        const code = result.getNumber('code')
        if (code == 1) {
          const responseData = result.getAny('data')
          reslove(responseData != null ? responseData : new UTSJSONObject())
        } else {
          const msg = result.getString('msg')
          const errorMessage = msg != null ? msg : '接口异常'
          showToast(errorMessage)
          reject(errorMessage)
        }
      },
      fail(err: RequestFail) {
        const errMsg = err.errMsg
        showToast(errMsg)
        reject(err)
      }
    })
  })
}
```

**特点**：
- 自动附加设备信息（device、browser、os、version）
- 自动根据平台拼接 baseUrl（Web 端加 `/sf-web` 前缀，App 端读 config.json）
- 自动解析响应，`code == 1` 时返回 `data`，否则 reject
- 返回 `Promise<any>`，调用方需自行转换类型

## 补充：uniapp-x 两种联网方式

### 方式一：UTSJSONObject

将 `res.data` 转为 `UTSJSONObject`，用**下标**或 **keypath** 访问：

```typescript
uni.request({
  url: "https://example.com/api",
  success: (res) => {
    const data = res.data as UTSJSONObject
    const list = data["list"] as UTSJSONObject[]
    const name = list[0]["name"]  // 或 data.getString("list[0].name")
  }
})
```

适合结构不固定或快速接入；无类型提示。

### 方式二：type + 泛型（推荐）

定义 type，在 `uni.request` 的泛型中传入：

```typescript
type Item = { plugin_name: string }
type Res = { code: number; data: Item[] }

uni.request<Res>({
  url: "https://example.com/api",
  success: (res) => {
    const list = res.data.data  // 类型为 Item[]
    console.log(list[0].plugin_name)
  }
})
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
    const userData = toUser(res as UTSJSONObject)
    this.setUserInfo(userData)
  } catch (err) {
    console.log('登录失败=>>>>>', err)
  }
}

async queryByIdCard(idCard: string): Promise<Student[]> {
  try {
    const res = await request('/student', { idCard }, 'GET')
    const rawArray = res as UTSJSONObject[]
    return rawArray.map((item) => toStudent(item))
  } catch (err) {
    showToast('查询失败')
    return []  // 返回空数组，页面无需判断异常
  }
}
```
