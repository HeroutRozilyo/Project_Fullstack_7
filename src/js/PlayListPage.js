import React from "react";
import {
  BrowserRouter as Router,
  Link,
  Route,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import {
  faInfoCircle,
  faPlay,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";

import "../css/playlistPage.css";

function SongDetails({ song, onClose }) {
  return (
    <div className="song-details">
      <h3>{"Name: " + song.SongName}</h3>
      <h4>{"Artist: " + song.ArtistName}</h4>
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
  const [firstSong, setFirstSong] = useState(null);
  const history = useNavigate();
  const playlist = JSON.parse(localStorage.getItem("playlist"));
  const userData = JSON.parse(localStorage.getItem("user"));
  const imageurl = require(`../playListImage/${playlist.nameIMAG}.png`);
  console.log(playlist.PlaylistName);
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
        if (data.length > 0) {
          setFirstSong(data[0]);
        }
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
    history(`/users/${userData.UserName}/playlist/${playlist.PlaylistID}/play`);
  };
  const handlePlaysing = (id) => {
    history(
      `/users/${userData.UserName}/playlist/${playlist.PlaylistID}/play/${id}`
    );
  };
  const isAdmin = userData.isAdmin;

    return (
      <div
        className="page-container"
        style={{ backgroundImage: `url(${imageurl})` }}
      >
        <div className="content-container">
          { (
            <div className="playlist-section">
              {playListSongs.map((song) => (
                <div key={song.SongID} className="song-card">
                  <FontAwesomeIcon icon={faMusic} size="3x" />
                  <h3>{song.SongName}</h3>
                  <p>{song.SongLength}</p>
                  <button onClick={() => handleDetailsClick(song)}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </button>
                  <button onClick={() => handlePlaysing(song.videoId)}>
                    <FontAwesomeIcon icon={faPlay} />
                  </button>
                </div>
              ))}
            </div>
          )}
  
          <div className="buttons-container">
            {!isAdmin ? (
              <>
                {/* Condition for admin */}
                <button className="love" onClick={handleLike}>
                  <FontAwesomeIcon icon={faHeart} />
                  <span>Mark as my favorite</span>
                </button>
                <button className="play-all-button" onClick={handlePlayPlaylist}>
                  <FontAwesomeIcon icon={faPlay} />
                  <span>Play All</span>
                </button>
              </>
            ) : (
              // Condition for non-admin
              <button className="play-all-button" onClick={handlePlayPlaylist}>
                <FontAwesomeIcon icon={faPlay} />
                <span>Play All</span>
              </button>
            )}
          </div>
          {selectedSong && (
            <SongDetails song={selectedSong} onClose={handleCloseDetails} />
          )}
        </div>
      </div>
    );
  }
  
  export default PlaylistPage;
  