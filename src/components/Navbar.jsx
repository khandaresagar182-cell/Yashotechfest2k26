import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleExplore = () => {
        navigate('/events');
        setIsMenuOpen(false); // Close menu on navigation
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <img src={logo} alt="YSPM Logo" className="logo-image" />
                    <div className="logo-text">
                        <div className="logo-main">Yashoda Technical Campus</div>
                        <div className="logo-sub">Faculty of Polytechnic</div>
                    </div>
                </div>

                <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle Navigation">
                    {isMenuOpen ? '✕' : '☰'}
                </button>

                <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
                    <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                    <li><Link to="/events" onClick={() => setIsMenuOpen(false)}>Events</Link></li>

                    <li><button className="explore-btn" onClick={handleExplore}>Register Now</button></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
