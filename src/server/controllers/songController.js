const pool = require("../config/database");

exports.getAllSong = async (req, res) => {
  const searchTerm = req.query.search;

  try {
    let songs;

    if (searchTerm && searchTerm.trim() !== '') {
      // If the search term is provided, perform the search
      const searchTermWithWildcard = `%${searchTerm}%`;
      const query = 'SELECT * FROM song WHERE SongName LIKE ?';
      
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
      const query = 'SELECT * FROM song';
      
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
    res.status(500).json({ error: 'An error occurred while fetching songs' });
  }
};
