# 本地存储

## 能力

- **key-value** 本地存储；App 端为原生存储，无大小限制、持久化。
- key 不要使用 `uni-`、`uni_`、`dcloud-`、`dcloud_` 前缀（系统保留）。

## 同步 API

- **uni.setStorageSync(key, data)**：写入。直接传对象字面量即可：`uni.setStorageSync('obj', { a: 1 })`。
  - ❌ 禁句：`{ a: 1 } as UTSJSONObject`（仅 `utssdk/` 插件内需要强类型声明，见 uts-plugin skill）。
- **uni.getStorageSync(key)**：读取，返回 any；按普通对象 `.`/`[]` 访问。业务对象建议先过 store/mapper 里的 `toXxx` 转换，避免接口字段变动直接冲击页面。
- **uni.removeStorageSync(key)** / **uni.clearStorageSync()**：删除/清空。

## 异步 API

- **uni.setStorage(options)** / **uni.getStorage(options)**：异步读写。

## 注意

- 非 App 平台清空 Storage 可能导致 **uni.getSystemInfo/getDeviceInfo** 获取的 deviceId 变化。
