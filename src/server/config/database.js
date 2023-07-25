const mysql = require("mysql2");

// Create a MySQL connection pool
const pool = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "123456",
  database: "fullstack7",
});

module.exports = pool;
