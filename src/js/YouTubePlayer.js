import React from "react";
import YouTube from "react-youtube";

const YouTubePlayer = ({ videoId }) => {
  const onPlayerReady = (event) => {
    event.target.playVideo();
  };

  const onPlayerStateChange = (event) => {};

  return (
    <YouTube
      videoId={videoId}
      onReady={onPlayerReady}
      onStateChange={onPlayerStateChange}
    />
  );
};

export default YouTubePlayer;
