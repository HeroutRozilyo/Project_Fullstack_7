import React, { useState, useEffect } from "react";
import YouTubePlayer from "./YouTubePlayer";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../css/SongPage.css";

const Playlist_Play = () => {
  const playlist = JSON.parse(localStorage.getItem("playlist"));
  const { id } = useParams();

  const [songList, setSongList] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);
  const [playlistSong, setPlayListSong] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user"));

  const history = useNavigate();

  useEffect(() => {
    const fetchPlayList = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/playList/${playlist.PlaylistID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setSongList(data);
        setIsFetching(false);
      } catch (error) {
        console.error(error);
        setIsFetching(false);
        setError("An error occurred while fetching songs");
      }
    };
    fetchPlayList();
  }, [playlist.PlaylistID]);

  useEffect(() => {
    if (songList.length > 0) {
      const filteredSongs = songList.filter((song) => song.videoId !== id);
      setPlayListSong(filteredSongs);
    }
  }, [id, songList]);

  useEffect(() => {
    if (!id && songList.length > 0) {
      setPlayListSong(songList);
      history.push(
        `/users/${userData.UserName}/playlist/${playlist.PlaylistID}/play/${songList[0].videoId}`
      );
    }
  }, [id, songList, history, playlist.PlaylistID]);

  const handlePlaysing = (id) => {
    history.push(
      `/users/${userData.userName}/playlist/${playlist.PlaylistID}/play/${id}`
    );
  };

  return (
    <div className="song-page">
      <div className="now-playing">
        <YouTubePlayer videoId={id} />
        <div className="song-info">
          <h2 className="now-playing-header">Now Playing</h2>
        </div>
      </div>

      <div className="other-songs">
        <h3>Other Songs in the Playlist</h3>
        {isFetching ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {playlistSong.map((song) => (
              <li key={song.id}>
                <Link to={`/song/${song.videoId}`}>{song.SongName}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default Playlist_Play;
