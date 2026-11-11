---
name: interceptors
description: 导航拦截、请求拦截
---

# 拦截器

## 导航拦截器（interceptors/navigate.uts）

自动检查登录状态，未登录时重定向到登录页：

```typescript
import { useUserStore } from "@/store/user.uts";

const Navigate: AddInterceptorOptions = {
  invoke: function (options: NavigateToOptions) {
    if (!useUserStore().isLogin()) {
      uni.redirectTo({ url: "/pages/login/index" });
      return false;
    }
    return true;
  }
};

export function useNavigate() {
  uni.addInterceptor("navigateTo", Navigate);
}
```

> ❌ 禁句：`invoke: (options: RequestOptions<UTSJSONObject>)` + `UTSJSONObject.assign(...)` —— 页面拦截器直接写普通对象（强类型只在 `utssdk/` 插件内需要，见 uts-plugin skill）。
>
> 分工：**拦截器**只管“未登录时拦住导航”；**登录成功/登出后的主动跳转**用 `uni.reLaunch`，规则见 [状态管理](state-management.md)「登录/登出路由跳转规则」（本文不重复）。

## 拦截器注册（main.uts）

```typescript
import { useInterceptors } from "@/interceptors/index.uts";

export function createApp() {
  const app = createSSRApp(App);
  useInterceptors(app);
  return { app };
}
```

## 补充：uniapp-x 拦截器限制

原生侧无 JS 的动态性，**拦截器无法完全复刻 JS 行为**。

- **Android**：request 泛型包装与传递需注意泛型丢失。
- 项目中已在 `interceptors/` 层做了封装，如有问题可参考上述限制排查。
