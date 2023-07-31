import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function SearchSongCreat(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isMouseOverResults, setIsMouseOverResults] = useState(false);

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
      const filteredResults = cachedData.data.filter(
        (song) =>
          song.SongName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults);
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

  const handleSongSelect = (song) => {
  
    props.onSongSelect(song);
  };

  useEffect(() => {
    // Add event listener to the document for clicks
    const handleDocumentClick = (event) => {
      if (
        !event.target.closest(".search-songs") && // Click outside the search-songs container
        !event.target.closest(".search-input-container") // Click outside the search-input-container
      ) {
        setSearchResults([]);
        setIsInputFocused(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      // Remove the event listener when the component unmounts
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

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
            handleShowAllSongs();
          }}
          onBlur={() => {
            setIsInputFocused(false);
          }}
          placeholder="Search for songs..."
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      {isInputFocused || isMouseOverResults || searchResults.length > 0 ? (
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
