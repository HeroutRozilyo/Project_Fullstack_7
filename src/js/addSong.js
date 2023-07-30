import React, { useState } from "react";
import "../css/addSong.css";
function AddSongForm() {
  const [artistName, setArtistName] = useState("");
  const [songName, setSongName] = useState("");
  const [songLength, setSongLength] = useState("");
  const [genre, setGenre] = useState("");
  const [videoId, setVideoId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/songs/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ArtistID: artistName,
          SongName: songName,
          SongLength: songLength,
          Genre: genre,
          videoId: videoId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add song");
      }

      // Song added successfully, you can show a success message or redirect to the all songs page
      alert("Song added successfully");
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the song");
    }
  };

  return (
    <div className="add-song-form">
      <h2>Add a New Song</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Artist Name:
          <input
            type="text"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            required
          />
        </label>
        <label>
          Song Name:
          <input
            type="text"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
            required
          />
        </label>
        <label>
          Song Length:
          <input
            type="text"
            value={songLength}
            onChange={(e) => setSongLength(e.target.value)}
            required
          />
        </label>
        <label>
          Genre:
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />
        </label>
        <label>
          Video ID:
          <input
            type="text"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            required
          />
        </label>
        <div className="submit-row">
          <button type="submit">Add Song</button>
        </div>
      </form>
    </div>
  );
}

export default AddSongForm;
