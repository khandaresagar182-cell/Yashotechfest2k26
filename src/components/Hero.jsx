import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger entrance animations
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleExplore = () => {
        const eventsSection = document.getElementById('department-events');
        if (eventsSection) {
            eventsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const highlights = [
        { icon: '👥', value: '500+', label: 'Participants' },
        { icon: '🏆', value: '30+', label: 'Events' },
        { icon: '🏛️', value: '6', label: 'Departments' },
        { icon: '🎯', value: '₹50K+', label: 'Prize Pool' },
    ];

    return (
        <section className="hero hero-ended">
            {/* Floating particles */}
            <div className="particles">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className={`particle particle-${i + 1}`} />
                ))}
            </div>

            <div className={`hero-container ${isVisible ? 'fade-in' : ''}`}>
                <div className="hero-badge">STATE LEVEL TECHNICAL COMPETITION</div>
                <div className="hero-title">
                    <span className="title-yashotech">YASHOTECH</span>
                    <span className="title-fest">FEST 2K26</span>
                </div>

                <p className="hero-tagline">"Think it, Crack it, Lead it."</p>

                {/* Fest Ended Banner */}
                <div className="ended-banner-container">
                    <div className="ended-banner">
                        <div className="ended-icon-row">
                            <span className="ended-trophy">🏆</span>
                        </div>
                        <div className="ended-text">FEST HAS ENDED</div>
                        <div className="ended-subtext">
                            Thank you for making Yashotech Fest 2K26 a grand success!
                        </div>
                        <div className="ended-date">
                            <span className="ended-date-icon">📅</span>
                            24 February 2026 — What a day it was!
                        </div>
                    </div>
                </div>

                {/* Highlights */}
                <div className="highlights-grid">
                    {highlights.map((item, idx) => (
                        <div
                            key={idx}
                            className="highlight-card"
                            style={{ animationDelay: `${0.2 + idx * 0.15}s` }}
                        >
                            <div className="highlight-icon">{item.icon}</div>
                            <div className="highlight-value">{item.value}</div>
                            <div className="highlight-label">{item.label}</div>
                        </div>
                    ))}
                </div>

                {/* CTA Buttons */}
                <div className="hero-buttons">
                    <button className="btn-explore desktop-only" onClick={handleExplore}>
                        View Event Results
                    </button>
                    <button className="btn-explore mobile-only" onClick={() => navigate('/events')}>
                        View Event Results
                    </button>
                    <button className="btn-prize" onClick={() => navigate('/gallery')}>
                        📸 View Gallery
                    </button>
                </div>

                <div className="scroll-indicator">⌄</div>
            </div>
        </section>
    );
};

export default Hero;

