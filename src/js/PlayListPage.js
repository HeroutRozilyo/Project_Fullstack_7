import React from "react";
import {
  BrowserRouter as Router,
  Link,
  Route,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";

function SongDetails({ song, onClose }) {
  return (
    <div className="song-details">
      <h3>{"Name: " + song.SongName}</h3>
      <h4>{"Artist: " + song.ArtistID}</h4>
      <h4>{"Length: " + song.SongLength}</h4>
      <h4>{"Genre: " + song.Genre}</h4>
      <button onClick={onClose}>
        <FontAwesomeIcon icon={faWindowClose} />
      </button>
    </div>
  );
}

function PlaylistPage() {
  const [playListSongs, setPlayListSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);

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

  const handleDetailsClick = (song) => {
    setSelectedSong(song);
  };

  const handleCloseDetails = () => {
    setSelectedSong(null);
  };

  return (
    <div>
      <img
        src={require(`../playListImage/${playlist.nameIMAG}.png`)}
        alt={playlist.PlaylistName}
      />
      <h2>{playlist.PlaylistName}</h2>
      <h3>List of Songs:</h3>
      <div className="playlist-section">
        {playListSongs.map((song) => (
          <div key={song.SongID} className="playlist-card">
            <h3>{song.SongName}</h3>
            <button onClick={() => handleDetailsClick(song)}>
              <FontAwesomeIcon icon={faInfoCircle} />
            </button>
          </div>
        ))}
      </div>
      <button>
        <FontAwesomeIcon icon={faPlay} />
      </button>
      {selectedSong && (
        <SongDetails song={selectedSong} onClose={handleCloseDetails} />
      )}
    </div>
  );
}

export default PlaylistPage;
