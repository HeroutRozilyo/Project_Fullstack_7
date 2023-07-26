import React, { useState, useEffect } from "react";

function SearchSongs() {
  const url = "http://localhost:3001";
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchsongs = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/songs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error(error);
        alert("An error occurred while fetching songs");
      }
    };
    fetchsongs();
  }, []);

  const handleSearch = async () => {
    try {
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className="search-songs">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for songs..."
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {searchResults.map((song) => (
          <li key={song.id}>{song.SongName}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchSongs;
