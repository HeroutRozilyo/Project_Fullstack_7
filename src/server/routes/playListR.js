const express = require("express");
const router = express.Router();

// Require controller module
const playListController = require("../controllers/playListController");

// Login route
router.get("/", playListController.getAllPlaylist);
router.get("/:id", playListController.getAllPlayListSongs);

module.exports = router;
