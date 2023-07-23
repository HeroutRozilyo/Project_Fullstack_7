import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './js/login.js';
import Register from './js/signup.js';
import MainScreen from './js/MainScreen.js';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
       
        <Route path="/register" element={<Register />} />
        <Route path="/users/:username/main" element={<MainScreen />} />
      </Routes>
    </div>
  );
}

export default App;
