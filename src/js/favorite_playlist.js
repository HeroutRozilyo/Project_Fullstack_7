import React from "react";
import {
  BrowserRouter as Router,
  Link,
  Route,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "../css/favorite.css";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

function FavoritePlaylist() {
  const [playList, setPlayList] = useState([]);

  const history = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));

  const fetchPlayList = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/playList/Like/${userData.UserID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setPlayList(data);
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching songs");
    }
  };
  useEffect(() => {
    fetchPlayList();
  }, []);

  if (!Array.isArray(playList)) {
    return <p>No favorite playlists</p>;
  }

  const handlePlaylistClick = (playlistId) => {
    const selectedPlaylist = playList.find(
      (playlist) => playlist.PlaylistID === playlistId
    );

    localStorage.setItem("playlist", JSON.stringify(selectedPlaylist));
    history(
      `/users/${userData.UserName}/playlist/${selectedPlaylist.PlaylistID}`
    );
  };

  const handleonDelete = async (playID) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/playList/LikeD/${userData.UserID}/${playID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        fetchPlayList();
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching songs");
    }
  };
  const handleEditClick = (idplaylist) => {
    history(
      `/users/${userData.UserName}/playlist/creatMyPlaylist/${idplaylist}`
    );
  };

  return (
    <div className="page-containerf">
      <h2>Your favorite playlists</h2>
      <div>
        {playList.map((playlist) => (
          <div>
            <button
              key={playlist.PlaylistID}
              className="playlist-cardf"
              onClick={() => handlePlaylistClick(playlist.PlaylistID)}
            >
              <img
                src={require(`../playListImage/${playlist.nameIMAG}.png`)}
                alt={playlist.PlaylistName}
              />
              <h3>{playlist.PlaylistName}</h3>
            </button>
            <button onClick={() => handleonDelete(playlist.PlaylistID)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button onClick={() => handleEditClick(playlist.PlaylistID)}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoritePlaylist;
