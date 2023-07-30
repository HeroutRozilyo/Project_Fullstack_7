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


