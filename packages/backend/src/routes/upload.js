import Router from '@koa/router';
import multer from '@koa/multer';
import path from 'node:path';
import fs from 'node:fs';
import { uploadFile, uploadFiles, deleteFile, deleteFiles } from '#controllers/uploadController';
import { authMiddleware } from '#middleware/auth';
import { wrap } from '#utils/response';

const router = new Router();

// 验证并清理子目录名称，防止路径遍历攻击
const sanitizeSubDir = (subDir) => {
  if (!subDir || typeof subDir !== 'string') {
    return '';
  }
  // 移除路径遍历字符和特殊字符
  let cleanDir = subDir.replace(/\.\./g, '').replace(/\//g, '_').replace(/\\/g, '_');
  // 移除开头和结尾的下划线
  cleanDir = cleanDir.replace(/^_+/, '').replace(/_+$/, '');
  return cleanDir;
};

/**
 * 自定义文件存储策略
 * 方式1：通过 FormData 添加 path 字段
 * formData.append('path', 'images');
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const _path = sanitizeSubDir(req.body?.path);
    const baseDir = 'uploads/';
    const destDir = _path ? path.join(baseDir, _path) : baseDir;
    
    // 确保目录存在
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    cb(null, destDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = (file.originalname || file.originalFilename || 'tmp').split('.').pop();
    cb(null, uniqueSuffix + '.' + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024
  },
  fileFilter: function (req, file, cb) {
    cb(null, true);
  }
});

router.post('/upload', authMiddleware, upload.single('file'), wrap(uploadFile));
router.post('/upload/batch', authMiddleware, upload.array('files', 20), wrap(uploadFiles));
router.delete('/upload', authMiddleware, wrap(deleteFile));
router.delete('/upload/batch', authMiddleware, wrap(deleteFiles));

export default router;