const pool = require("../config/database");

exports.registerUser = async (req, res) => {
    try {
        console.log(req.body); 
      const { username, email, password, dob, gender, cardNo } = req.body;
      const result = await new Promise((resolve, reject) => {
        pool.query(
          "INSERT INTO useraccount (Email, Username, UserPassword, Dob, Gender, CardNo) VALUES (?, ?, ?, ?, ?, ?)",
          [email, username, password, dob, gender, cardNo],
          (err, resu) => {
            if (err) {
              console.error("Insert into useraccount table error:", err);
              reject(err);
            } else {
              resolve(resu);
              res.status(200).json({ success: true });
            }
          }
        );
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ success: false });
    }
  };
  
