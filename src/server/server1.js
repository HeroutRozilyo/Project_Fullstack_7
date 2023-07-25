const express = require("express");
const loginRoutes = require("./routes/loginR.js");
const signupRoutes = require("./routes/signup.js");
const pool = require("./config/database.js");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
pool.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err.stack);
    return;
  }
  console.log("Connected to the database.");
});

// Use login routes
app.use("/api/login", loginRoutes);
app.use("/api/register", signupRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
