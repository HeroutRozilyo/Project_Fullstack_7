import React from "react";
import YouTubePlayer from "./YouTubePlayer";

const App = () => {
  const videoId = "eBf0oXIo9k0";

  return (
    <div>
      <h1>My YouTube Player</h1>
      <YouTubePlayer videoId={videoId} />
    </div>
  );
};

export default App;
