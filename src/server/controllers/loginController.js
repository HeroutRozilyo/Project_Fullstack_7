const pool = require('../config/database');

exports.loginUser = async (req, res) => {
  const { Email, password } = req.body;

  try {
    const results = await new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM useraccount WHERE Email = ? AND UserPassword = ?",
        [Email, password],
        (err, results) => {
          if (err) {
            console.error("Database error:", err);
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });

    if (results.length > 0) {
      const user = results[0];
      return res.json({ success: true, user });
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    console.error("Database error:", error);
    return res.json({ success: false });
  }
};

exports.updateUser = (userId, updatedFields) => {
  if (updatedFields.CardNo && updatedFields.CardNo.length > 16) {
    return reject(new Error("Card number is too long. Please provide a valid card number."));
  }
  if (!userId) {
    return Promise.reject(new Error('Invalid user ID'));
  }

  return new Promise((resolve, reject) => {
    pool.query('UPDATE useraccount SET ? WHERE UserID = ?', [updatedFields, userId], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

exports.updatePassword = (userId, newPassword) => {
  return new Promise((resolve, reject) => {
    pool.query('UPDATE useraccount SET UserPassword = ? WHERE UserID = ?', [newPassword, userId], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

exports.deleteUserAndData = async (req, res) => {
  const userID = req.params.userID;

  try {
    // Step 1: Delete user's playlists and songs in the playlists (contains table)
    const deletePlaylistsQuery = "DELETE FROM playlist WHERE UserID = ?";
    await new Promise((resolve, reject) => {
      pool.query(deletePlaylistsQuery, [userID], (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    // Step 2: Delete user from the useraccount table
    const deleteUserQuery = "DELETE FROM useraccount WHERE UserID = ?";
    await new Promise((resolve, reject) => {
      pool.query(deleteUserQuery, [userID], (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    // Return success response
    res.status(200).json({ message: "User and related data deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while deleting the user and data" });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    pool.query('SELECT * FROM useraccount', (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch users' });
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};


