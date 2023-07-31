import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AllPlaylists.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faPlus } from "@fortawesome/free-solid-svg-icons";

function AllPlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [isManager, setIsManager] = useState(false);
  const history = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));

  // Replace this with the API call to get all playlists from the server
  useEffect(() => {
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
