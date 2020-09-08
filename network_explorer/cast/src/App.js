import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cast from './Cast';
import Playlists from './Playlists';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/cast" element={<Cast/>} ></Route>
        <Route path="/playlists" element={<Playlists/>} ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App