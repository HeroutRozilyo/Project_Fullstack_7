const express = require("express");
const router = express.Router();

// Require controller module
const { loginUser, updateUser, updatePassword } = require("../controllers/loginController"); // Make sure to import the updatePassword function

// Login route
router.post("/", loginUser);

// Update user route
router.put("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const updatedFields = req.body; // Assuming the updatedFields object contains the fields to update

  try {
    const result = await updateUser(userId, updatedFields);
    res.status(200).json({ success: true, message: 'User information updated successfully' });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ success: false, message: 'Failed to update user information' });
  }
});

// Update password route
router.put("/password/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { password } = req.body;

  try {
    // Update user password and handle validation errors
    await updatePassword(userId, password);
    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error("Database error:", error);
    // Handle validation error and other errors
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
