import React from "react";
import {
  BrowserRouter as Router,
  Link,
  Route,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";

function PlaylistPage() {
  const [playListSongs, setPlayListSongs] = useState([]);

  const history = useNavigate();
  const playlist = JSON.parse(localStorage.getItem("playlist"));

  useEffect(() => {
    const fetchPlayList = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/playList/${playlist.PlaylistID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setPlayListSongs(data);
      } catch (error) {
        console.error(error);
        alert("An error occurred while fetching songs");
      }
    };
    fetchPlayList();
  }, []);

  const handlePlaylistClick = (playlistId) => {
    // Find the selected playlist object
  };

  return (
    <div>
      <img
        src={require(`../playListImage/${playlist.nameIMAG}.png`)}
        alt={playlist.PlaylistName}
      />
      <h2>{playlist.PlaylistName}</h2>
      <h3>List of Songs:</h3>
      {playListSongs.map((song) => (
        <button
          key={song.SongID}
          className="playlist-card"
          onClick={() => handlePlaylistClick(song.SongID)}
        >
          <h3>{song.SongName}</h3>
        </button>
      ))}
    </div>
  );
}

export default PlaylistPage;
