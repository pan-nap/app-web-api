import { getConnectionWithCharset, pool } from '#config/database';
import { clearAll } from '#utils/pacsStorage';
import { pacsTables } from '../../scripts/pacsSchema.js';

// 幂等建表：让 PACS 测试不依赖手动跑过迁移脚本。
export async function ensurePacsTables() {
  return getConnectionWithCharset(async (connection) => {
    for (const table of pacsTables) await connection.query(table.sql);
  });
}

// 清空 PACS 自有表（子表优先以满足外键）+ 清理测试影像目录（uploads/pacs_test）。
// 与项目其它后端测试一致：使用真实开发库，仅清理本模块数据。
export async function cleanPacsData() {
  await getConnectionWithCharset(async (connection) => {
    await connection.query('DELETE FROM pacs_instances');
    await connection.query('DELETE FROM pacs_series');
    await connection.query('DELETE FROM pacs_studies');
    await connection.query('DELETE FROM pacs_annotations');
  });
  await clearAll();
}

export async function closePacsPool() {
  await pool.end();
}