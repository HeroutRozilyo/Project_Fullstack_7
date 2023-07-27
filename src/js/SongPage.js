import React from 'react';
import YouTubePlayer from './YouTubePlayer';

const SongPage = ({ songCode }) => {
  return (
    <div className="song-page">
      <h2>Now Playing</h2>
      <YouTubePlayer videoId={songCode} />
    </div>
  );
};

export default SongPage;
