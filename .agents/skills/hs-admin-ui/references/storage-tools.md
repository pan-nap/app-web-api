---
name: storage-tools
description: LocalStorage、SessionStorage、SystemStore(IndexedDB)、配置管理、系统参数
---

# 存储工具

## LocalStorage

```javascript
import { Utils } from 'hs-admin-ui';

Utils.Local.set('key', { value: 123 });
Utils.Local.get('key');      // { value: 123 }
Utils.Local.remove('key');
Utils.Local.clear();
```

## SessionStorage

```javascript
Utils.Session.set('key', { value: 123 });
Utils.Session.get('key');
Utils.Session.remove('key');
Utils.Session.clear();
```

## SystemStore (IndexedDB)

```javascript
Utils.systemStore.set('key', { value: 123 });
Utils.systemStore.get('key');
Utils.systemStore.getToken();
Utils.systemStore.getUserByProject('lsms');
Utils.systemStore.remove('key');
Utils.systemStore.clear();
Utils.systemStore.drop('databaseName');
```

## CustomeStore (自定义 IndexedDB)

```javascript
const store = new Utils.CustomeStore({
  name: 'myStore',
  storeName: 'myData',
  version: 1,
  description: '自定义存储'
});
store.set('key', { value: 123 });
store.get('key');
store.remove('key');
store.clear();
```

## 配置管理

```javascript
Utils.getConfig({ mid: 'menuId', id: 'configId' });
Utils.setConfig({ mid: 'menuId', id: 'configId' }, { value: 123 });
Utils.removeConfig('menuId');
Utils.getColumnWidthConfig({ table_id: 'tableId' });
Utils.setColumnWidthConfig({ table_id: 'tableId' }, { width: 200 });
Utils.clearAllIndexDB(['excludeDb']);
```

## 系统参数

```javascript
Utils.getSystemParams({ project_code: 'lsms', param_type: 'type' });
Utils.getStoreSystemParams({ project_code: 'lsms' });
Utils.setLocalSystemParams([{ param_code: 'code', param_value: 'value' }]);
Utils.getDictListByMid('menuId', 'userId');
Utils.getDataDictListByMid('menuId', 'userId');
Utils.getAuthFieldsByMid('menuId', 'userId');
```
