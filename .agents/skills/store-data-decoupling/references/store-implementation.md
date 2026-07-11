---
name: store-implementation
description: Store 层实现规范、文件结构、方法命名、实现示例
---

# Store 层实现规范

## Store文件结构

```
src/stores/
├── user.ts
├── dictionary.ts
├── student.ts
└── order.ts
```

## 实现示例（student.ts）

```typescript
import { defineStore } from "pinia";
import { Utils } from "hs-admin-ui";

export const useStudentStore = defineStore("student", () => {
  const getList = async (params: any = {}) => {
    return Utils.useRequest("/sf-web/student", params, "get");
  };

  const getById = async (id: string) => {
    return Utils.useRequest(`/sf-web/student/${id}`, {}, "get");
  };

  const create = async (data: any) => {
    return Utils.useRequest("/sf-web/student", data, "post");
  };

  const update = async (id: string, data: any) => {
    return Utils.useRequest(`/sf-web/student/${id}`, data, "put");
  };

  const deleteById = async (id: string) => {
    return Utils.useRequest(`/sf-web/student/${id}`, {}, "delete");
  };

  const batchDelete = async (ids: string[]) => {
    return Utils.useRequest("/sf-web/student/batch/delete", { ids }, "post");
  };

  const batchUpdate = async (data: any) => {
    return Utils.useRequest("/sf-web/student/batch", data, "put");
  };

  return { getList, getById, create, update, deleteById, batchDelete, batchUpdate };
});
```

## 字典 Store 示例（dictionary.ts）

```typescript
import { defineStore } from "pinia";
import { ref } from "vue";
import { Utils } from "hs-admin-ui";

export const useDictionaryStore = defineStore("dictionary", () => {
  const dictionaries = ref<any>({});

  const fetchDictionaries = async () => {
    return Utils.useRequest("/sf-web/dictionaries", {}, "get").then((res) => {
      dictionaries.value = res.data;
      return res.data;
    });
  };

  const create = async (data: any) => {
    return Utils.useRequest("/sf-web/dictionary", data, "post");
  };

  const update = async (id: number, data: any) => {
    return Utils.useRequest(`/sf-web/dictionary/${id}`, data, "put");
  };

  const deleteById = async (id: number) => {
    return Utils.useRequest(`/sf-web/dictionary/${id}`, {}, "delete");
  };

  const getDictionary = (key: string) => {
    return dictionaries.value[key] || [];
  };

  return { dictionaries, fetchDictionaries, create, update, deleteById, getDictionary };
});
```

## 方法命名规范

| 方法名 | 参数 | 说明 |
|--------|------|------|
| getList | params: object | 获取列表，支持分页 |
| getById | id: string | 按ID获取详情 |
| create | data: any | 创建新记录 |
| update | id: string, data: any | 更新记录 |
| deleteById | id: string | 删除单条记录 |
| batchDelete | ids: string[] | 批量删除（POST方式） |
| batchUpdate | data: any | 批量更新 |
| getItems | parentId: string | 获取子资源列表 |
