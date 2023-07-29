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
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "../css/playlistPage.css";

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
  const userData = JSON.parse(localStorage.getItem("user"));

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

  const handleLike = async (e) => {
    e.preventDefault();

    const userid = userData.UserID;
    const playlistid = playlist.PlaylistID;
    const playlistName = playlist.PlaylistName;
    const nameIMAG = playlist.nameIMAG;

    try {
      const response = await fetch("http://localhost:3001/api/playList/Like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid,
          playlistid,
          playlistName,
          nameIMAG,
        }),
      });
      const data = await response.json();
      if (data.message) {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching songs");
    }
  };

  const handlePlayPlaylist = () => {
    history(`/users/${userData.userName}/playlist/${playlist.PlaylistID}/play`);
  };
  const handlePlaysing = (id) => {
    history(
      `/users/${userData.userName}/playlist/${playlist.PlaylistID}/play/${id}`
    );
  };

  return (
    <div className="page-container">
      <div className="content-container">
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
              <button onClick={handlePlaysing(song.videoId)}>
                <FontAwesomeIcon icon={faPlay} />
              </button>
            </div>
          ))}
        </div>
        <button className="love" onClick={handleLike}>
          <FontAwesomeIcon icon={faHeart} />
          <span>Mark as my favorite</span>
        </button>
        <button onClick={handlePlayPlaylist}>
          <FontAwesomeIcon icon={faPlay} />
        </button>
        {selectedSong && (
          <SongDetails song={selectedSong} onClose={handleCloseDetails} />
        )}
      </div>
    </div>
  );
}

export default PlaylistPage;
