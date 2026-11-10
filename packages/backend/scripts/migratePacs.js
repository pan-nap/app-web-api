import 'dotenv/config';
import { createPool } from 'mysql2/promise';
import { pacsTables } from './pacsSchema.js';

// 非破坏性迁移：仅向现有库追加 PACS 表（IF NOT EXISTS），不清空任何数据。
// 用法：node scripts/migratePacs.js
const migrate = async () => {
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
    for (const table of pacsTables) {
      await connection.execute(table.sql);
      console.log(`✅ 表就绪: ${table.name}`);
    }
    connection.release();
    console.log(`\nPACS 表迁移完成（数据库: ${process.env.DB_NAME}）`);
  } catch (error) {
    console.error('\n❌ 迁移失败:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

migrate();