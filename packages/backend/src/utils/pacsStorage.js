import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, '../../');

// 测试环境隔离到 uploads/pacs_test，避免清理测试文件时波及生产影像。
export const storageRoot =
  process.env.PACS_STORAGE_DIR ||
  path.join(backendRoot, 'uploads', process.env.NODE_ENV === 'test' ? 'pacs_test' : 'pacs');

// 相对路径统一用正斜杠存库，保证跨平台可移植。
export function instanceRelPath(studyUid, seriesUid, sopUid) {
  return `${studyUid}/${seriesUid}/${sopUid}.dcm`;
}

// 防止路径越界：解析后的绝对路径必须仍位于 storageRoot 内。
function resolveInside(relPath) {
  const abs = path.resolve(storageRoot, relPath);
  const root = path.resolve(storageRoot);
  if (abs !== root && !abs.startsWith(root + path.sep)) {
    throw new Error('非法的影像存储路径');
  }
  return abs;
}

export async function writeInstance(relPath, buffer) {
  const abs = resolveInside(relPath);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, buffer);
  return relPath;
}

export async function readInstance(relPath) {
  try {
    return await fs.readFile(resolveInside(relPath));
  } catch (e) {
    if (e.code === 'ENOENT') return null;
    throw e;
  }
}

// 仅供测试清理使用。
export async function clearAll() {
  await fs.rm(storageRoot, { recursive: true, force: true });
}