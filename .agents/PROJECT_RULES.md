# 项目开发规范

## Skills 使用规则

本项目使用 `.agents/skills/` 目录下的 skill 文件定义开发规范。AI 在执行以下任务时，**必须**先读取相应的 skill 规范：

| 任务类型     | Skill 文件                       | 触发条件                          |
| ------------ | -------------------------------- | --------------------------------- |
| API 接口开发 | `api-design/SKILL.md`            | 创建或修改接口路由、控制器        |
| 弹窗组件开发 | `popup-component/SKILL.md`       | 创建或修改弹窗组件                |
| Store 开发   | `store-data-decoupling/SKILL.md` | 创建或修改 Pinia Store            |
| 表格页面开发 | `vxe-table-usage/SKILL.md`       | 创建或修改表格/列表页面           |
| UI 组件使用  | `hs-admin-ui/SKILL.md`           | 使用 Element Plus、VXE-Table 组件 |
| 移动端开发   | `uniapp-mobile/SKILL.md`         | 开发 uni-app x 移动端应用         |  |

## 新增模块流程

1. **阅读相关 skill 规范**：根据模块类型，先读取 `.agents/skills/` 下对应的 SKILL.md 文件
2. **按照规范创建文件**：严格遵循 skill 中定义的目录结构、命名规范、代码模式
3. **验证代码质量**：确保代码符合 skill 中的所有规范要求
3. **编写测试用例**：根据模块类型，编写对应的测试用例，确保代码质量和功能正确性

## 移动端开发特别说明

**进行 UniApp 移动端开发时，必须阅读以下 skill 规范**：

1. **`uniapp-mobile/SKILL.md`**：包含页面生命周期、组件使用、状态管理、请求拦截等移动端开发规范
2. **`uts-plugin/SKILL.md`**：UTS插件开发规范

> **注意**：移动端项目中所有 `.uts` 和 `.uvue` 文件中的脚本代码本质上都是 UTS 代码，必须遵循 UTS 的语法约束。

## 云打包与本地编译切换规范

UTS 插件使用三方 SDK 时，依赖配置分两种场景：

| 场景               | 依赖来源                                 | 前置操作                    |
| ------------------ | ---------------------------------------- | --------------------------- |
| **云打包**         | `config.json.dependencies`（Maven 坐标） | 删除所有插件的 `libs/` 目录 |
| **本地自定义基座** | `libs/classes.jar`                       | 运行 `init-libs.bat` 生成   |

**切换规则**：
- 云打包前：删除 `uni_modules/*/utssdk/app-android/libs/`（多个插件都需清理）
- 本地调试前：运行各插件的 `init-libs.bat` 重新生成

**只清理 `libs/`，不涉及 `res/`、`assets/`、`AndroidManifest.xml` 等资源文件**。
详见 `.agents/skills/uts-plugin/references/cloud-build.md`。

