const express = require("express");
const router = express.Router();

// Require controller module
const loginController = require("../controllers/loginController");
<<<<<<< HEAD
<<<<<<< HEAD
//const signupController = require("../controllers/signupController");
// Login route
router.post("/", loginController.loginUser);
//router.post("/register", signupController.registerUser);
=======
// Login route
router.post("/", loginController.loginUser);
>>>>>>> d7d9c475590917594495d76ab745cd8a91356c60
=======
// Login route
router.post("/", loginController.loginUser);
>>>>>>> d7d9c475590917594495d76ab745cd8a91356c60

module.exports = router;
