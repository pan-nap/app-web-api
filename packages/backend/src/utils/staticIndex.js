// utils/staticIndex.js
import path from 'node:path';
import fs from 'node:fs/promises';

export default function staticIndex(rootDir) {
  return async (ctx, next) => {
    // 只处理 /uploads 相关路径
    if (!ctx.path.startsWith('/uploads')) {
      return next();
    }

    // 处理 /uploads 重定向到 /uploads/
    if (ctx.path === '/uploads') {
      ctx.redirect('/uploads/');
      return;
    }

    const uploadRoot = path.join(rootDir, '../uploads');
    // 提取相对路径
    let relative = ctx.path.slice('/uploads'.length);
    relative = relative.replace(/^\//, '');
    const targetPath = path.join(uploadRoot, relative);

    // 安全检查：防止目录穿越
    if (!targetPath.startsWith(uploadRoot)) {
      ctx.status = 403;
      ctx.body = 'Forbidden';
      return;
    }

    try {
      const stat = await fs.stat(targetPath);
      
      // 如果是文件，交给 koa-static 处理
      if (!stat.isDirectory()) {
        return next();
      }

      // 是目录，生成列表页面
      const files = await fs.readdir(targetPath);
      const fileList = await generateFileList(targetPath, files, ctx.path);
      
      ctx.type = 'html';
      ctx.body = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>目录浏览 - ${ctx.path}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background: #f5f5f5;
              padding: 20px;
            }
            .container {
              max-width: 1200px;
              margin: 0 auto;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background: #4a90e2;
              color: white;
              padding: 20px 30px;
            }
            .header h1 {
              font-size: 20px;
              font-weight: 500;
            }
            .breadcrumb {
              padding: 15px 30px;
              background: #fafafa;
              border-bottom: 1px solid #e0e0e0;
              font-size: 14px;
            }
            .breadcrumb a {
              color: #4a90e2;
              text-decoration: none;
            }
            .breadcrumb a:hover {
              text-decoration: underline;
            }
            .files {
              padding: 10px 30px 20px;
            }
            .file-item {
              padding: 10px 0;
              border-bottom: 1px solid #f0f0f0;
              display: flex;
              align-items: center;
            }
            .file-item:hover {
              background: #f9f9f9;
            }
            .file-item a {
              text-decoration: none;
              color: #333;
              font-size: 14px;
              flex: 1;
              padding: 5px;
            }
            .file-item a:hover {
              color: #4a90e2;
            }
            .icon,.img-icon {
              font-size: 20px;
              margin-right: 10px;
            }
            .img-icon{
              width: 20px;
              height: 20px;
              border-radius: 4px;
              overflow: hidden;
              object-fit: cover;
            }
            .size {
              color: #999;
              font-size: 12px;
              width: 100px;
              text-align: right;
            }
            .empty {
              text-align: center;
              padding: 40px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📁 文件浏览 - ${escapeHtml(ctx.path)}</h1>
            </div>
            <div class="files">
              ${fileList}
            </div>
          </div>
        </body>
        </html>
      `;
      
    } catch (err) {
      // 文件或目录不存在，交给下一个中间件（可能会返回 404）
      return next();
    }
  };
}

async function generateFileList(targetPath, files, currentPath) {
  if (files.length === 0) {
    return '<div class="empty">📂 此目录为空</div>';
  }
  
  // 确保路径结尾有斜杠
  const basePath = currentPath.endsWith('/') ? currentPath : currentPath + '/';
  
  let html = '';
  
  // 添加返回上级目录（如果不是根目录）
  if (currentPath !== '/uploads/') {
    html += `
      <div class="file-item">
        <span class="icon">📁</span>
        <a href="../">..</a>
        <span class="size">上级目录</span>
      </div>
    `;
  }
  
  // 排序：目录在前，文件在后
  const items = [];
  for (const file of files) {
    const fullPath = path.join(targetPath, file);
    const stat = await fs.stat(fullPath);
    items.push({
      name: file,
      isDirectory: stat.isDirectory(),
      size: stat.size
    });
  }
  
  items.sort((a, b) => {
    if (a.isDirectory === b.isDirectory) {
      return a.name.localeCompare(b.name);
    }
    return a.isDirectory ? -1 : 1;
  });
  
  // 生成文件列表
  for (const item of items) {
    const link = basePath + encodeURIComponent(item.name) + (item.isDirectory ? '/' : '');
    const name = escapeHtml(item.name)
    const isImag = name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png');
    let icon = item.isDirectory
        ? '<span class="icon">📁</span>'
        : isImag ? `<img src="${link}" class="img-icon">` : '📄'
    
    const sizeText = item.isDirectory ? '-' : formatFileSize(item.size);
    
    
    html += `
      <div class="file-item">
        ${icon}
        <a href="${link}">${name}${item.isDirectory ? '/' : ''}</a>
        <span class="size">${sizeText}</span>
      </div>
    `;
  }
  
  return html;
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}