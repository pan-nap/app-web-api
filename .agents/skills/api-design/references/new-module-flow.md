---
name: new-module-flow
description: 新增模块流程、路径别名配置、检查清单与常见错误
---

# 新增模块流程

1. **创建控制器目录：** `src/controllers/{module}Controller/`
2. **创建 index.js：** 导出所有操作
3. **创建操作文件：** 按照控制器模式
4. **创建路由文件：** `src/routes/{module}.js`
5. **注册路由：** 添加到 `src/index.js`
6. **更新导入：** 在 `src/routes/{module}.js` 中导入控制器
7. **⚠️ 更新路径别名：** 在 `package.json` 的 `imports` 字段中添加控制器路径别名

## ⚠️ 重要：路径别名配置

**新增模块后，必须在 `package.json` 中添加路径别名**，否则会报错：

```
TypeError [ERR_PACKAGE_IMPORT_NOT_DEFINED]: Package import specifier "#controllers/{module}Controller" is not defined
```

**配置方法：** 在 `package.json` 的 `imports` 字段中添加：

```json
{
  "imports": {
    "#config/*": "./src/config/*.js",
    "#controllers/authController": "./src/controllers/authController/index.js",
    "#controllers/dictionaryController": "./src/controllers/dictionaryController/index.js",
    "#controllers/{module}Controller": "./src/controllers/{module}Controller/index.js",
    "#middleware/*": "./src/middleware/*.js",
    "#models/*": "./src/models/*.js",
    "#routes/*": "./src/routes/*.js",
    "#services/*": "./src/services/*.js",
    "#utils/*": "./src/utils/*.js",
    "#validators/*": "./src/validators/*.js"
  }
}
```

## 检查清单

| 检查项 | 说明 | 验证方式 |
|--------|------|----------|
| 控制器路径别名 | 在 `imports` 中添加 `#controllers/{module}Controller` | 搜索 `package.json` 中的 `imports` |
| 路由文件导入 | 使用路径别名导入控制器 | 检查路由文件中的 `import` 语句 |
| 重启服务 | 修改 `package.json` 后需重启 | 检查服务是否正常运行 |

## 常见错误

| 错误信息 | 原因 | 解决方法 |
|----------|------|----------|
| `ERR_PACKAGE_IMPORT_NOT_DEFINED` | 路径别名未定义 | 在 `package.json` 中添加对应别名 |
| `Cannot find module` | 路径别名配置错误 | 检查路径是否正确指向 `index.js` |
