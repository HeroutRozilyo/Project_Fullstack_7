import React, { useState, useEffect } from "react";
import YouTubePlayer from "./YouTubePlayer";
import { useParams, Link } from "react-router-dom";
import "../css/SongPage.css";

const SongPage = () => {
  const { id } = useParams();
  const [songList, setSongList] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);
  const [singerSongs, setSingerSongs] = useState([]);

  const CACHE_KEY = "songCache";

  useEffect(() => {
    const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (!cachedData || !cachedData.data || cachedData.data.length === 0) {
      const fetchSongsAndCache = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/songs`);
          const data = await response.json();
          const cacheData = {
            timestamp: Date.now(),
            data: data,
          };
          localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
          setSongList(data); // Set the state with the fetched data
          setIsFetching(false); // Set isFetching to false after fetching
        } catch (error) {
          setIsFetching(false); // Set isFetching to false in case of an error
          setError(error.message);
          console.error(error);
        }
      };

      fetchSongsAndCache();
      const interval = setInterval(fetchSongsAndCache, 10 * 60 * 1000); // 10 minutes interval
      return () => clearInterval(interval);
    } else {
      // If data is already in cache, set the state with the cached data and stop fetching
      setSongList(cachedData.data); // Set the state with the data property of cachedData
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    // Filter the songs by the same singer when the id or songList changes
    handleSearch();
  }, [id, songList]);

  const handleSearch = () => {
    const currentSong = songList.find((song) => song.videoId === id);
    const singerId = currentSong ? currentSong.ArtistID : null;
    const songsBySameSinger = songList.filter(
      (song) => song.ArtistID === singerId && song.videoId !== id
    );
    setSingerSongs(songsBySameSinger);
  };

  return (
    <div className="song-page">
      <div className="now-playing">
        <YouTubePlayer videoId={id} />
        <div className="song-info">
          <h2>Now Playing</h2>
          {/* Display song information like SongName, Artist, etc. */}
        </div>
      </div>

      <div className="other-songs">
        <h3>Other Songs by the Same Artist</h3>
        {isFetching ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {singerSongs.map((song) => (
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

export default SongPage;
