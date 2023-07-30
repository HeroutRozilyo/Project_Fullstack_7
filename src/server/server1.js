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

// Connect to the database
pool.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err.stack);
    return;
  }
  console.log("Connected to the database.");
});

// Use routes
app.use("/api/user", loginRoutes);
app.use("/api/register", signupRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/playList", playListRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
