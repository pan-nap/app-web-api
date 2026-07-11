---
name: interceptors
description: 导航拦截、请求拦截
---

# 拦截器

## 导航拦截器（interceptors/navigate.uts）

自动检查登录状态，未登录时重定向到登录页：

```typescript
import { useUserStore } from '@/store/user.uts'

const Navigate: AddInterceptorOptions = {
  invoke: function (options: NavigateToOptions) {
    if (!useUserStore().isLogin()) {
      uni.redirectTo({ url: '/pages/login/index' })
      return false
    }
    return true
  }
}

export function useNavigate() {
  uni.addInterceptor('navigateTo', Navigate)
}
```

## 请求拦截器（interceptors/request.uts）

自动为请求添加 Authorization 头：

```typescript
const requestInterceptor: AddInterceptorOptions = {
  invoke: (options: RequestOptions<UTSJSONObject>) => {
    const header = UTSJSONObject.assign(options.header != null ? options.header : {}, {
      'Content-Type': 'application/json',
      'Authorization': getAuthorizationHeader()
    })
    options.header = header
    return options
  },
  success(args: RequestOptions<UTSJSONObject>) {
    return args
  }
}

export function useRequest() {
  uni.addInterceptor('request', requestInterceptor)
  uni.addInterceptor('uploadFile', uploadFileInterceptor)
}
```

## 拦截器注册（main.uts）

```typescript
import { useInterceptors } from '@/interceptors/index.uts'

export function createApp() {
  const app = createSSRApp(App)
  useInterceptors(app)
  return { app }
}
```

## 补充：uniapp-x 拦截器限制

原生侧无 JS 的动态性，**拦截器无法完全复刻 JS 行为**。
- **Android**：request 泛型包装与传递需注意泛型丢失。
- 建议直接用 `uni.request`，或使用插件市场已处理泛型等问题的拦截器插件。
- 项目中已在 `interceptors/` 层做了封装，如有问题可参考上述限制排查。
