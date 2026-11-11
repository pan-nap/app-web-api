---
name: state-management
description: Store设计（标准 pinia setup store）、数据解耦
---

# 状态管理规范

## Store 结构（标准 pinia setup store）

项目使用 **原版 pinia**（`defineStore` setup 语法）管理跨页面状态。pinia 由 uni-app x 编译器内置（HBuilderX 5.25+ 为 3.0.4），**不需要 npm 安装**，直接 `import { defineStore } from "pinia"`。

```typescript
// store/user.uts
import { defineStore } from "pinia";
import request from "@/utils/request.uts";
import { storage } from "@/utils/storage.uts";

const TOKEN = "TOKEN";
const TOKEN_EXPIRES_SECONDS = 24 * 60 * 60;

export type User = {
  access_token: string;
  username: string;
  pageTitle: string;
  id: string;
};

export type LoginFormData = {
  username: string;
  password: string;
};

export const useUserStore = defineStore("user", () => {
  // 首次访问 store 时才读缓存，避免模块加载阶段就依赖 storage
  const storedToken = storage.get(TOKEN) as string | null;

  // 同类业务态集中在一个 reactive 对象里（`reactive` 由 uni-app x 全局自动导入，不用 import）
  const info = reactive<User>({
    access_token: storedToken != null ? storedToken : "",
    username: "",
    pageTitle: "",
    id: ""
  });

  // 登录态以本地缓存的过期时间为准，不依赖内存里的 token 副本
  function isLogin(): boolean {
    const token = storage.get(TOKEN) as string | null;
    return !storage.isExpired(TOKEN) && token != null && token.length > 0;
  }

  function setUserInfo(data: User): void {
    // 只覆盖接口实际返回的字段；登录响应不含 pageTitle，pageTitle 由 setTitle 维护
    Object.assign(info, data);
    storage.set(TOKEN, info.access_token, TOKEN_EXPIRES_SECONDS);
  }

  async function login(data: LoginFormData): Promise<void> {
    try {
      // 路径统一带 /his-web（后端 context-path，两端都保留）；App 端绝对地址由 request.uts 拼 baseUrl
      const res = await request<User>("/his-web/sys/login", data, "POST");
      setUserInfo(res);
      uni.reLaunch({ url: "/pages/index/index" });
    } catch (err) {
      console.log("登录失败=>>>>>", err);
      throw err;
    }
  }

  function logout(): void {
    // 内存态与缓存态一起清，避免退出后读到上一位用户的残留
    info.access_token = "";
    info.username = "";
    info.pageTitle = "";
    info.id = "";
    storage.remove(TOKEN);
    uni.reLaunch({ url: "/pages/login/index" });
  }

  // 状态与方法的返回值不要写尾逗号（prettier trailingComma: "none"）
  // 实际文件另有 setTitle / toLogin，此处省略
  return { info, isLogin, setUserInfo, login, logout };
});
```

> 蒸汽模式下 `res.data` 就是普通对象：`request<T>(...)` 泛型拿到什么类型就能直接 `.` 访问，**不要写 `toUser(res as UTSJSONObject)`**（插件内的强类型转换见 uts-plugin skill）。
> 若接口字段与业务 type 不一致，才在 store 里写 mapper（需另外声明 `ApiUser` 等接口响应 type），保证页面只依赖自己的 type。
> setup store 里 `ref` 与 `reactive` 对象都能作为状态返回，pinia 会把它们归入 store 状态（`$patch`、`storeToRefs`、`$subscribe` 均可用）。对象内部读写不需要 `.value`，对外则是 `userStore.info.access_token`。

## Store 设计要点

