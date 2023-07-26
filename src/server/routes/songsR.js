const express = require("express");
const router = express.Router();

// Require controller module
const songController = require("../controllers/songController");

// signup route
router.get("/", songController.getAllSong);

module.exports = router;
