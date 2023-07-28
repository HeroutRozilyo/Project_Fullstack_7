import React, { useState, useEffect } from 'react';
import YouTubePlayer from './YouTubePlayer';
import { useParams, Link } from 'react-router-dom';
import useLocalStorage from './useLocalStorage';

const SongPage = () => {
  const { id } = useParams();
  const [songList, setSongList] = useLocalStorage('songList', [], 10 * 60 * 1000);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [singerSongs, setSingerSongs] = useState([]);

  useEffect(() => {
    const fetchSingerSongs = async () => {
        
      try {
        setIsFetching(true);
  
        // Check if the song list exists in local storage and if it has expired
        const currentTime = new Date().getTime();
        if (songList.value.length > 0 && songList.expires > currentTime) {
        } else {
          // Fetch the song list from the API
          const response = await fetch(`http://localhost:3001/api/songs`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch songs');
          }
  
          const data = await response.json();
          set
  
          // Filter the songs by the same singer as the currently playing song
          const currentSong = data.find(song => song.videoId === id);
          const singerId = currentSong ? currentSong.AristID : null;
          const songsBySameSinger = data.filter(song => song.AristID === singerId);
  
          setSingerSongs(songsBySameSinger);
  
          // Save the filtered song list to local storage with a new expiration time
          const expires = currentTime + 10 * 60 * 1000; // 10 minutes from now
          setSongList({ value: songsBySameSinger, expires });
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsFetching(false);
      }
    };
  
    fetchSingerSongs();
  }, [id, songList, setSongList]);
  

  return (
    <div className="song-page">
      <h2>Now Playing</h2>
      <YouTubePlayer videoId={id} />
      {isFetching ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h3>Other Songs by the Same Singer</h3>
          {singerSongs.length > 0 ? (
            <ul>
              {singerSongs.map((song) => (
                <li key={song.id}>
                  {/* Add a Link to each song to navigate to its page */}
                  <Link to={`/song/${song.videoId}`}>{song.SongName}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No other songs found for this singer.</p>
          )}
        </div>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default SongPage;
