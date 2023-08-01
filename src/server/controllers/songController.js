const pool = require("../config/database");

exports.getAllSong = async (req, res) => {
  const searchTerm = req.query.search;

  try {
    let songs;

    if (searchTerm && searchTerm.trim() !== "") {
      const searchTermWithWildcard = `%${searchTerm}%`;
      const query = "SELECT * FROM song WHERE SongName LIKE ?";

      songs = await new Promise((resolve, reject) => {
        pool.query(query, [searchTermWithWildcard], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    } else {
      const query = `
  SELECT song.*, artist.ArtistName
  FROM song
  INNER JOIN artist ON song.ArtistID = artist.ArtistID;
`;

      songs = await new Promise((resolve, reject) => {
        pool.query(query, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    }

    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching songs" });
  }
};

exports.deleteSong = async (req, res) => {
  const songID = req.params.id;

  try {
    const query = "SELECT * FROM song WHERE SongID = ?";
    const song = await new Promise((resolve, reject) => {
      pool.query(query, [songID], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]);
        }
      });
    });

    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }

    const deleteQuery = "DELETE FROM song WHERE SongID = ?";
    await new Promise((resolve, reject) => {
      pool.query(deleteQuery, [songID], (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    return res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the song" });
  }
};

exports.addSong = async (req, res) => {
  const { ArtistID, SongName, SongLength, Genre, videoId } = req.body;

  try {
    let artistID;

    const artistQuery = "SELECT * FROM artist WHERE ArtistName = ?";
    const artistExists = await new Promise((resolve, reject) => {
      pool.query(artistQuery, [ArtistID], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.length > 0);
        }
      });
    });

    if (artistExists) {
      artistID = artistExists[0].ArtistID;
    } else {
      const createArtistQuery = "INSERT INTO artist (ArtistName) VALUES (?)";
      const createArtistResult = await new Promise((resolve, reject) => {
        pool.query(createArtistQuery, [ArtistID], (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });

      artistID = createArtistResult.insertId;
    }

    const addSongQuery =
      "INSERT INTO song (ArtistID, SongName, SongLength, Genre, videoId) VALUES (?, ?, ?, ?, ?)";
    await new Promise((resolve, reject) => {
      pool.query(
        addSongQuery,
        [artistID, SongName, SongLength, Genre, videoId],
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });

    res.status(201).json({ message: "Song added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while adding the song" });
  }
};
