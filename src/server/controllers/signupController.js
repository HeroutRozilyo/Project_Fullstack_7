const pool = require("../config/database");

exports.registerUser = async (req, res) => {
  const { username, email, password, dob, gender } = req.body;

  try {
    const results = await new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          console.error("Database connection error:", err);
          return reject(err);
        }

        connection.beginTransaction((err) => {
          if (err) {
            console.error("Transaction start error:", err);
            return reject(err);
          }

          // Insert into useraccount table
          connection.query(
            "INSERT INTO useraccount (Email, Username, UserPassword, Dob, Gender) VALUES (?, ?, ?, ?, ?)",
            [email, username, password, dob, gender],
            (err, userResults) => {
              if (err) {
                console.error("Insert into useraccount table error:", err);
                console.log(`1`);

                reject(err);
              } else {
                console.log(`2`);
                resolve(userResults);
              }
            }
          );
        });
      });
    });

    return res.json({ success: true, userId: results });
  } catch (error) {
    console.error("Database error:", error);
    return res.json({ success: false });
  }
};
