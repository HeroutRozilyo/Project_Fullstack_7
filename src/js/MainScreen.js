import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaylistSection from "./PlaylistSection.js";
import SearchSongs from "./SearchSong.js";
import "../css/MainPage.css";

function MainScreen() {
  const { username } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
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
      <div className="playlists-section">
        <h2>Playlists</h2>
        <PlaylistSection />
      </div>
    </div>
  );
}

export default MainScreen;
