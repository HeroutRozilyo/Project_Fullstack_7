const express = require("express");
const router = express.Router();

// Require controller module
const playListController = require("../controllers/playListController");

// Login route
router.get("/", playListController.getAllPlaylist);
router.get("/:id", playListController.getAllPlayListSongs);
router.post("/creatPlayList", playListController.addPlaylist);
router.post("/Like", playListController.LikePlaylist);
router.get("/Like/:id", playListController.getAllLikePlaylist);
router.delete("/Like/:id/:LikeD", playListController.removeFromFavorite);

module.exports = router;
