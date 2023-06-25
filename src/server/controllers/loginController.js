exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  // Perform the database query
  pool.query(
    "SELECT * FROM useraccount WHERE Email = ? AND UserPassword = ?",
    [Email, password],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.json({ success: false });
      }

      // Check if a matching user record is found
      if (results.length > 0) {
        // Save user information in local storage
        const user = results[0];

        return res.json({ success: true, user });
      } else {
        return res.json({ success: false });
      }
    }
  );
};
