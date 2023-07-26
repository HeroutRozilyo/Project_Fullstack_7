import React, { useState, useEffect } from 'react';
import '../css/SearchSong.css';

function SearchSongs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() !== '' || isInputFocused) {
        fetchSearchResults();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isInputFocused]);

  const fetchSearchResults = async () => {
    try {
      setIsSearching(true);

      const response = await fetch(`http://localhost:3001/api/songs?search=${searchTerm}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setSearchResults(data.slice(0, 10)); // Limit the number of results to 10 for performance
    } catch (error) {
      console.error(error);
      alert('An error occurred while fetching songs');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="search-songs">
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for songs..."
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          className="search-input"
        />
        <button className="search-button" onClick={fetchSearchResults}>
          Search
        </button>
      </div>
      {isSearching ? (
        <p>Loading...</p>
      ) : (
        <ul className="search-results-list">
          {searchResults.map((song) => (
            <li key={song.id} className="search-result-item">
              {song.SongName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchSongs;
