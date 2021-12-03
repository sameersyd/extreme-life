import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import App from './App.jsx';
import Game from '../src/Pages/Game/Game.jsx';

ReactDOM.render(
    <Router>
        <Routes>
            <Route exact path="/" element={<App />}> /></Route>
            <Route exact path="/game" element={<Game />}> /></Route>
        </Routes>
    </Router>
    , document.getElementById("root")
);
