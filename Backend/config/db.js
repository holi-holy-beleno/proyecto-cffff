// config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Prioriza la URL de conexión completa si existe, o construye con las variables individuales
const connectionConfig = process.env.MYSQL_URL || process.env.DATABASE_URL
  ? {
      uri: process.env.MYSQL_URL || process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // Requerido en algunas conexiones de la nube
    }
  : {
      host: process.env.MYSQLHOST || 'kodama.proxy.rlwy.net',
      user: process.env.MYSQLUSER || 'root',
      password: process.env.MYSQLPASSWORD || 'GruSjsmLltyYNFZKefdbweFOkRQoiBvy',
      database: process.env.MYSQLDATABASE || 'railway',
      port: process.env.MYSQLPORT || 47514,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };

const pool = mysql.createPool(
  process.env.MYSQL_PUBLIC_URL 
    ? { uri: process.env.MYSQL_PUBLIC_URL }
    : connectionConfig
);

module.exports = pool;