| 要点           | 说明                                                                                 |
| -------------- | ------------------------------------------------------------------------------------ |
| **定义方式**   | `defineStore(id, () => {...})` setup 语法，状态用 `reactive` 对象或 `ref`            |
| **状态分组**   | 同一业务域的数据集中在一个对象（如 `info`），不拆成多个平铺 `ref`                    |
| **状态初始化** | 持久化数据在 store 函数体内读 `storage.get()`，不要在模块顶层读                      |
| **暴露方式**   | `return` 的 `reactive`/`ref` 即状态，函数即 action；页面按 `userStore.info.xxx` 访问 |
| **方法封装**   | 所有数据操作（接口调用、数据处理）封装在Store内                                      |
| **异常处理**   | 异步方法内部 try/catch 消化异常，显示 toast，不往外抛                                |
| **挂载**       | `main.uts` 里 `app.use(createPinia())`，且必须先于拦截器/页面注册                    |
| **页面调用**   | 页面只 `await`，不写 try/catch                                                       |

## 登录/登出路由跳转规则

登录成功或登出后，**必须使用 `uni.reLaunch()` 而非 `uni.navigateTo()`**：

```typescript
// ✅ 正确 — reLaunch 清空页面栈
uni.reLaunch({ url: "/pages/index/index" });
uni.reLaunch({ url: "/pages/login/index" });

// ❌ 错误 — navigateTo 可能导致页面栈锁定 'locked' 错误
uni.navigateTo({ url: "/pages/index/index" });
```

> `reLaunch` 会关闭所有页面并打开目标页面，确保不会因页面栈过深导致跳转失败。

## 使用 Store

```typescript
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/user.uts";

const userStore = useUserStore();

// 读取状态：统一从 info 对象取
console.log(userStore.info.username);
console.log(userStore.info.access_token);

// 需要解构且保持响应性时用 storeToRefs，直接解构会丢失响应
const { info } = storeToRefs(userStore);

// 调用方法
await userStore.login({ username: "admin", password: "123456" });
userStore.logout();
```

在 `.uvue` 模板里直接用 `userStore.info.pageTitle` 即可自动跟踪更新。

## 数据解耦规范

| 层级        | 职责                                                                 |
| ----------- | -------------------------------------------------------------------- |
| **页面层**  | UI展示、用户交互、调用Store方法（只 `await`，不写 try/catch）        |
| **Store层** | 接口调用、响应类型/字段映射、状态管理、异常处理（try/catch + toast） |

## 补充：uniapp-x 全局状态方式

### globalData

→ 定义位置、读写方式、蒸汽模式下 uts 插件拿不到 `globalData` 等限制，统一在 [App 入口](core-app.md)「globalData」维护，本文不重复。

结论：蒸汽模式 + 需要界面自动更新时，**不用 globalData**，用 pinia store。

### pinia

- **直接用原版 pinia**（HBuilderX 5.25+ 升至 3.0.4，由 uni-app x 编译器内置，**无需 npm 安装**，`import { defineStore } from "pinia"` 即可）。
- 本项目主方案就是 pinia，见上方「Store 结构」。
- 注意：pinia 实例未挂载就调 `useXxxStore()`（例如在模块顶层）会报 `getActivePinia()` 相关错误，所有 store 调用都要放在 `createApp()` 之后。

### 专用 store 模块（reactive）

只在「单个文件、极简、不需要 action」的全局计数场景使用，与 pinia 不要混用同一份数据：

```typescript
// store/global.uts
export type GlobalState = { globalNum: number };
export const globalState = reactive({ globalNum: 0 } as GlobalState);
export const setGlobalNum = (num: number) => {
  globalState.globalNum = num;
};
```

```vue
<!-- 页面中使用（蒸汽模式仅支持组合式） -->
<script setup>
import { globalState, setGlobalNum } from "@/store/global.uts";
const globalNum = computed(() => globalState.globalNum);
const plus = () => setGlobalNum(globalState.globalNum + 1);
</script>
```

**原则**：需要界面随全局数据更新时，**首选 pinia store**；只有临时、无业务逻辑的零散状态才用 reactive 模块；仅需跨页共享不要求响应式时可用 globalData。
