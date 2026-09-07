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

## Android 专有方法跨端调用（调用侧必须条件编译）

**现象**（Web/H5 构建）：

```
warning: Property 'getLastVideoSnapshotPath' does not exist on type 'typeof IMService'
```

**原因**：hs-im 插件只有 `app-android/index.uts` 的实现类含 `IMService.getLastVideoSnapshotPath()`（读取 Kotlin 自动生成的真实视频封面路径）；`web/`、`app-ios/`、`app-harmony/` 及 `interface.uts` 均未声明。Web 编译按 `web/index.uts` 的实现类做类型检查，自然报属性不存在。Android 端正常编译，坑只在其它平台暴露。

**解决**：调用侧（业务 store/页面，如 `store/im.uts` 的 `sendVideoMessage`）用 `#ifdef APP-ANDROID` 隔离专有调用，其它平台走通用值：

```typescript
// #ifdef APP-ANDROID
const realSnapshotPath = IMService.getLastVideoSnapshotPath() // Kotlin 端自动生成的真实封面
// #endif
// #ifndef APP-ANDROID
const realSnapshotPath = snapshotPath // 其它平台直接使用调用方传入路径
// #endif
```

**通用原则**：跨端共用代码调用 uni_modules 插件静态方法前，先确认该方法在**所有平台目录**（app-android / app-ios / app-harmony / web）的实现类中都存在。只存在于单平台的接口，要么在调用侧包 `#ifdef`，要么在插件各平台目录补齐空实现/兜底实现，并在 interface.uts 保持声明同步。
