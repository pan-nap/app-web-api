---
name: state-management
description: Store设计（Class模式）、数据解耦
---

# 状态管理规范

## Store 结构（Class模式）

项目使用 **Class + reactive** 的模式管理状态，而非函数式：

```typescript
// store/user.uts
import request from '@/utils/request.uts'
import { storage } from '@/utils/storage.uts'

const TOKEN = 'TOKEN'

export type User = {
  access_token: string
  username: string
  pageTitle: string
  id: string
}

export type LoginFormData = {
  username: string
  password: string
}

// 使用 reactive 创建响应式数据
const storedToken = storage.get(TOKEN) as string | null
const userInfo = reactive<User>({
  access_token: storedToken != null ? storedToken : '',
  username: '',
  pageTitle: '',
  id: ''
})

// UTSJSONObject → 自定义类型的转换函数
function toUser(data: UTSJSONObject): User {
  return {
    access_token: data.getString('access_token', ''),
    username: data.getString('username', ''),
    pageTitle: data.getString('pageTitle', ''),
    id: data.getString('id', '')
  }
}

// Class 封装状态和方法
class UserStore {
  state: User = userInfo

  isLogin(): boolean {
    const token = storage.get(TOKEN) as string | null
    return !storage.isExpired(TOKEN) && token != null && token.length > 0
  }

  setUserInfo(info: User) {
    UTSJSONObject.assign(userInfo, info)
    const expires = 24 * 60 * 60
    storage.set(TOKEN, info.access_token, expires)
    return nextTick()
  }

  async login(data: LoginFormData): Promise<void> {
    try {
      const res = await request('/login', data, 'POST')
      this.setUserInfo(toUser(res as UTSJSONObject))
      uni.reLaunch({ url: '/pages/index/index' })
    } catch (err) {
      console.log('登录失败=>>>>>', err)
    }
  }

  logout(): void {
    storage.remove(TOKEN)
    uni.reLaunch({ url: '/pages/login/index' })
  }
}

// 导出单例
const userStore = new UserStore()
export function useUserStore(): UserStore {
  return userStore
}
```

## Store 设计要点

| 要点 | 说明 |
|------|------|
| **状态定义** | 使用 `reactive<T>()` 创建响应式对象 |
| **数据获取** | 使用 `storage.get()` 初始化（持久化数据） |
| **暴露方式** | `state` 属性暴露给页面使用 |
| **方法封装** | 所有数据操作（接口调用、数据处理）封装在Store内 |
| **异常处理** | 异步方法内部用 try/catch 消化异常，显示 toast，不往外抛 |
| **Class模式** | 使用 Class 组织状态和方法，导出单例 |
| **页面调用** | 页面只 `await`，不写 try/catch |

## 登录/登出路由跳转规则

登录成功或登出后，**必须使用 `uni.reLaunch()` 而非 `uni.navigateTo()`**：

```typescript
// ✅ 正确 — reLaunch 清空页面栈
uni.reLaunch({ url: '/pages/index/index' })
uni.reLaunch({ url: '/pages/login/index' })

// ❌ 错误 — navigateTo 可能导致页面栈锁定 'locked' 错误
uni.navigateTo({ url: '/pages/index/index' })
```

> `reLaunch` 会关闭所有页面并打开目标页面，确保不会因页面栈过深导致跳转失败。

## 使用 Store

```typescript
import { useUserStore } from '@/store/user.uts'

const userStore = useUserStore()

// 读取状态
console.log(userStore.state.username)

// 调用方法
userStore.login({ username: 'admin', password: '123456' })
userStore.logout()
```

## 数据解耦规范

| 层级 | 职责 |
|------|------|
| **页面层** | UI展示、用户交互、调用Store方法（只 `await`，不写 try/catch） |
| **Store层** | 接口调用、UTSJSONObject转换、状态管理、异常处理（try/catch + toast） |

## 补充：uniapp-x 全局状态方式

### globalData

在 **App.uvue** 的 `globalData` 中定义，各页面通过 **getApp().globalData** 读写。修改后界面**不会自动更新**，仅适合作简单全局变量。

```typescript
// App.uvue
export default {
  globalData: { userId: '' },
  onLaunch() { }
}

// 页面中
const app = getApp()
const userId = app.globalData.userId
```

### 专用 store 模块（reactive）

App 端**暂不支持 pinia、vuex**；推荐用 reactive + 独立 uts 文件做全局状态：

```typescript
// store/global.uts
export type GlobalState = { globalNum: number }
export const globalState = reactive({ globalNum: 0 } as GlobalState)
export const setGlobalNum = (num: number) => { globalState.globalNum = num }
```

```vue
<!-- 页面中使用 -->
<script>
import { globalState, setGlobalNum } from '@/store/global.uts'
export default {
  computed: {
    globalNum(): number { return globalState.globalNum }
  },
  methods: { plus() { setGlobalNum(globalState.globalNum + 1) } }
}
</script>
```

**原则**：需要界面随全局数据更新时，用 **reactive + 专用模块**；仅需跨页共享不要求响应式时可用 globalData。
