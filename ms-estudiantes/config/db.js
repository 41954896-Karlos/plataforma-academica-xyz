const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '', // Coloca tu clave de MySQL aquí si tienes
    database: 'db_estudiantes',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;