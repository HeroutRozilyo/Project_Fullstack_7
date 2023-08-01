const express = require("express");
const router = express.Router();

const signupController = require("../controllers/signupController");

// signup route
router.post("/", signupController.registerUser);

module.exports = router;
