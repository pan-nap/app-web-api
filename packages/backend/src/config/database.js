import 'dotenv/config'
import { createPool } from 'mysql2/promise';

export const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000
});

/** 获取数据库连接  */
export const getConnectionWithCharset = async (run) => {
  const connection = await pool.getConnection();
  try {
    return await run(connection);
  } finally {
    connection.release();
  }
};