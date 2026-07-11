# 事件总线与系统信息

## 事件总线（uni.$on / uni.$emit）

- **uni.$emit(eventName, args?)**：发送事件。
- **uni.$on(eventName, callback)**：监听；**uni.$off** 取消监听；**uni.$once** 仅监听一次。
- 用于页面间、dialogPage 与主页面等解耦通信；注意及时 $off 避免泄漏。

## 启动与进入参数

- **uni.getLaunchOptionsSync()**：获取本次启动时的参数。
- **uni.getEnterOptionsSync()**：获取本次进入前台时的参数。
- 做"直达页"时一般在 **App.onShow** 里解析并 navigateTo。

## 系统信息

- **uni.getSystemInfo / getSystemInfoSync**：返回 device、os、rom、host、uni、app 等层级信息。
- 建议新代码用 **getDeviceInfo**、**getAppBaseInfo**、**getWindowInfo** 三个 API。
- **windowHeight**：Android 上建议在 **onReady** 或 **onPageShow** 内获取。
