const express = require("express");
const loginRoutes = require("./routes/loginR.js");
const signupRoutes = require("./routes/signup.js");
const songRoutes = require("./routes/songsR.js");
const playListRoutes = require("./routes/playListR.js");
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
app.use("/api/songs", songRoutes);
app.use("/api/playList", playListRoutes);

app.post("/api/playList/Like", (req, res) => {});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
