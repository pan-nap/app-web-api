---
name: http-download
description: HTTP 请求工具、下载工具、导入方式
---

# HTTP 请求与下载工具

## request

```javascript
import { request } from 'hs-admin-ui';

request({ url: '/api/users', method: 'GET', params: { page: 1, limit: 10 } });
request({ url: '/api/users', method: 'POST', data: { name: '张三' } });
request({ url: '/api/users/1', method: 'PUT', data: { name: '李四' } });
request({ url: '/api/users/1', method: 'DELETE' });
```

## useRequest

简化的请求方法：

```javascript
import { useRequest } from 'hs-admin-ui';

const data = await useRequest('/api/users', { page: 1 }, 'GET');
const result = await useRequest('/api/users', { name: '张三' }, 'POST');
const result = await useRequest('/api/users', { page: 1 }, 'GET', { timeout: 5000 });
```

## axiosInterceptors

请求/响应拦截器：

```javascript
import { axiosInterceptors } from 'hs-admin-ui';

axiosInterceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInterceptors.response.use(
  response => response,
  error => Promise.reject(error)
);
```

## 下载工具

```javascript
import { Utils } from 'hs-admin-ui';

Utils.Download({ url: 'https://example.com/file.pdf', name: '文件名.pdf' });
Utils.downloadFile(blobData, '文件名.xlsx');
const blob = Utils.dataURLtoBlob(dataURL);

// 选中导出数据
Utils.exportSelectedData({
  uniqueId: 'templateId',
  projectCode: 'lsms',
  columnConfig: [...],
  data: [...],
  template_name: '导出文件名',
  export_biz_type: '/pri/easyexcel/list_page'
});

// 全部导出
Utils.exportAllData({
  uniqueId: 'configId',
  tableId: 'tableId',
  projectCode: 'lsms',
  columnConfig: [...],
  search_json_data: { page: 1 },
  template_name: '导出文件名',
  export_biz_type: '/pri/easyexcel/list_page'
});
```

## 导入方式

```javascript
// 导入所有工具
import { Utils, mathTool, request, useRequest } from 'hs-admin-ui';
// 导入特定工具
import { HsMessage, HsMessageBox, HsNotification } from 'hs-admin-ui';
// 导入 lodash
import { lodash } from 'hs-admin-ui';
```
