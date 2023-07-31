import express from "express";
import loginRoutes from "./src/server/routes/loginR.js";
import signupRoutes from "./src/server/routes/signup.js";
import songRoutes from "./src/server/routes/songsR.js";
import playListRoutes from "./src/server/routes/playListR.js";
import pool from "./src/server/config/database.js";
import cors from "cors";
import path from "path";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));
// Define a route to handle all other requests and serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

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
