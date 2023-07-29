import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SearchSongCreat from "./creatPlaylist_SearchSonf.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";

import "../css/creatPlaylist.css";

function SongDetails({ song, onClose, onDelete }) {
  return (
    <div className="song-details">
      <h3>{"Name: " + song.SongName}</h3>
      <h4>{"Artist: " + song.ArtistID}</h4>
      <h4>{"Length: " + song.SongLength}</h4>
      <h4>{"Genre: " + song.Genre}</h4>
      <button onClick={onClose}>
        <FontAwesomeIcon icon={faWindowClose} />
      </button>
      <button onClick={() => onDelete(song)}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
}

function MainScreen() {
  const history = useNavigate();

  const [selectedSongs, setSelectedSongs] = useState([]);
  const [user, setUser] = useState([]);
  const [selected, setSelected] = useState(null);
  const [PlaylistName, setPlaylistName] = useState("my_playlist");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUser(parsedUserData);
    }
  }, []);

  const handleSongSelect = (selectedSong) => {
    const isSongSelected = selectedSongs.find(
      (song) => song.SongID === selectedSong.SongID
    );

    // If the song is not already in the list, add it
    if (!isSongSelected) {
      setSelectedSongs([...selectedSongs, selectedSong]);
    } else {
      // If the song is already in the list, you can show an alert or handle it as per your requirements
      alert("This song is already in the playlist!");
    }
  };

  const handleDetailsSong = (song) => {
    setSelected(song);
  };

  const handleCloseDetails = () => {
    setSelected(null);
  };
  const handleRemoveSong = (selected1) => {
    const list1 = [...selectedSongs];
    const updatedList = list1.filter(
      (song) => song.SongID !== selected1.SongID
    );
    setSelectedSongs(updatedList);
    if (selected && selected.SongID === selected1.SongID) {
      setSelected(null);
    }
  };

  const handleCreatMyPlaylist = async (e) => {
    e.preventDefault();

    const timestamp = Date.now(); // Get the current timestamp in milliseconds
    const userid = user.UserID;
    const playlistid = timestamp.toString().slice(-5);
    const playlistName = PlaylistName;
    const nameIMAG = Math.floor(Math.random() * 3) + 1;

    try {
      const response = await fetch(
        "http://localhost:3001/api/playList/creatPlayList",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid,
            playlistid,
            playlistName,
            nameIMAG,
            selectedSongs,
          }),
        }
      );
      const data = await response.json();
      alert("Success! your playlist created");
      history(`/users/${user.userName}/main`);
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching songs");
    }
  };

  return (
    <div className="main-page">
      <div className="search-songs-section">
        <h2>Search Songs</h2>
        <SearchSongCreat onSongSelect={handleSongSelect} />
      </div>
      <div className="playlists-section">
        <h2>My Playlist Songs</h2>
        {selectedSongs.length > 0 ? (
          selectedSongs.map((song) => (
            <button
              key={song.SongID}
              className="playlist-card"
              onClick={() => handleDetailsSong(song)}
            >
              <h3>{song.SongName}</h3>
            </button>
          ))
        ) : (
          <p>No songs selected</p>
        )}
        {selectedSongs.length > 0 && (
          <div className="cc">
            <input
              type="text"
              placeholder="Enter playlist name"
              value={PlaylistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
            <button onClick={handleCreatMyPlaylist}>
              {"create my playlist"}
            </button>
          </div>
        )}
      </div>
      {selected && (
        <div className="song-details-container">
          <h2>Songs Details</h2>
          <SongDetails
            song={selected}
            onClose={handleCloseDetails}
            onDelete={() => handleRemoveSong(selected)}
          />
        </div>
      )}
    </div>
  );
}

export default MainScreen;
