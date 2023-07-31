const express = require("express");
const router = express.Router();

// Require controller module
const playListController = require("../controllers/playListController");

// Login route
router.get("/", playListController.getAllPlaylist);
router.get("/all", playListController.getAllPlaylistAll);
router.get("/:id", playListController.getAllPlayListSongs);
router.post("/creatPlayList", playListController.addPlaylist);
router.put("/updatePlaylist/:id", playListController.updatePlaylist);
router.post("/Like", playListController.LikePlaylist);
router.get("/Like/:id", playListController.getAllLikePlaylist);
router.delete("/LikeD/:id/:LikeD", playListController.removeFromFavorite);

module.exports = router;
