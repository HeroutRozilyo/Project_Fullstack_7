const pool = require("../config/database");

exports.getAllPlaylist = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      //  const query = `SELECT * from playlist`;

      const query =
        "SELECT * FROM playlist WHERE UserID = 0 OR UserID = 483957943";
      //    "SELECT PlaylistID, MIN(PlaylistName) AS PlaylistName, MIN(nameIMAG) AS nameIMAG, MIN(UserID) AS UserID FROM playlist GROUP BY PlaylistID;";
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

exports.getAllPlaylistAll = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const query = `
      SELECT playlist.*, useraccount.UserName, useraccount.UserID
      FROM playlist
      INNER JOIN useraccount ON playlist.UserID = useraccount.UserID;
      `;

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
    res
      .status(500)
      .json({ error: "An error occurred while fetching playlists" });
  }
};

exports.getAllPlayListSongs = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const playID = req.params.id;
      const query = `
  SELECT song.*, artist.ArtistName
  FROM song
  INNER JOIN artist ON song.ArtistID = artist.ArtistID
  WHERE song.SongID IN (
    SELECT SongID FROM contains WHERE PlaylistID=${playID}
  );
`;
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
            reject(err);
          } else {
            resolve(rows);
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
            reject(err);
          } else {
            resolve(rows);
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

exports.updatePlaylist = async (req, res) => {
  try {
    const playlistID = req.params.id;
    const { playlistName, selectedSongs } = req.body;

    pool.query(
      "UPDATE playlist SET PlaylistName = ? WHERE PlaylistID = ?",
      [playlistName, playlistID],
      async (error, result) => {
        if (error) {
          console.error("Error updating playlist name:", error);
          res
            .status(500)
            .json({
              success: false,
              message: "Failed to update playlist name",
            });
        } else {
          try {
            await new Promise((resolve, reject) => {
              pool.query(
                "DELETE FROM contains WHERE PlaylistID = ?",
                [playlistID],
                (error, result) => {
                  if (error) {
                    console.error(
                      "Error deleting existing songs from playlist:",
                      error
                    );
                    reject(error);
                  } else {
                    resolve(result);
                  }
                }
              );
            });

            const values = selectedSongs.map((song) => [
              playlistID,
              song.SongID,
            ]);
            await new Promise((resolve, reject) => {
              pool.query(
                "INSERT INTO contains (PlaylistID, SongID) VALUES ?",
                [values],
                (error, result) => {
                  if (error) {
                    console.error(
                      "Error inserting new songs into playlist:",
                      error
                    );
                    reject(error);
                  } else {
                    resolve(result);
                  }
                }
              );
            });

            res
              .status(200)
              .json({
                success: true,
                message: "Playlist updated successfully",
              });
          } catch (error) {
            console.error("Error updating playlist:", error);
            res
              .status(500)
              .json({ success: false, message: "Failed to update playlist" });
          }
        }
      }
    );
  } catch (error) {
    console.error("Error updating playlist:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update playlist" });
  }
};
