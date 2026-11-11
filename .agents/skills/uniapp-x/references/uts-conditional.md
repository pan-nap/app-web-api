# 条件编译

## 作用

同一份代码在不同**平台**、**项目类型**下编译出不同结果；用于调用平台特有 API、或仅在某端存在的逻辑。

## 常见写法

```ts
// #ifdef APP-ANDROID
import Build from "android.os.Build";
console.log(Build.MODEL);
// #endif

// #ifdef APP-IOS
// iOS 专用
// #endif

// #ifndef H5
// 非 H5 时编译
// #endif
```

- **#ifdef**：当某条件成立时编译其后代码；**#ifndef**：当某条件不成立时编译。
- 可用于 template、style、script。

## 常见条件

- **APP-ANDROID**、**APP-IOS**、**APP-HARMONY**、**H5**、**MP-WEIXIN** 等平台；
- **UNI-APP-X**：区分是否为 uni-app x 项目。
- **VUE3-VAPOR**：渲染系统专用条件，主要用于 **uts 插件同时兼容两种渲染模式**（插件写法见 uts-plugin skill）；普通页面少用（本项目已全量蒸汽）。

## 关键点

- 蒸汽模式下页面不能直接调原生 API（`UTSAndroid` 等），平台专有代码需挪进 `utssdk/` 插件后再用条件编译。
- UTS 中平台专有类型（如 Kotlin 的 Int、Swift 的 NSString）需放在条件编译内，否则其他平台报错。
