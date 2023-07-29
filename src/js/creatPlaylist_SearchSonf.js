import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/SearchSong.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function SearchSongCreat(props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const searchRef = useRef();
  const history = useNavigate();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() !== "" || isInputFocused) {
        fetchSearchResults();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isInputFocused]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
        setIsInputFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchSearchResults = async () => {
    try {
      setIsSearching(true);

      const response = await fetch(
        `http://localhost:3001/api/songs?search=${searchTerm}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setSearchResults(data.slice(0, 10)); // Limit the number of results to 10 for performance
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching songs");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSongSelect = (song) => {
    console.log("Selected Song:", song); // Add this line to check if the function is triggered and getting the song data.
    console.log("Song Name:", song.SongName);
    props.onSongSelect(song);
  };

  return (
    <div className="search-songs">
      <div className="search-input-container" ref={searchRef}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for songs..."
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />
        <button className="search-button" onClick={fetchSearchResults}>
          Search
        </button>
      </div>
      <div className="search-results">
        {isSearching ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {searchResults.map((song) => (
              <li
                key={song.SongID}
                onMouseDown={(e) => handleSongSelect(song, e)}
              >
                <button onClick={(e) => handleSongSelect(song, e)}>
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
