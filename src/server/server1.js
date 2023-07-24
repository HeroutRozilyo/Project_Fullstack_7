const express = require("express");
const loginRoutes = require("./routes/login.js");
const signupRoutes = require("./routes/signup.js");
const pool = require("./config/database.js");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Use login routes
app.use("/api/login", loginRoutes);
app.use("/api/signup",signupRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
