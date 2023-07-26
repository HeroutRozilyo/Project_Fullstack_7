import React, { useState, useEffect } from "react";

function SearchSongs() {
  const url = "http://localhost:3001";
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchClicked, setIsSearchClicked] = useState(false);

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

  const handleSearch = () => {
    setIsSearchClicked(true);
  };

  return (
    <div className="search-songs">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for songs..."
        onClick={() => setIsSearchClicked(true)}
        onBlur={() => setIsSearchClicked(false)}
      />
      <button onClick={handleSearch}>Search</button>
      {isSearchClicked && (
        <ul>
          {searchResults.map((song) => (
            <li key={song.id}>{song.SongName}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchSongs;
