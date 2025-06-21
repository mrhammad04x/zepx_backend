

const mysql = require("mysql");
const mysql2 = require("mysql2/promise");

// Create a regular connection for backward compatibility
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Add getConnection method to the existing connection object
connection.getConnection = async function() {
    // If pool doesn't exist, create it
    if (!connection.pool) {
        connection.pool = mysql2.createPool({
            host: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }
    
    // Return a connection from the pool
    return await connection.pool.getConnection();
};

module.exports = connection;
