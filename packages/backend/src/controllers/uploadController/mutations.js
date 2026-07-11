import path from 'node:path';
import fs from 'node:fs';
import { success, error } from '#utils/response';

export const uploadFile = async (ctx) => {
  const file = ctx.request.file;
  
  if (!file) {
    return error(ctx, '请选择要上传的文件');
  }

  const filename = file.originalname || file.originalFilename;
  const filePath = file.path;
  const fileSize = file.size;
  const fileType = file.mimetype;

  const relativePath = filePath.replace(/^uploads[\\/]/, '');
  const uploadUrl = `/uploads/${relativePath}`.replace(/\\/g, '/');

  success(ctx, {
    filename,
    url: uploadUrl,
    size: fileSize,
    type: fileType,
    message: '文件上传成功'
  }, '上传成功');
};

export const uploadFiles = async (ctx) => {
  const files = ctx.request.files;
  
  if (!files || files.length === 0) {
    return error(ctx, '请选择要上传的文件');
  }

  const results = [];
  
  for (const file of files) {
    const filename = file.originalname || file.originalFilename;
    const filePath = file.path;
    const fileSize = file.size;
    const fileType = file.mimetype;

    const relativePath = filePath.replace(/^uploads[\\/]/, '');
    const uploadUrl = `/uploads/${relativePath}`.replace(/\\/g, '/');

    results.push({
      filename,
      url: uploadUrl,
      size: fileSize,
      type: fileType
    });
  }

  success(ctx, {
    files: results,
    count: results.length,
    message: `成功上传 ${results.length} 个文件`
  }, '上传成功');
};

export const deleteFile = async (ctx) => {
  const { filename } = ctx.request.body;

  if (!filename) {
    return error(ctx, '请提供要删除的文件名');
  }

  const filePath = path.join('uploads', filename);

  if (!fs.existsSync(filePath)) {
    return error(ctx, '文件不存在');
  }

  fs.unlinkSync(filePath);

  success(ctx, {
    filename,
    message: '文件删除成功'
  }, '删除成功');
};

export const deleteFiles = async (ctx) => {
  const { filenames } = ctx.request.body;

  if (!filenames || !Array.isArray(filenames) || filenames.length === 0) {
    return error(ctx, '请提供要删除的文件名列表');
  }

  const deleted = [];
  const failed = [];

  for (const filename of filenames) {
    const filePath = path.join('uploads', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      deleted.push(filename);
    } else {
      failed.push(filename);
    }
  }

  success(ctx, {
    deleted,
    failed,
    message: `成功删除 ${deleted.length} 个文件，${failed.length} 个文件不存在`
  }, '操作完成');
};