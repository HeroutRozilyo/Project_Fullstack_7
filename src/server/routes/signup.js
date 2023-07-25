const express = require("express");
const router = express.Router();

// Require controller module
const signupController = require("../controllers/signupController");

// signup route
router.post("/", signupController.registerUser);

module.exports = router;
