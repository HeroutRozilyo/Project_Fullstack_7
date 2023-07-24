const pool = require('../config/database');

exports.registerUser = async (req, res) => {
  const {  username, email, password, dob, gender, street, city, province, postalCode } = req.body;

  try {
    const results = await new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          console.error('Database connection error:', err);
          return reject(err);
        }

        connection.beginTransaction((err) => {
          if (err) {
            console.error('Transaction start error:', err);
            return reject(err);
          }

          // Insert into useraccount table
          connection.query(
            'INSERT INTO useraccount (Email, Username, UserPassword, Dob, Gender) VALUES (?, ?, ?, ?, ?)',
            [email, username, password, dob, gender],
            (err, userResults) => {
              if (err) {
                console.error('Insert into useraccount table error:', err);
                connection.rollback(() => {
                  connection.release();
                  reject(err);
                });
              } else {
                const userId = userResults.insertId;

                // Insert into addressuser table
                connection.query(
                  'INSERT INTO addressuser (UserID, Street, City, Province, PostalCode) VALUES (?, ?, ?, ?, ?)',
                  [userId, street, city, province, postalCode],
                  (err) => {
                    if (err) {
                      console.error('Insert into addressuser table error:', err);
                      connection.rollback(() => {
                        connection.release();
                        reject(err);
                      });
                    } else {
                      connection.commit((err) => {
                        if (err) {
                          console.error('Transaction commit error:', err);
                          connection.rollback(() => {
                            connection.release();
                            reject(err);
                          });
                        } else {
                          connection.release();
                          resolve(userId);
                        }
                      });
                    }
                  }
                );
              }
            }
          );
        });
      });
    });

    return res.json({ success: true, userId: results });
  } catch (error) {
    console.error('Database error:', error);
    return res.json({ success: false });
  }
};
