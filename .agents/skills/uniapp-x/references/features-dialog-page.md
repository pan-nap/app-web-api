---
name: features-dialog-page
description: dialogPage 弹窗页、openDialogPage、useDialogPage、与主 page 区别、Promise 封装
---

# dialogPage

## 适用场景

- 需要覆盖导航栏和 tabBar 的弹框、内置界面。
- 需拦截 back 键、自定义蒙层与交互；替代部分 showModal/actionSheet 或自定义组件弹框。

## 与主 page 的异同

- **相同**：需在 pages.json 注册，有 onLoad 等页面生命周期，可传参、用组件。
- **不同**：
  - 背景固定透明、铺满应用；蒙层由页面内部实现（颜色、是否可点关闭）。
  - 使用 **uni.openDialogPage / uni.closeDialogPage**，不用 navigateTo/navigateBack（项目封装见下文 hook，**不要再自己包一层 closeDialogPage**，原因见「子页面取自己的调用参数」）。
  - **不进入主页面栈**，且内部元素不能用 `uni.getElementById` —— 页面栈与元素获取的完整规则只在 [DOM、元素与页面栈](features-dom.md) 维护，本文不重复（一句话：先拿主页面 UniPage 调 `getDialogPages()`，再用该 dialogPage 自己的 `$page.getElementById`）。
  - 默认不响应 iOS 侧滑返回；可以通过 onBackPress 控制是否阻止 back 键/手势关闭。
  - Android 上不是独立 activity，与主 page 同属一个 activity。

## 命令式封装（hook/openDialogPage.uts）

项目封装了 Promise 风格的命令式 API，类似 hs-admin-ui 的 showPopup：

### 父页面调用

```typescript
import { openDialogPage } from "@/hook/openDialogPage";

// .then 方式
openDialogPage<{ name: string }>("/pages/dialog/edit", {
  params: { id: 123 }
})
  .then((result) => {
    if (result.action === "confirm") {
      console.log(result.data?.name);
    }
  })
  .catch((err) => {
    console.error("openDialogPage fail:", err);
  });
```

### 子页面返回数据

```typescript
import { useDialogPage } from "@/hook/openDialogPage";

// ✅ 页面 setup 顶层调一次，把 eventName 绑成闭包变量
const { close } = useDialogPage();
close({ action: "confirm", data: { name: "张三" } });
close({ action: "cancel" });
```

> 对外只有一个入口：弹窗页必须在 setup 顶层调 `useDialogPage()`。以前那个能在 handler 里调的 `closeDialogPage(result)` 封装已删除 —— 它无法知道“自己是哪个弹窗”，只能猜栈顶。

### API

| 函数                               | 说明                                                                            |
| ---------------------------------- | ------------------------------------------------------------------------------- |
| `openDialogPage<T>(url, options?)` | async 函数，返回 Promise<DialogPageResult<T>>                                   |
| `useDialogPage<T>()`               | **子页面唯一入口**：setup 顶层绑定自己的 eventName，返回 `{ eventName, close }` |
| `getDialogEventName()`             | 取事件名，**仅页面 setup 期有效**（内部就是 `$page.options`）                   |

### 类型定义

```typescript
interface DialogPageResult<T = any> {
  action: "confirm" | "cancel" | "close" | string;
  data?: T;
}

interface OpenDialogPageOptions {
  params?: Record<string, any>; // URL 参数
  animationType?: string; // 动画类型
  animationDuration?: number; // 动画时长
}
```

### 通信原理

1. 父页面生成唯一事件名（时间戳 + 随机数），通过 URL 传给子页面
2. 父页面 `uni.$on(eventName)` 监听，子页面 `uni.$emit(eventName, data)` 返回（事件总线 API 本体见 [事件与系统信息](features-api-event-system-info.md)）
3. Promise 封装事件监听，子页面关闭时自动 resolve

## 子页面取自己的调用参数（多弹窗不串台）

一个主页面上可能同时挂多个 dialogPage，而 **dialogPage 不进主页面栈**，所以「拿当前弹窗」不能靠页面栈反查。官方（`api/dialog-page.md` Tips）给的可用路径只有两条：

| 取法                                 | 能拿到「自己」吗 | 适用时机                                                                                            |
| ------------------------------------ | ---------------- | --------------------------------------------------------------------------------------------------- |
| 弹窗页 `onLoad((options) => …)`      | ✅ 永远是自己    | 只需参数、不要求任意时刻可读                                                                        |
| `getCurrentInstance()?.proxy?.$page` | ✅               | **仅页面 setup 同步期**；@tap handler 里 `getCurrentInstance()` 已是 null；子组件里官方标「不支持」 |

本项目 5.34 蒸汽模式实测：`$page.options["eventName"]` 在 dialogPage 的 setup 里**能取到**（`hasPage=true`），所以 `getDialogEventName()` 只走 `$page` 这一条；配套的 `useDialogPage()` 必须在页面 setup 顶层调用。

- ❌ 禁句：`hostPage.$dialogPages[0]`。`$dialogPages` 是内部属性；`[0]` 取到的是**最早打开**的那个，弹窗套弹窗时 B 的结果会 emit 给 A 的 handler（A 的 Promise 提前 resolve，B 的永远挂着）。
- ❌ 禁句：拿 `getCurrentPages()` 的栈顶当 dialogPage。栈顶是**宿主主页面**；一旦弹窗开在非栈顶主页（用 `parentPage` 指定过，或 A 开弹窗未关就 `navigateTo` 到 B），整条链路取不到。曾为兑现这种场景写过“`getDialogPages()` 取最后一个”的兜底，因为官方未承诺数组顺序、会猜错，已连 `closeDialogPage()` 封装一起删除，**不要重新引入**。
- ⚠️ 不要把 `JSON.stringify(getCurrentPages())` 打进日志：页面对象里挂着 store，**会把 access_token 等敏感数据写进 logcat**。

## 原生使用方式

- 调用 **uni.openDialogPage** 打开，可选 **parentPage** 指定所属主页面，不传则默认为当前页。
- 在 **App.onLaunch** 中可打开绑定到首页的 dialogPage（如隐私弹框）；为何**不可在 main.uts 中**调用 openDialogPage，见 [App 入口](core-app.md)「注意」。
- 多个 dialogPage 可层叠；close 时可关闭指定 dialogPage。层叠时子页取参数必须用 `useDialogPage()`（原因见上一节）。

## 注意

- showModal、showActionSheet、showLoading 等从 4.61 起部分平台由 dialogPage 实现，调用时会触发前一个 dialogPage 的 onHide，关闭时触发 onShow。
- dialogPage 内调用 navigateTo 等路由 API 会作用在 **parentPage** 上，不作用于 dialogPage 自身。
