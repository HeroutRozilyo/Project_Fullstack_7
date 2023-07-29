import React, { useState, useEffect } from 'react';
import '../css/SearchSong.css';
import { Link, useNavigate } from "react-router-dom";

function SearchSongs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isMouseOverResults, setIsMouseOverResults] = useState(false); // New state variable
  const CACHE_KEY = 'songCache';
  const history = useNavigate();

  useEffect(() => {
    // Check if the cache exists and is not empty
    const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (!cachedData || !cachedData.data || cachedData.data.length === 0) {
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

  const handleSongSelect = (songCode) => {
    history(`/song/${songCode}`);
  };

  return (
    <div className="search-songs">
      <div
        className="search-input-container"
        onMouseEnter={() => setIsMouseOverResults(true)} // Handle mouse over the search results
        onMouseLeave={() => setIsMouseOverResults(false)} // Handle mouse leave the search results
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for songs..."
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      {isInputFocused || isMouseOverResults ? ( // Only show the search results when either the input is focused or the mouse is over the results
        <div className="search-results">
          {isSearching ? (
            <p>Loading...</p>
          ) : Array.isArray(searchResults) && searchResults.length > 0 ? (
            <ul>
              {searchResults.map((song) => (
                <li
                  key={song.id}
                  onMouseDown={(e) => handleSongSelect(song.videoId, e)}
                >
                  {song.SongName}
                </li>
              ))}
            </ul>
          ) : (
            <p>No search results found.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default SearchSongs;
