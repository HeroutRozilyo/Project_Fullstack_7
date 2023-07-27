const pool = require("../config/database");

exports.getAllPlaylist = async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const query = `SELECT * FROM playlist`;

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
