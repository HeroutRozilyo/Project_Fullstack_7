import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AllPlaylists.css';

function AllPlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [isManager, setIsManager] = useState(false);
  const history = useNavigate();

  // Replace this with the API call to get all playlists from the server
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/playList/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setPlaylists(data);
      } catch (error) {
        console.error(error);
        alert('An error occurred while fetching playlists');
      }
    };
    fetchPlaylists();
  }, []);

  const handlePlaylistClick = (playlist) => {
    
    localStorage.setItem("playlist", JSON.stringify(playlist));
    history(`/users/:playlist.UserName/playlist/:playlist.PlaylistID`);
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
            <div className="playlist-details">
              <h3 className="playlist-title">{playlist.PlaylistName}</h3>
              <p className="playlist-user">User: {playlist.UserName}</p>
            
            </div>
            <button
              className="view-button"
              onClick={() => handlePlaylistClick(playlist)}
            >
              View Playlist
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllPlaylists;