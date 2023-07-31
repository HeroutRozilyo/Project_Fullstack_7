import React, { useState, useEffect,useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function SearchSongCreat(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isMouseOverResults, setIsMouseOverResults] = useState(false); // New state variable
  const CACHE_KEY = "songCache";
  const searchRef = useRef(null); // Ref to the search container

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
          setSearchResults(data.slice(0, 10)); // Show the first 10 songs in the results
        } catch (error) {
          console.error(error);
        }
      };

      fetchSongsAndCache();
      const interval = setInterval(fetchSongsAndCache, 10 * 60 * 1000); // 10 minutes interval
      return () => clearInterval(interval);
    } else {
      setSearchResults(cachedData.data.slice(0, 10)); // Show the first 10 cached songs in the results
    }

    // Set the initial focus state to false when the component mounts
    setIsInputFocused(false);
  }, []);
  useEffect(() => {
    // Add event listener to the document for clicks outside the search component
    const handleOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]); // Close the search results
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      // Remove the event listener when the component unmounts
      document.removeEventListener("click", handleOutsideClick);
    };
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
      setSearchResults(filteredResults.slice(0, 10)); // Limit the number of results to 10 for performance
    }
  };

  const handleSongSelect = (song) => {
    console.log("Selected Song:", song); // Add this line to check if the function is triggered and getting the song data.
    console.log("Song Name:", song.SongName);
    props.onSongSelect(song);
  };

  const handleInputBlur = () => {
    if (!isMouseOverResults) {
      // Close the search results if the mouse is not over them
      setSearchResults([]);
    }
    setIsInputFocused(false);
  };

  return (
    <div className="search-songs"  ref={searchRef}>
      <div className="search-input-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for songs..."
          onFocus={() => {
            setIsInputFocused(true);
            if (!searchTerm) {
              // Show all the cached songs if the search term is empty
              const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));
              if (cachedData && cachedData.data) {
                setSearchResults(cachedData.data.slice(0, 10));
              }
            }
          }}
          onBlur={handleInputBlur}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      <div
        className="search-results"
        onMouseEnter={() => setIsMouseOverResults(true)}
        onMouseLeave={() => setIsMouseOverResults(false)}
      >
        {isSearching ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {searchResults.map((song) => (
              <li key={song.SongID} onMouseDown={() => handleSongSelect(song)}>
                <button onClick={() => handleSongSelect(song)}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
                {song.SongName}
              </li>
            ))}
          </ul>
        )}
        {searchResults.length === 0 && !isSearching && isInputFocused && (
          <p className="no-results">No results found.</p>
        )}
      </div>
    </div>
  );
}

export default SearchSongCreat;
