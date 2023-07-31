import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./js/login.js";
import Register from "./js/signup.js";
import MainScreen from "./js/MainScreen.js";
import PlayListPage from "./js/PlayListPage.js";
import CreatPlaylist from "./js/creatPlaylist.js";
import SongPage from "./js/SongPage.js";
import PlayPlaylist from "./js/playlist_play.js";
import FavoritePlaylist from "./js/favorite_playlist.js";
import Toolbar from "./js/ToolBar.js";
import Info from "./js/info.js";
import AddSong from "./js/addSong.js";
import AllSongs from "./js/AllSongs.js";
import InfoAdmin from "./js/InfoAdmin.js";
import UserList from "./js/UserList.js";

function App() {
  return (
    <div>
      <Toolbar></Toolbar>
      <Routes>
        {/* Set the default route to the login page */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users/:username/main" element={<MainScreen />} />
        <Route path="/allSongs" element={<AllSongs />} />
        <Route path="/userList" element={<UserList />} />
        <Route path="/add-song" element={<AddSong />} />
        <Route
          path="/users/:username/playlist/:id"
          element={<PlayListPage />}
        />
        <Route path="/users/:username/info" element={<Info />} />
        <Route path="/song/:id" element={<SongPage />} />
        <Route
          path="/users/:username/playlist/creatMyPlaylist"
          element={<CreatPlaylist />}
        />
        <Route
          path="/users/:username/playlist/creatMyPlaylist/:playlistid"
          element={<CreatPlaylist />}
        />
        <Route
          path="/users/:username/playlist/:id/play"
          element={<PlayPlaylist />}
        />
        <Route
          path="/users/:username/playlist/:Playlistid/play/:id"
          element={<PlayPlaylist />}
        />
        <Route
          path="/users/:username/playlist/favorite"
          element={<FavoritePlaylist />}
        />
        <Route path="/song/:songCode" element={<SongPage />} />
        <Route path="/user/:userID" element={<InfoAdmin />} />
      </Routes>
    </div>
  );
}

export default App;
