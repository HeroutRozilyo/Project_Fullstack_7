// MainScreen.jsx

import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import SearchSongCreat from "./creatPlaylist_SearchSonf.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";

//import "../css/creatPlaylist.css";
import { async } from "q";

function SongDetails({ song, onClose, onDelete }) {
  return (
    <div className="song-details">
      <h3>{"Name: " + song.SongName}</h3>
      <h4>{"Artist: " + song.ArtistName}</h4>
      <h4>{"Length: " + song.SongLength}</h4>
      <h4>{"Genre: " + song.Genre}</h4>
      <button className="closes" onClick={onClose}>
        <FontAwesomeIcon icon={faWindowClose} />
      </button>
      <button className="deleteSongs" onClick={() => onDelete(song)}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
}

function MainScreen() {
  const history = useNavigate();
  const location = useLocation();

  const [selectedSongs, setSelectedSongs] = useState([]);
  const [user, setUser] = useState([]);
  const [selected, setSelected] = useState(null);
  const [PlaylistName, setPlaylistName] = useState("My_Playlist");
  const [edit, setEdit] = useState(false);
  const userData = localStorage.getItem("user");

  useEffect(() => {
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUser(parsedUserData);
    }
    try {
      const currentURL = window.location.pathname;
      const segments = currentURL.split("/");
      const lastWord = segments[segments.length - 1];
      if (lastWord != "creatMyPlaylist") {
        const fetchPlayList = async () => {
          const response = await fetch(
            `http://localhost:3001/api/playList/${lastWord}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          setSelectedSongs(data);
          if (data) {
            setEdit(true);
          }
        };

        fetchPlayList();
        setPlaylistName(JSON.parse(localStorage.getItem("editfavName")));
      }
    } catch (error) {}
  }, []);

  const handleSongSelect = (selectedSong) => {
    const isSongSelected = selectedSongs.find(
      (song) => song.SongID === selectedSong.SongID
    );

    if (!isSongSelected) {
      setSelectedSongs([...selectedSongs, selectedSong]);
    } else {
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

    if (!edit) {
      const timestamp = Date.now();
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
        if (user.isAdmin) {
          history(`/admin/playlists`);
        } else {
          history(`/users/${user.UserName}/main`);
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while creating the playlist");
      }
    } else {
      const playlistID = location.pathname.split("/").pop(); // Get the playlist ID from the URL

      try {
        const response = await fetch(
          `http://localhost:3001/api/playList/updatePlaylist/${playlistID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              playlistName: PlaylistName,
              selectedSongs: selectedSongs,
            }),
          }
        );
        const data = await response.json();
        alert("Success! your playlist updated");
        console.log(userData);
        console.log("userData.isAdmin:", userData.isAdmin);
        if (user.isAdmin) {
          history(`/admin/playlists`);
        } else {
          history(`/users/${user.UserName}/main`);
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while updating the playlist");
      }
    }
  };

  return (
    <div className="main-pages">
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
              className="playlist-cards"
              onClick={() => handleDetailsSong(song)}
            >
              <h3s className="song-name">{song.SongName}</h3s>
            </button>
          ))
        ) : (
          <p>No songs selected</p>
        )}
        {selectedSongs.length > 0 && (
          <div className="ccs">
            <input
              type="text"
              placeholder="Enter playlist name"
              value={PlaylistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
            {edit ? (
              <button onClick={handleCreatMyPlaylist}>
                {"Update My Playlist"}
              </button>
            ) : (
              <button onClick={handleCreatMyPlaylist}>
                {"Create My Playlist"}
              </button>
            )}
          </div>
        )}
      </div>
      {selected && (
        <div className="song-details-containers">
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
