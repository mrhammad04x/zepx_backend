const mysql = require("mysql");
const mysql2 = require("mysql2/promise");

// ✅ Base connection (for legacy or .query use)
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ✅ Add mysql2-based pool under the same connection object (used only when needed)
let pool = null;

connection.getConnection = async function () {
  try {
    if (!pool) {
      pool = mysql2.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }
    return await pool.getConnection();
  } catch (err) {
    console.error("❌ Failed to get pool connection:", err.message);
    throw err;
  }
};

module.exports = connection;
