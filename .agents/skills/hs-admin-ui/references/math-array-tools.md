---
name: math-array-tools
description: 数学计算工具、数组操作工具
---

# 数学计算与数组工具

## 数学计算

### Utils.fixedNumAccuracy

解决 JavaScript 浮点数计算精度问题：

```javascript
import { Utils } from 'hs-admin-ui';

Utils.fixedNumAccuracy(0.1 + 0.2); // "0.3"
Utils.fixedNumAccuracy(0.1 + 0.2, 2); // "0.30" 指定小数位数
```

### mathTool

数学计算工具，返回精确的数值：

```javascript
import { mathTool } from 'hs-admin-ui';

mathTool.add(0.1, 0.2, 0.3); // 0.6
mathTool.sub(0.6, 0.2, 0.3); // 0.1
mathTool.times(0.6, 0.2); // 0.12
mathTool.div(0.6, 0.2); // 3
mathTool.equals(0.6, 0.6); // true
mathTool.decimal; // 2
```

### 其他数字工具

```javascript
Utils.decimalDigits;            // 系统参数设置的小数位数
Utils.isLegalNumber(123);       // true
Utils.isToNumber('123');        // true
Utils.getNumbers([1, 2, 'abc']); // [1, 2]
Utils.convertCurrency(12345.67); // "壹万贰仟叁佰肆拾伍元陆角柒分"
Utils.numberToChinese(8);       // "八"
```

## 数组操作工具

```javascript
import { Utils } from 'hs-admin-ui';

// 判断两数组是否相同
Utils.judementSameArr(['read', 'write'], ['write', 'read']); // true

// 判断两个对象是否相同
Utils.isObjectValueEqual({ a: 1 }, { a: 1 }); // true

// 数组、数组对象去重
Utils.removeDuplicate([1, 2, 2, 3]); // [1, 2, 3]
Utils.removeDuplicate([{ id: 1 }, { id: 1 }], 'id'); // [{ id: 1 }]
```
