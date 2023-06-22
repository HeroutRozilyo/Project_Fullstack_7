import React from 'react';
import YouTube from 'react-youtube';

const YouTubePlayer = ({ videoId }) => {
  // Function called when the YouTube player is ready
  const onPlayerReady = (event) => {
    event.target.playVideo();
  };

  // Function called when the YouTube player state changes
  const onPlayerStateChange = (event) => {
    // Do something when the player state changes (e.g., track video progress)
  };

  return (
    <YouTube
      videoId={videoId}
      onReady={onPlayerReady}
      onStateChange={onPlayerStateChange}
    />
  );
};

export default YouTubePlayer;
