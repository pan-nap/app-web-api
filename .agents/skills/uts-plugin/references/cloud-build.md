# UTS 插件云打包与本地编译的依赖处理

## 问题背景

UTS 插件依赖三方 SDK（如腾讯 TIM、TRTC）时有两种配置方式：

1. `config.json` 的 `dependencies` — 声明 Maven/Gradle 坐标，**云打包**时使用
2. `libs/` 目录 — 放入 jar/aar/so 文件，**本地自定义基座编译**时使用

两者不能同时存在，否则云打包时多个插件同名 `libs/classes.jar` 会导致 Gradle 合并冲突。

## 官方说明

> **libs** — Android 平台原生三方库目录，支持 jar、aar、so 文件。
>
> 因为**多个 UTS 插件引用相同三方原生 SDK 时可能会产生冲突**，所以如果 SDK 支持仓储，建议优先使用仓储配置（即 `config.json` 的 `dependencies`），而不是直接把 jar/aar 等文件放在 `libs` 目录。
>
> 仓储配置参考 `config.json` 的 `dependencies`。

## 关键原理

| 场景               | 依赖来源                                       | 是否读 libs/           |
| ------------------ | ---------------------------------------------- | ---------------------- |
| **云打包**         | `config.json.dependencies` → Gradle Maven 解析 | ❌ 不能有，否则冲突     |
| **本地自定义基座** | `libs/classes.jar` + 本地调用                  | ✅ 必须有，否则编译失败 |

⚠️ **HBuilder 云打包上传的是磁盘上全部文件，不读 `.gitignore`**。只要 `libs/` 在磁盘上存在，就会被上传到云端，多个插件同时有 `libs/classes.jar` 就冲突了。

## 需要删除 / 保留的文件

| 文件/目录             | 云打包前 | 原因              |
| --------------------- | -------- | ----------------- |
| `libs/*.jar`          | ✅ 删除   | 多插件同名冲突    |
| `libs/*.aar`          | ✅ 删除   | 同上              |
| `libs/*.so`           | ✅ 删除   | 同上              |
| `res/`                | ❌ 保留   | 正常 Gradle merge |
| `assets/`             | ❌ 保留   | 正常资源合并      |
| `AndroidManifest.xml` | ❌ 保留   | 正常清单合并      |
| 其他插件代码          | ❌ 保留   | 正常编译          |

## 最佳实践工作流

```
本地调试阶段:
  1. 运行 init-libs.bat → 生成 libs/classes.jar
  2. HBuilderX 自定义基座运行 → 正常编译

切换到云打包:
  1. 删除 uni_modules/*/utssdk/app-android/libs/（所有插件的）
  2. HBuilderX 云打包 → 走 config.json Maven 依赖

切回本地调试:
  1. 再次运行 init-libs.bat → 重新生成 libs/
```

## 常见错误

### 错误 1: libs/ 存在的情况下云打包

```
Duplicate resources
```

**原因**：多插件同名 `classes.jar` 冲突。

**解决**：删除所有插件的 `libs/` 目录后重新云打包。

### 错误 2: 本地自定义基座编译失败

```
错误: 程序包 com.tencent.imsdk不存在
找不到符号 V2TIMManager
```

**原因**：缺少 `libs/classes.jar`，本地编译无法解析 SDK API。

**解决**：运行对应插件的 `init-libs.bat` 生成 `classes.jar`。

## 参考文档

- [UTS 插件介绍 - uni-app x](https://doc.dcloud.net.cn/uni-app-x/plugin/uts-plugin.html)
- `config.json` 配置格式
