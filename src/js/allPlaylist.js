import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AllPlaylists.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

function AllPlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [isManager, setIsManager] = useState(false);
  const history = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));

  const fetchPlaylists = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/playList/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching playlists");
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  if (!Array.isArray(playlists)) {
    return <p>Loading...</p>;
  }

  const handleEditClick = (playlist) => {
    localStorage.setItem("editfavName", JSON.stringify(playlist.PlaylistName));
    history(
      `/users/${userData.UserName}/playlist/creatMyPlaylist/${playlist.PlaylistID}`
    );
  };

  const handleCreatePlaylist = () => {
    history(`/users/${userData.UserName}/playlist/creatMyPlaylist`);
  };

  const handleonDelete = async (playlist) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/playList/LikeD/${playlist.UserID}/${playlist.PlaylistID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        fetchPlaylists();
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the playlist");
    }
  };

  return (
    <div className="all-playlists-page">
      <h1 className="page-title">All Playlists</h1>
      <div className="playlists-list">
        {playlists.map((playlist) => (
          <div key={playlist.PlaylistID} className="playlist-card">
            <img
              className="playlist-image"
              src={require(`../playListImage/${playlist.nameIMAG}.png`)}
              alt={playlist.PlaylistName}
            />
            <h3 className="playlist-title">{playlist.PlaylistName}</h3>
            <p className="playlist-user">User: {playlist.UserName}</p>
           
            <button
              className="view-button"
              onClick={() => history(`/playlist/${playlist.PlaylistID}`)}
            >
              View Playlist
            </button>
            <FontAwesomeIcon
              icon={faPencilAlt}
              className="edit-icon"
              onClick={() => handleEditClick(playlist)}
            />
            <FontAwesomeIcon
              icon={faTrash}
              className="delete-icon"
              onClick={() => handleonDelete(playlist)}
            />
          </div>
        ))}
        <div className="create-new-playlist">
          <FontAwesomeIcon
            icon={faPlus}
            className="create-icon"
            onClick={handleCreatePlaylist}
          />
        </div>
      </div>
    </div>
  );
}

export default AllPlaylists;
