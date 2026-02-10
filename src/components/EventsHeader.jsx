import React from 'react';
import './EventsHeader.css';

const EventsHeader = () => {
    return (
        <header className="events-header">
            <div className="header-badge">★ STATE-LEVEL TECHNICAL COMPETITION ★</div>
            <h1 className="header-title">
                <span className="title-yashotech">YashoTech</span>
                <span className="title-fest">Fest 2K26</span>
            </h1>
            <p className="header-tagline">Think it, Crack it, Lead it. Join the ultimate convergence of technical minds and innovation.</p>

            <div className="header-buttons">
                <button className="header-explore-btn">Explore Events ⇩</button>
                <div className="header-prize">🏆 Win Exciting Prizes</div>
            </div>

            <div className="save-the-date-card">
                <div className="save-text">SAVE THE DATE</div>
                <div className="date-number">24</div>
                <div className="date-month">FEB</div>
                <div className="date-year">2026</div>
            </div>
        </header>
    );
};

export default EventsHeader;
