import React from "react";
import { useState, useEffect, useParams } from "react";
import "../css/playList.css";
import pop from "../playListImage/Pop.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import {
  BrowserRouter as Router,
  Link,
  Route,
  useNavigate,
} from "react-router-dom";
import PlaylistPage from "./PlayListPage.js";

function PlaylistSection() {
  const [playListResults, setPlayListResults] = useState([]);

  const history = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPlayList = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/playList", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setPlayListResults(data);
      } catch (error) {
        console.error(error);
        alert("An error occurred while fetching songs");
      }
    };
    fetchPlayList();
  }, []);

  const handlePlaylistClick = (playlistId) => {
    // Find the selected playlist object
    const selectedPlaylist = playListResults.find(
      (playlist) => playlist.PlaylistID === playlistId
    );

    localStorage.setItem("playlist", JSON.stringify(selectedPlaylist));
    history(`/users/${user.userName}/playlist/${selectedPlaylist.PlaylistID}`);
  };

  const handleCreatPlaylist = () => {
    history(`/users/${user.userName}/playlist/creatMyPlaylist`);
  };
  return (
    <div className="playlist-section">
      <div className="menu-bar">
        <button onClick={handleCreatPlaylist}>
          <FontAwesomeIcon icon={faPlus} />
          <span>Add Playlist</span>
        </button>
        <button>
          <FontAwesomeIcon icon={faHeart} />
          <span>Like Playlist</span>
        </button>
      </div>
      {playListResults.map((playlist) => (
        <button
          key={playlist.PlaylistID}
          className="playlist-card"
          onClick={() => handlePlaylistClick(playlist.PlaylistID)}
        >
          <img
            src={require(`../playListImage/${playlist.nameIMAG}.png`)}
            alt={playlist.PlaylistName}
          />
          <h3>{playlist.PlaylistName}</h3>
        </button>
      ))}
    </div>
  );
}

export default PlaylistSection;
