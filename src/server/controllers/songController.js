const pool = require("../config/database");

exports.getAllSong = async (req, res) => {
  const searchTerm = req.query.search;

  try {
    let songs;

    if (searchTerm && searchTerm.trim() !== "") {
      // If the search term is provided, perform the search
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
      // If the search term is not provided or empty, fetch all songs
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
// Assuming you have the necessary imports and setup for your songController file

exports.deleteSong = async (req, res) => {
  const songID = req.params.id;

  try {
    // Find the song by its ID in the database
    const query = "SELECT * FROM song WHERE SongID = ?";
    const song = await new Promise((resolve, reject) => {
      pool.query(query, [songID], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]); // Assuming SongID is unique, so there will be only one result
        }
      });
    });

    // Check if the song exists in the database
    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }

    // Delete the song from the database
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

    // Check if the provided artist already exists in the database
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
      // If the artist exists, get the existing ArtistID
      artistID = artistExists[0].ArtistID; // Use results here instead of artistExists
    } else {
      // If the artist does not exist, create a new artist record
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

      // Get the newly generated ArtistID
      artistID = createArtistResult.insertId;
    }

    // Add the new song to the database
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
