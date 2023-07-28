import React from 'react';

const OtherSongsList = ({ otherSongs, onSongSelect }) => {
  return (
    <div>
      <h3>Other Songs by the Same Singer:</h3>
      <ul>
        {otherSongs.map((song) => (
          <li key={song.videoId} onClick={() => onSongSelect(song.videoId)}>
            {song.SongName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OtherSongsList;