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

| API              | H5            | Android        | 说明                     |
| ---------------- | ------------- | -------------- | ------------------------ |
| `socket.close()` | 无参          | `close({})`    | Android 必须传空对象     |
| `res.data`       | `any`         | `any`          | `onMessage` 回调直接访问 |
| `charCodeAt`     | 返回 `number` | 返回 `Number?` | 需要 `as number`         |
| `Uint8Array[i]`  | 返回 `number` | 返回 `Number?` | 需要 `as number`         |

## Android 专有方法跨端调用（调用侧必须条件编译）

**现象**（Web/H5 构建）：

```
warning: Property 'getLastVideoSnapshotPath' does not exist on type 'typeof IMService'
```

**原因**：hs-im 插件只有 `app-android/index.uts` 的实现类含 `IMService.getLastVideoSnapshotPath()`（读取 Kotlin 自动生成的真实视频封面路径）；`web/`、`app-ios/`、`app-harmony/` 及 `interface.uts` 均未声明。Web 编译按 `web/index.uts` 的实现类做类型检查，自然报属性不存在。Android 端正常编译，坑只在其它平台暴露。

**解决**：调用侧（业务 store/页面，如 `store/im.uts` 的 `sendVideoMessage`）用 `#ifdef APP-ANDROID` 隔离专有调用，其它平台走通用值：

```typescript
// #ifdef APP-ANDROID
const realSnapshotPath = IMService.getLastVideoSnapshotPath(); // Kotlin 端自动生成的真实封面
// #endif
// #ifndef APP-ANDROID
const realSnapshotPath = snapshotPath; // 其它平台直接使用调用方传入路径
// #endif
```

**通用原则**：跨端共用代码调用 uni_modules 插件静态方法前，先确认该方法在**所有平台目录**（app-android / app-ios / app-harmony / web）的实现类中都存在。只存在于单平台的接口，要么在调用侧包 `#ifdef`，要么在插件各平台目录补齐空实现/兜底实现，并在 interface.uts 保持声明同步。

## 平台条件编译常用标识

| 标识          | 生效平台      | 说明                 |
| ------------- | ------------- | -------------------- |
| `APP`         | 所有 App 平台 | Android + iOS + 鸿蒙 |
| `APP-ANDROID` | Android       | 仅 Android           |
| `APP-IOS`     | iOS           | 仅 iOS               |
| `APP-HARMONY` | 鸿蒙          | 仅鸿蒙 Next          |
| `WEB` / `H5`  | Web 平台      | H5 构建产物          |
| `MP-WEIXIN`   | 微信小程序    | 小程序平台           |
| `MP`          | 所有小程序    | 微信/支付宝/百度等   |

## 回调类型平台差异

不同平台的 API 回调参数类型可能不同，需要条件编译处理：

```typescript
// chooseImage 回调
uni.chooseImage({
  success: function (res): void {
    // #ifdef WEB|MP
    // Web/小程序：res 可直接使用或为 string[]
    handleResult(res);
    // #endif
    // #ifdef APP-ANDROID|APP-HARMONY|APP-IOS
    // App 平台：res 为 ChooseImageSuccess 类型
    const result = res as ChooseImageSuccess;
    const paths = result.tempFilePaths as string[];
    handleResult(paths[0]);
    // #endif
  }
});

// chooseVideo 回调
uni.chooseVideo({
  success: function (res): void {
    const result = res as ChooseVideoSuccess;
    const tempFilePath = result.tempFilePath as string;
    const duration = result.duration as number;
  }
});
```

**常用内置回调类型**：

| API                      | 回调类型             | 常用属性                                             |
| ------------------------ | -------------------- | ---------------------------------------------------- |
| `uni.chooseImage`        | `ChooseImageSuccess` | `tempFilePaths: string[]`                            |
| `uni.chooseVideo`        | `ChooseVideoSuccess` | `tempFilePath: string`, `duration: number`           |
| `uni.showActionSheet`    | `UTSJSONObject`      | `getNumber('tapIndex')`                              |
| `RecorderManager.onStop` | `UTSJSONObject`      | `getString('tempFilePath')`, `getNumber('duration')` |
