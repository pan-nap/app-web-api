---
name: lifecycle
description: 页面/组件生命周期使用
---

# 生命周期规范

## 页面生命周期（pages目录）

用于 `pages/` 目录下的 `.uvue` 页面文件。

| 生命周期 | 说明 | 参数 |
|---------|------|------|
| `onLoad` | 监听页面加载，响应式数据、计算属性等已设置完成 | `options: OnLoadOptions` - 上个页面传递的参数 |
| `onShow` | 监听页面显示，每次出现在屏幕都触发 | 无 |
| `onReady` | 监听页面初次渲染完成，DOM 树可用 | 无 |
| `onHide` | 监听页面隐藏 | 无 |

| **onUnload** | 监听页面卸载 | 无 |

## 补充：更多页面生命周期

| 生命周期 | 说明 |
|----------|------|
| **onBackPress** | 物理/导航返回键时触发；返回 `true` 可阻止默认返回。**不可使用 async**。iOS 侧滑返回不触发。 |
| **onReachBottom** | 滚动到底部附近时触发；距离可在 pages.json 的 onReachBottomDistance 配置。 |
| **onPageScroll** | 页面滚动时触发（App 端仅当根节点为 scroll-view 时生效）。 |
| **onTabItemTap** | 点击 tab 项时触发。 |

### 生命周期顺序

1. 根据 pages.json 创建页面，style 最早生效。
2. 根据 template 创建首批 DOM（静态部分）。
3. 触发 **onLoad**（此时 DOM 未就绪，不宜同步用 ref/getElementById 拿节点）。
4. **onShow**（转场动画开始后）。
5. **onReady**（UI 层完成真实元素创建，可操作 ref）。

onReady 与转场动画结束的先后不固定，取决于 DOM 数量与复杂度。

### 组合式与选项式差异

- **组合式**：页面显示/隐藏用 **onPageShow / onPageHide**（避免与应用生命周期重名）。
- **选项式**：页面显示/隐藏用 **onShow / onHide**。
- 选项式不能直接监听页面级生命周期；若组件需要页面生命周期，需用组合式或选项式中的 setup。

### 注意

- onLoad 中不宜大量同步耗时计算，否则会阻塞转场动画；联网、取参可在 onLoad 中发起。
- App-iOS：onLoad 时窗体动画可能已开始，此时改 pageStyle 可能闪烁，建议在 onShow/onReady 中设置。
- Android：onLoad 时当前页 activity 可能未创建完成，取当前页 activity 建议在 onShow 或 onReady。

```vue
<script setup lang="uts">
onLoad((options : OnLoadOptions) => {
  const testMode = options['testMode'] as string | null
  if (testMode == 'empty') {
    formData.username = ''
  }
})

onShow(() => {
  console.log('页面显示')
})
</script>
```

## 组件生命周期（components目录）

用于 `components/` 目录下的组件文件。

| 生命周期 | 说明 |
|---------|------|
| `onMounted` | 组件挂载到 DOM 后执行 |
| `onUnmounted` | 组件从 DOM 卸载后执行 |
| `onUpdated` | 组件更新后执行 |
| `onBeforeMount` | 组件挂载前执行 |
| `onBeforeUpdate` | 组件更新前执行 |
| `onBeforeUnmount` | 组件卸载前执行 |

```vue
<script setup lang="uts">
onMounted(() => {
  console.log('组件挂载')
})

onUnmounted(() => {
  console.log('组件卸载')
})
</script>
```

## 生命周期使用原则

1. **页面文件（pages/）**：使用页面生命周期（`onLoad`、`onShow` 等）
2. **组件文件（components/）**：使用组件生命周期（`onMounted`、`onUnmounted` 等）
3. **不推荐混用**：页面中也可以使用组件生命周期，但不推荐，应保持分开


## 补充：组件可监听所在页面的生命周期

组合式下，组件可监听**其所在页面**的页面生命周期（如 onPageShow）；选项式不能。

组件**无** onLoad、onShow 等页面生命周期，**有** mounted、unmounted 等组件生命周期。

## 关于Vue API导入

**不需要显式导入 Vue API**，编译器会自动分析并处理：

```typescript
// ❌ 不需要
import { ref, reactive, onMounted, computed, watch } from 'vue'

// ✅ 直接使用
const form = reactive({ ... })
const loading = ref(false)
onMounted(() => { ... })
```
