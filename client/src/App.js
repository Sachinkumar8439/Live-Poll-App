// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PollRoom from './components/PollRoom';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/poll/:roomCode" element={<PollRoom />} />
            </Routes>
        </Router>
    );
};

export default App;
