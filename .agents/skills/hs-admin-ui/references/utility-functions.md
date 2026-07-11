---
name: utility-functions
description: 时间格式化、数据类型判断、URL处理、加密解密、树形数据处理、主题切换、水印、事件总线
---

# 其他工具函数

## 时间格式化

```javascript
import { Utils } from 'hs-admin-ui';

Utils.formatTime(new Date(), 'YYYY-MM-DD HH:mm:ss');
```

## 数据类型判断

```javascript
import { Utils } from 'hs-admin-ui';
// 各类类型判断方法
```

## URL 处理

```javascript
Utils.getUrlParams('http://localhost:8888/name/?mid=123'); // {mid: 123}
Utils.addUrlParams('http://localhost:8888/name/?mid=123', {type: 1}); // ...?mid=123&type=1
```

## 加密解密

```javascript
const encrypted = Utils.encryptionTool.encrypt({ data: 'secret' });
const decrypted = Utils.encryptionTool.decrypt(encrypted);
```

## 树形数据处理

```javascript
Utils.treeToList(tree, isCloneDeep);
Utils.getFormInstanceData(Instance: IFormInstance[], hideForceUpdateList = false);
```

## 主题切换

```javascript
Utils.theme.setTheme('dark');
Utils.theme.getTheme(); // 'dark'
```

## 水印

```javascript
Utils.watermark.setWatermark('水印文字');
Utils.watermark.removeWatermark();
```

## 事件总线

```javascript
const mittBus = Utils.useMittBus();
mittBus.emit('eventName', data);
mittBus.on('eventName', (data) => { console.log(data); });
mittBus.off('eventName');
```
