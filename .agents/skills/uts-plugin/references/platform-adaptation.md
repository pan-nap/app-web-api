# UTS 平台适配

## 条件编译

```typescript
// #ifdef H5
// H5 平台特有代码
// #endif

// #ifdef APP-ANDROID
// Android 平台特有代码
// #endif

// #ifndef H5
// 非 H5 平台（Android/iOS 等）
// #endif
```

## 平台 API 差异速查

| API | H5 | Android | 说明 |
|-----|-----|---------|------|
| `socket.close()` | 无参 | `close({})` | Android 必须传空对象 |
| `res.data` | `any` | `any` | `onMessage` 回调直接访问 |
| `charCodeAt` | 返回 `number` | 返回 `Number?` | 需要 `as number` |
| `Uint8Array[i]` | 返回 `number` | 返回 `Number?` | 需要 `as number` |
