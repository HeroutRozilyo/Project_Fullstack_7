import React from 'react';

function PlaylistSection() {
  // Replace the following sample data with your actual playlist data
  const playlists = [
    { id: 1, title: 'Playlist 1', image: 'playlist1.jpg' },
    { id: 2, title: 'Playlist 2', image: 'playlist2.jpg' },
    // Add more playlists as needed
  ];

  return (
    <div className="playlist-section">
      {playlists.map((playlist) => (
        <div key={playlist.id} className="playlist-card">
          <img src={playlist.image} alt={playlist.title} />
          <h3>{playlist.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default PlaylistSection;
