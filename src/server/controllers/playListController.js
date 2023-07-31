const pool = require("../config/database");

exports.getAllPlaylist = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      //  const query = `SELECT * from playlist`;

      const query =
        "SELECT * FROM playlist WHERE UserID = 0 OR UserID = 876543210;";
      //    "SELECT PlaylistID, MIN(PlaylistName) AS PlaylistName, MIN(nameIMAG) AS nameIMAG, MIN(UserID) AS UserID FROM playlist GROUP BY PlaylistID;";
      // Execute the query and handle the result
      pool.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    if (result) {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching songs" });
  }
};

exports.getAllPlayListSongs = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const playID = req.params.id;
      const query = `select * from song
      where SongID in(
      select SongID from contains
      where PlaylistID=${playID})`;

      // Execute the query and handle the result
      pool.query(query, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    if (result) {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching songs" });
  }
};

const insertToContain = (playlistId, songId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO contains (PlaylistID , SongID) VALUES (? ,?)`,
      [playlistId, songId],
      (err, resu) => {
        if (err) {
          console.error("Insert into useraccount table error:", err);
          reject(err);
        } else {
          resolve("true");
        }
      }
    );
  });
};
exports.addPlaylist = async (req, res) => {
  try {
    const { userid, playlistid, playlistName, nameIMAG, selectedSongs } =
      req.body;
    const result = new Promise((resolve, reject) => {
      pool.query(
        "INSERT INTO playlist (UserID, PlaylistID, PlaylistName, nameIMAG) VALUES (?, ?, ?, ?) ",
        [userid, playlistid, playlistName, nameIMAG],
        (err, resu) => {
          if (err) {
            console.error("Insert into useraccount table error:", err);
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });

    await Promise.all(
      selectedSongs.map((song) => insertToContain(playlistid, song.SongID))
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ success: false });
  }
};

exports.LikePlaylist = async (req, res) => {
  try {
    const { userid, playlistid, playlistName, nameIMAG } = req.body;

    // Check if the playlist with given playlistid and userid already exists
    pool.query(
      `SELECT * FROM playlist WHERE PlaylistID = ? AND UserID = ?`,
      [playlistid, userid],
      (err, rows) => {
        if (err) {
          console.error("Error executing SELECT query:", err);
          res.status(500).json({ success: false });
        } else {
          // If the query returns no rows, the combination doesn't exist, so insert it
          if (rows.length === 0) {
            pool.query(
              `INSERT INTO playlist (PlaylistID, UserID, PlaylistName, nameIMAG) VALUES (?, ?, ?, ?)`,
              [playlistid, userid, playlistName, nameIMAG],
              (insertErr) => {
                if (insertErr) {
                  console.error(
                    "Error inserting into playlist table:",
                    insertErr
                  );
                  res.status(500).json({ success: false });
                } else {
                  res.status(200).json({
                    success: true,
                    message:
                      "The playlist has been added to your favorites list",
                  });
                }
              }
            );
          } else {
            // Combination already exists, handle the case as needed
            res.status(200).json({
              success: true,
              message: "Playlist already exists for the user.",
            });
          }
        }
      }
    );
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ success: false });
  }
};
exports.getAllLikePlaylist = async (req, res) => {
  try {
    const userid = req.params.id;
    const result = await new Promise((resolve, reject) => {
      pool.query(
        `SELECT * FROM playlist WHERE UserID = ?`,
        [userid],
        (err, rows) => {
          if (err) {
            // <-- Corrected the variable name here
            reject(err);
          } else {
            resolve(rows); // <-- Corrected the variable name here
          }
        }
      );
    });

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "Playlist not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching songs" });
  }
};

exports.removeFromFavorite = async (req, res) => {
  try {
    const userId = req.params.id;
    const playlistId = req.params.LikeD;
    const result = await new Promise((resolve, reject) => {
      pool.query(
        "DELETE FROM playlist WHERE PlaylistID = ? AND UserID = ?",
        [playlistId, userId],
        (err, rows) => {
          if (err) {
            // <-- Corrected the variable name here
            reject(err);
          } else {
            resolve(rows); // <-- Corrected the variable name here
          }
        }
      );
    });

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "Playlist not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching songs" });
  }
};
