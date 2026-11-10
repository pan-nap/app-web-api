import 'dotenv/config';
import { createPool } from 'mysql2/promise';
import { hashPassword } from '../src/utils/bcrypt.js';

// 本地测试用 PACS 角色账号（幂等、非破坏：仅 INSERT ... ON DUPLICATE KEY UPDATE）。
// 绝不 DROP/DELETE 任何数据。密码 123456 仅供本地联调，生产务必改密或禁用。
// 用法：node scripts/seedPacsUsers.js
const accounts = [
  { username: 'tech', name: '影像技师', role: 'technologist' },
  { username: 'radio', name: '诊断医师', role: 'radiologist' },
  { username: 'viewer', name: '临床浏览', role: 'viewer' },
];

const seed = async () => {
  const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4',
    connectTimeout: 10000,
  });

  try {
    const connection = await pool.getConnection();
    await connection.execute('SET NAMES utf8mb4');
    const password = await hashPassword('123456');
    for (const a of accounts) {
      await connection.execute(
        `INSERT INTO user (username, password, name, role, status)
         VALUES (?, ?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role), status = 1`,
        [a.username, password, a.name, a.role]
      );
      console.log(`✅ 角色账号就绪: ${a.username} (${a.role})`);
    }
    connection.release();
    console.log('\nPACS 测试角色账号初始化完成（密码均为 123456，仅本地测试用）');
  } catch (error) {
    console.error('\n❌ 失败:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

seed();