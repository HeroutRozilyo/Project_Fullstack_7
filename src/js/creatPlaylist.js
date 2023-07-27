import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaylistSection from "./PlaylistSection.js";
import SearchSongs from "./SearchSong.js";
import "../css/MainPage.css"; // import the CSS file for styling the MainPage

function MainScreen() {
  useEffect(() => {
    // Fetch user data from local storage
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUser(parsedUserData);
    }
  }, []);

  return (
    <div className="main-page">
      <div className="search-songs-section">
        <h2>Search Songs</h2>
        <SearchSongs />
      </div>
      <div className="playlists-section"></div>
    </div>
  );
}

export default MainScreen;
