import React, { useState } from "react";
import "../css/addSong.css";

function AddSongForm() {
  const [artistName, setArtistName] = useState("");
  const [songName, setSongName] = useState("");
  const [songLength, setSongLength] = useState("");
  const [genre, setGenre] = useState("Pop");
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

      alert("Song added successfully");
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the song");
    }
  };

  return (
    <div className="add-song-form spotify-style">
      <h2>Add a New Song</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Artist Name:</label>
          <input
            type="text"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            required
            className="spotify-input"
          />
        </div>
        <div className="form-group">
          <label>Song Name:</label>
          <input
            type="text"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
            required
            className="spotify-input"
          />
        </div>
        <div className="form-group">
          <label>Song Length:</label>
          <input
            type="text"
            value={songLength}
            onChange={(e) => setSongLength(e.target.value)}
            required
            className="spotify-input"
          />
        </div>
        <div className="form-group">
          <label>Genre:</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
            className="spotify-select"
          >
            <option value="Pop">Pop</option>
            <option value="Mizrchi">Mizrchi</option>
            <option value="Hip-Hop">Hip-Hop</option>
            <option value="Israeli">Israeli</option>
          </select>
        </div>
        <div className="form-group">
          <label>Video ID:</label>
          <input
            type="text"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            required
            className="spotify-input"
          />
        </div>
        <div className="submit-row">
          <button type="submit" className="spotify-button">
            Add Song
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddSongForm;
