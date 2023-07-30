const express = require("express");
const router = express.Router();
const {
  getAllSong,
  addSong,
  deleteSong,
} = require("../controllers/songController.js");

// GET all songs
router.get("/", getAllSong);

// DELETE song by ID
router.delete("/:id", deleteSong);
// POST add a new song
router.post("/songs", addSong);

module.exports = router;
