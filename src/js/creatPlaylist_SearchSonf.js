import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function SearchSongCreat(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSongs,setSelectedSongs]=useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isMouseOverResults, setIsMouseOverResults] = useState(false); // New state variable
  const CACHE_KEY = "songCache";
 

  useEffect(() => {
    // Check if the cache exists and is not empty
    const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (
      !cachedData ||
      !cachedData.data ||
      cachedData.data.length === 0 ||
      Date.now() - cachedData.timestamp > 10 * 60 * 1000
    ) {
      // Fetch songs from the server and save to cache
      const fetchSongsAndCache = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/songs`);
          const data = await response.json();
          const cacheData = {
            timestamp: Date.now(),
            data: data,
          };
          localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        } catch (error) {
          console.error(error);
        }
      };

      fetchSongsAndCache();
      const interval = setInterval(fetchSongsAndCache, 10 * 60 * 1000); // 10 minutes interval
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  const handleSearch = () => {
    // Perform search on the cached data
    const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (cachedData && cachedData.data) {
      const filteredResults = cachedData.data.filter((song) =>
        song.SongName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults); // Limit the number of results to 10 for performance
    }
  };

  

  const handleShowAllSongs = () => {
    // Show all the song links when the user focuses on the input without typing anything
    if (searchTerm.trim() === "") {
      const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (cachedData && cachedData.data) {
        setSearchResults(cachedData.data);
      }
    }
  };  
  const handleSongSelect = (selectedSong) => {
    const isSongSelected = selectedSongs.find(
      (song) => song.SongID === selectedSong.SongID
    );

    // If the song is not already in the list, add it
    if (!isSongSelected) {
      setSelectedSongs([...selectedSongs, selectedSong]);
    } else {
      // If the song is already in the list, you can show an alert or handle it as per your requirements
      alert("This song is already in the playlist!");
    }
  };

// ... (previous code)

return (
  <div className="search-songs">
    <div
      className="search-input-container"
      onMouseEnter={() => setIsMouseOverResults(true)}
      onMouseLeave={() => setIsMouseOverResults(false)}
    >
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => {
          setIsInputFocused(true);
          handleShowAllSongs(); // Show all songs when the input is focused
        }}
        onBlur={() => setIsInputFocused(false)}
        placeholder="Search for songs..."
      />
      <button className="search-button" onClick={handleSearch}>
        Search
      </button>
    </div>
    {isInputFocused || isMouseOverResults? (
      <div className="search-results">
        {isSearching ? (
          <p>Loading...</p>
        ) : Array.isArray(searchResults) && searchResults.length > 0 ? (
          <ul>
            {searchResults.map((song) => (
              <li key={song.SongID}>
                <button onClick={() => handleSongSelect(song)}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
                {song.SongName}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-results">No results found.</p>
        )}
      </div>
    ) : null}
  </div>
);

        }

export default SearchSongCreat;

