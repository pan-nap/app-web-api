# HarmonyOS 平台混编 (uts for HarmonyOS)

## 编译流程

UTS 编译为 ArkTS 代码，编译产物为 .ets 文件。uts 插件是唯一支持混编 ets 的文件类型。

## 类型差异

| 场景 | UTS 写法 | ArkTS 编译结果 |
|------|----------|---------------|
| any 类型 | `let x: any` | `let x: Object`（any 转为 Object） |
| 无类型对象字面量 | `const obj = { a:1 }` | `const obj = { a:1 } as UTSJSONObject` |
| 有类型对象字面量 | `const obj: Obj = { a:1 }` | `class Obj { a: number }` 编译后正常 |

## 依赖配置

`utssdk/app-harmony/config.json`：

```json
{
  "dependencies": {
    "@cashier_alipay/cashiersdk": "15.8.26",
    "local-deps": "./libs/local-deps.har"
  }
}
```

注意事项：
- **config.json 不能含注释**
- 本地依赖相对路径相对于 config.json 所在目录
- 鸿蒙模块名生成规则：`uni-getBatteryInfo` → moduleName `uni_modules__uni_getbatteryinfo`，packageName `@uni_modules/uni-getbatteryinfo`

## module.json5

`utssdk/app-harmony/module.json5` 配置权限和设备类型：

```json
{
  "module": {
    "name": "uni_modules__test_mylocation",
    "type": "har",
    "deviceTypes": ["default", "tablet", "2in1"],
    "requestPermissions": [
      {
        "name": "ohos.permission.LOCATION",
        "reason": "$string:permission_location_reason"
      }
    ]
  }
}
```

## resources 和 ets 文件

- **resources**：`utssdk/app-harmony/resources/` 存放图片、字体等资源文件
- **ets 混编**：`app-harmony/*.ets` 文件会**原样拷贝**到产物，uts 文件可以引用 ets 文件。可用于开发 arkui 声明式界面

## 常见问题

- **获取 Context**：`getContext()`（API 9-18）或通过 `UTSHarmony.onAppAbilityWindowStageCreate` 获取 WindowStage 后 `_window.getUIContext().getHostContext()`
- **overrides 配置**：插件内 config.json 的依赖在非根目录，overrides 不生效。需将 `unpackage/dist/dev/app-harmony/oh-package` 复制到项目根 `harmony-configs/oh-package` 后配置
- **ArkTS 约束**：`any` 类型不可用（转为 Object）；对象字面量必须指定类型否则编译为 `UTSJSONObject`

## 腾讯云 IM HarmonyOS 集成 (hs-im)

### 当前状态

**腾讯云 IM 官方暂未提供完整的 HarmonyOS 原生 SDK**。

### 替代方案

#### 方案一：WebView 集成（推荐）

通过 WebView 加载 H5 页面，利用 Web 端 TIM SDK 实现 IM 功能：

1. 在 `app-harmony` 创建 WebView 组件
2. 注入 `tim-js-sdk` 和 `tim-upload-plugin`
3. 通过 JS 桥接实现双向通信

```
utssdk/app-harmony/
├── IMBridgeWebView.ets    ← WebView 封装组件
└── index.uts             ← 调用 WebView 桥接
```

#### 方案二：等待官方 SDK

关注 [腾讯云 IM 官方动态](https://cloud.tencent.com/product/im)，等待 HarmonyOS SDK 发布。

### 集成要点

- **WebView 配置**：启用 `javaScriptAccess`、`domStorageAccess`
- **消息同步**：Web 端与 App 端通过 UserSig + SdkAppId 共享会话
- **文件上传**：Web 端需使用 `tim-upload-plugin`

### 注意事项

- WebView 方案存在延迟和电量消耗问题
- 需处理 WebView 与原生 UI 的层级交互
- 建议在原生 SDK 出来后替换为原生实现
