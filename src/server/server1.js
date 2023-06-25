const mysql = require("mysql2");
const express = require("express");
const loginRoutes = require("./routes/login");
const app = express();

const port = 3001;

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "123456",
  database: "fullstack7",
});

app.use("/api/login", loginRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
