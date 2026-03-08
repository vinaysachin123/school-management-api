const mysql = require('mysql2/promise');
require('dotenv').config();

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

const initializeDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: poolConfig.host,
      user: poolConfig.user,
      password: poolConfig.password
    });

    const dbName = process.env.DB_NAME || 'school_management';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.end();

    pool = mysql.createPool({ ...poolConfig, database: dbName });

    const poolConnection = await pool.getConnection();

    await poolConnection.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL
      )
    `);

    console.log('MySQL Database initialized successfully.');
    poolConnection.release();
  } catch (error) {
    console.error('Error initializing MySQL database:', error);
  }
};

module.exports = {
  get pool() { return pool; },
  initializeDatabase
};
