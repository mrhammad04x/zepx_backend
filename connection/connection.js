const mysql = require("mysql");
const mysql2 = require("mysql2/promise");

// Create a regular connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


// Add getConnection method for mysql2 (optional)
connection.getConnection = async function () {
    if (!connection.pool) {
        connection.pool = mysql2.createPool({
            host: process.env.DB_HOST,      // ✅ Fix here
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
    return await connection.pool.getConnection();
};

module.exports = connection;
