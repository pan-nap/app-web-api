---
name: features-dialog-page
description: dialogPage 弹窗页、openDialogPage、closeDialogPage、与主 page 区别、Promise 封装
---

# dialogPage

## 适用场景

- 需要覆盖导航栏和 tabBar 的弹框、内置界面。
- 需拦截 back 键、自定义蒙层与交互；替代部分 showModal/actionSheet 或自定义组件弹框。

## 与主 page 的异同

- **相同**：需在 pages.json 注册，有 onLoad 等页面生命周期，可传参、用组件。
- **不同**：
  - 背景固定透明、铺满应用；蒙层由页面内部实现（颜色、是否可点关闭）。
  - 使用 **openDialogPage / closeDialogPage**，不用 navigateTo/navigateBack。
  - **不进入主页面栈**：getCurrentPages() 不包含 dialogPage；需通过主页面 UniPage 的 **getDialogPages()** 获取。
  - **uni.getElementById** 获取的是栈顶主页面，dialogPage 内元素需用 **this.$page.getElementById()**（或 getCurrentInstance()?.proxy?.$page）。
  - Android 上不是独立 activity，与主 page 同属一个 activity。
  - 默认不响应 iOS 侧滑返回；可以通过 onBackPress 控制是否阻止 back 键/手势关闭。

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
import { closeDialogPage } from "@/hook/openDialogPage";

// 确认并返回数据
closeDialogPage({ action: "confirm", data: { name: "张三" } });

// 取消
closeDialogPage({ action: "cancel" });
```

### API

| 函数                               | 说明                                          |
| ---------------------------------- | --------------------------------------------- |
| `openDialogPage<T>(url, options?)` | async 函数，返回 Promise<DialogPageResult<T>> |
| `closeDialogPage<T>(result?)`      | 子页面关闭并返回数据                          |
| `getDialogEventName()`             | 子页面获取事件名（内部用）                    |

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
2. 父页面 `uni.$on(eventName)` 监听，子页面 `uni.$emit(eventName, data)` 返回
3. Promise 封装事件监听，子页面关闭时自动 resolve

## 原生使用方式

- 调用 **uni.openDialogPage** 打开，可选 **parentPage** 指定所属主页面，不传则默认为当前页。
- 在 **App.onLaunch** 中可打开绑定到首页的 dialogPage（如隐私弹框）；**不可在 main.uts 中**调用 openDialogPage。
- 多个 dialogPage 可层叠；close 时可关闭指定 dialogPage。

## 注意

- showModal、showActionSheet、showLoading 等从 4.61 起部分平台由 dialogPage 实现，调用时会触发前一个 dialogPage 的 onHide，关闭时触发 onShow。
- dialogPage 内调用 navigateTo 等路由 API 会作用在 **parentPage** 上，不作用于 dialogPage 自身。
