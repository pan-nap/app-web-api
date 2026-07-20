import 'dotenv/config'
import { createPool } from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const initDatabase = async () => {
  try {
    console.log('正在连接数据库服务器...');

    const rootPool = createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      charset: 'utf8mb4',
      connectTimeout: 10000
    });

    const rootConnection = await rootPool.getConnection();

    console.log('正在删除旧数据库...');
    await rootConnection.execute(`DROP DATABASE IF EXISTS ${DB_NAME}`);

    console.log('正在创建数据库...');
    await rootConnection.execute(`CREATE DATABASE ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);

    rootConnection.release();
    await rootPool.end();

    const pool = createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      charset: 'utf8mb4'
    });

    const connection = await pool.getConnection();
    await connection.execute('SET NAMES utf8mb4');
    await connection.execute('SET CHARACTER SET utf8mb4');

    console.log('正在创建用户表...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(50) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(100),
        role VARCHAR(20) DEFAULT 'user',
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('正在创建学生表...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS students (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        gender ENUM('男', '女') NOT NULL,
        school VARCHAR(100) NOT NULL,
        grade VARCHAR(20) NOT NULL,
        class_name VARCHAR(50) NOT NULL,
        id_card VARCHAR(18) NOT NULL UNIQUE,
        phone VARCHAR(20),
        status TINYINT DEFAULT 1,
        has_order TINYINT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('正在创建订单表...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_no VARCHAR(50) NOT NULL UNIQUE,
        school VARCHAR(100) NOT NULL,
        grade VARCHAR(20) NOT NULL,
        class_name VARCHAR(50) NOT NULL,
        package_name VARCHAR(100) NOT NULL,
        package_amount DECIMAL(10,2) NOT NULL,
        order_status ENUM('待处理', '已完成', '已取消') DEFAULT '待处理',
        creator VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('正在创建订单明细表...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        student_id INT NOT NULL,
        payment_status ENUM('已缴费', '未缴费') DEFAULT '未缴费',
        payment_time DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (student_id) REFERENCES students(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('正在创建文书表...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS documents (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        type ENUM('template', 'instance') NOT NULL DEFAULT 'instance',
        template_id INT NULL,
        content LONGTEXT,
        patient_id VARCHAR(100),
        status ENUM('draft', 'completed', 'archived') DEFAULT 'draft',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (template_id) REFERENCES documents(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 兼容旧表：将 title 列重命名为 name
    const [hasTitleCol] = await connection.execute(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'documents' AND COLUMN_NAME = 'title'
    `);
    if (hasTitleCol.length > 0) {
      await connection.execute(`ALTER TABLE documents CHANGE title name VARCHAR(255) NOT NULL`);
      console.log('已将 documents.title 列重命名为 name');
    }

    console.log('正在创建文书变量值表...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS document_values (
        id INT PRIMARY KEY AUTO_INCREMENT,
        document_id INT NOT NULL,
        var_key VARCHAR(100) NOT NULL,
        var_value TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uk_doc_var (document_id, var_key),
        FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('正在初始化字典表...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS dictionaries (
        id INT PRIMARY KEY AUTO_INCREMENT,
        type VARCHAR(50) NOT NULL,
        label VARCHAR(100) NOT NULL,
        value VARCHAR(100) NOT NULL,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const [schoolExists] = await connection.execute('SELECT COUNT(*) as count FROM dictionaries WHERE type = ?', ['school']);
    if (schoolExists[0].count === 0) {
      console.log('正在初始化字典数据...');
      const dictionaries = [
        ['school', '第一小学', '第一小学', 1],
        ['school', '第二小学', '第二小学', 2],
        ['school', '第三小学', '第三小学', 3],
        ['school', '实验中学', '实验中学', 4],
        ['grade', '一年级', '一年级', 1],
        ['grade', '二年级', '二年级', 2],
        ['grade', '三年级', '三年级', 3],
        ['grade', '四年级', '四年级', 4],
        ['grade', '五年级', '五年级', 5],
        ['grade', '六年级', '六年级', 6],
        ['class', '一班', '一班', 1],
        ['class', '二班', '二班', 2],
        ['class', '三班', '三班', 3],
        ['class', '四班', '四班', 4]
      ];
      for (const dict of dictionaries) {
        await connection.execute('INSERT INTO dictionaries (type, label, value, sort_order) VALUES (?, ?, ?, ?)', dict);
      }
    }

    console.log('正在初始化管理员账号...');
    const password = await bcrypt.hash('123456', 10);
    await connection.execute(
      'INSERT INTO user (username, password, name, role, status) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE password = ?, name = ?, role = ?, status = ?',
      ['admin', password, '管理员', 'admin', 1, password, '管理员', 'admin', 1]
    );

    connection.release();
    await pool.end();

    console.log('\n✅ 数据库初始化完成！');
    console.log('数据库: ' + DB_NAME);
    console.log('用户名: admin');
    console.log('密码: 123456');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ 初始化失败:', error.message);
    process.exit(1);
  }
};

initDatabase();
