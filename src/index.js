import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import App from './App.jsx';
import Game from '../src/Pages/Game/Game.jsx';

ReactDOM.render(
    <Router>
        <Route exact path="/" component={App}/>
        <Route exact path="/game" component={Game}/>
    </Router>
    , document.getElementById("root")
);