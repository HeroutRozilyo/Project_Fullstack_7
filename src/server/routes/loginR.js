const express = require("express");
const router = express.Router();

// Require controller module
const loginController = require("../controllers/loginController");

// Login route
router.post("/", loginController.loginUser);

module.exports = router;
