import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faTrashAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import "../css/AllSongs.css";

function AllSongs() {
  const [songs, setSongs] = useState([]);
  const [isManager, setIsManager] = useState(false);
  const history = useNavigate();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/songs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setSongs(data);
      } catch (error) {
        console.error(error);
        alert("An error occurred while fetching songs");
      }
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.isAdmin) {
      setIsManager(true);
    }
  }, []);
  const handleSongSelect = (songCode) => {
    history(`/song/${songCode}`);
  };
  const handleDeleteSong = async (songID) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/songs/${songID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete song");
      }

      setSongs((prevSongs) =>
        prevSongs.filter((song) => song.SongID !== songID)
      );
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the song");
    }
  };

  return (
    <div className="all-songs-page">
      <h1 className="page-title">All Songs</h1>
      {isManager && (
        <Link to="/add-song" className="add-song-button">
          <FontAwesomeIcon icon={faPlus} className="add-song-icon" />
          Add Song
        </Link>
      )}
      <div className="songs-list">
        {songs.map((song) => (
          <div key={song.SongID} className="song-card">
            <FontAwesomeIcon
              icon={faMusic}
              onMouseDown={() => handleSongSelect(song.videoId)}
              className="song-icon"
            />
            <h3 className="song-title">{song.SongName}</h3>
            <p className="song-artist">{song.ArtistName}</p>
            {isManager && (
              <button
                className="delete-song-button"
                onClick={() => handleDeleteSong(song.SongID)}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllSongs;
