const express = require("express");
const router = express.Router();

// Require controller module
const loginController = require("../controllers/loginController");
const signupController = require("../controllers/signupController");
// Login route
router.post("/", loginController.loginUser);
router.post("/register", signupController.registerUser);

module.exports = router;
