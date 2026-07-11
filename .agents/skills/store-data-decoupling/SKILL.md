---
name: "store-data-decoupling"
description: "实现数据与页面解耦的Pinia Store设计模式。当需要在Vue项目中创建或重构store时，确保所有数据交互（接口调用、数据处理、状态管理）都在store层完成，页面层只负责UI展示和用户交互。"
---

# Store数据解耦设计模式

> 所有数据交互在 Store 层完成，页面层只负责 UI 展示和用户交互。

## 快速定位

| 主题 | 说明 | 参考 |
|------|------|------|
| **核心原则** | 数据与页面解耦、Store层/页面层职责 | [core-principles](references/core-principles.md) |
| **Store 实现** | 文件结构、实现示例、方法命名规范 | [store-implementation](references/store-implementation.md) |
| **页面层实现** | 文件结构、页面示例、注意事项 | [page-implementation](references/page-implementation.md) |
| **API 路由** | 各模块路由设计速查表 | [api-routes](references/api-routes.md) |

---

## 参考文件索引

### 设计理念
- [核心原则与设计模式](references/core-principles.md) — 数据解耦原则、Store层/页面层职责、优势场景

### 实现规范
- [Store 层实现规范](references/store-implementation.md) — 文件结构、student/order/dictionary 示例、方法命名
- [页面层实现规范](references/page-implementation.md) — 文件结构、index.vue 示例、页面注意事项

### 参考
- [API 路由速查表](references/api-routes.md) — 字典/学生/订单/员工模块路由设计
