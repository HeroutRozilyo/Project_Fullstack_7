const pool = require("../config/database");

exports.registerUser = async (req, res) => {
  try {
    const { id, username, email, password, dob, gender } = req.body;
    const result = await new Promise((resolve, reject) => {
      pool.query(
        "INSERT INTO useraccount (UserID, Email, Username, UserPassword, Dob, Gender) VALUES (?,?, ?, ?, ?, ?)",
        [id, email, username, password, dob, gender],
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
    res.status(500).json({ success: false });
  }
};

// exports.registerUser = async (req, res) => {
//   const { username, email, password, dob, gender } = req.body;
//   const id = "3";
//   try {
//     const results = await new Promise((resolve, reject) => {
//       pool.getConnection((err, connection) => {
//         if (err) {
//           console.error("Database connection error:", err);
//           return reject(err);
//         }

//         connection.beginTransaction((err) => {
//           if (err) {
//             console.error("Transaction start error:", err);
//             return reject(err);
//           }

//           // Insert into useraccount table
//           connection.query(
//             "INSERT INTO useraccount (UserID, Email, Username, UserPassword, Dob, Gender) VALUES (?, ?, ?, ?, ?)",
//             [is, email, username, password, dob, gender],
//             (err, userResults) => {
//               if (err) {
//                 console.error("Insert into useraccount table error:", err);
//                 console.log(`1`);

//                 reject(err);
//               } else {
//                 console.log(`2`);
//                 resolve(userResults);
//               }
//             }
//           );
//         });
//       });
//     });

//     return res.json({ success: true, userId: results });
//   } catch (error) {
//     console.error("Database error:", error);
//     return res.json({ success: false });
//   }
// };
