import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './pages/LandingPage';
import EventsPage from './pages/EventsPage';
import RegistrationPage from './pages/RegistrationPage';
import './App.css';

function App() {
    return (
        <ErrorBoundary>
            <Router>
                <ScrollToTop />
                <div className="App">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/events" element={<EventsPage />} />
                        <Route path="/register" element={<RegistrationPage />} />
                    </Routes>
                </div>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
