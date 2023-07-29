const pool = require("../config/database");

exports.getAllPlaylist = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      //const query = `SELECT * from playlist`;

      const query =
        "SELECT PlaylistID, MIN(PlaylistName) AS PlaylistName, MIN(nameIMAG) AS nameIMAG, MIN(nameIMAG) AS nameIMAG, FROM playlist GROUP BY PlaylistID;";
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
    const result = new Promise((resolve, reject) => {
      pool.query(
        `SELECT * FROM playlist WHERE PlaylistID = ? AND UserID = ?`,
        [playlistid, userid],
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

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ success: false });
  }
};
