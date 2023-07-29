import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./js/login.js";
import Register from "./js/signup.js";
import MainScreen from "./js/MainScreen.js";
import PlayListPage from "./js/PlayListPage.js";
import CreatPlaylist from "./js/creatPlaylist.js";
import SongPage from "./js/SongPage.js";
import PlayPlaylist from "./js/playlist_play.js";

function App() {
  return (
    <div>
      <Routes>
        {/* Set the default route to the login page */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users/:username/main" element={<MainScreen />} />
        <Route
          path="/users/:username/playlist/:id"
          element={<PlayListPage />}
        />
        <Route path="/song/:id" element={<SongPage />} />
        <Route
          path="/users/:username/playlist/creatMyPlaylist"
          element={<CreatPlaylist />}
        />
        <Route
          path="/users/:username/playlist/:id/play"
          element={<PlayPlaylist />}
        />
        <Route path="/song/:songCode" element={<SongPage />} />
      </Routes>
    </div>
  );
}
export default App;
