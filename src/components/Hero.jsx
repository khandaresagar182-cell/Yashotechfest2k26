import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    const navigate = useNavigate();
    const calculateTimeLeft = () => {
        const difference = +new Date("2026-02-24") - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        } else {
            timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleExplore = () => {
        const eventsSection = document.getElementById('department-events');
        if (eventsSection) {
            eventsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="hero">
            <div className="hero-container">
                <div className="hero-badge">STATE LEVEL TECHNICAL COMPETITION</div>
                <div className="hero-title">
                    <span className="title-yashotech">YASHOTECH</span>
                    <span className="title-fest">FEST 2K26</span>
                </div>

                <p className="hero-tagline">"Think it, Crack it, Lead it."</p>

                <div className="live-banner-container">
                    <div className="live-banner">
                        <div className="live-text">FEST IS LIVE 🚀</div>
                        <div className="live-subtext">Welcome to Yashotech Fest 2K26</div>
                    </div>
                </div>

                <div className="hero-buttons">
                    <button className="btn-explore desktop-only" onClick={handleExplore}>Explore Now</button>
                    <button className="btn-explore mobile-only" onClick={() => navigate('/events')}>Register Now</button>
                    <button className="btn-prize">⭕ 24 Feb 2026</button>
                </div>

                <div className="scroll-indicator">⌄</div>
            </div >
        </section >
    );
};

export default Hero;
