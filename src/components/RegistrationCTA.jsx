import React from 'react';
import './RegistrationCTA.css';

const RegistrationCTA = () => {
    return (
        <section className="registration-cta">
            <div className="cta-container">
                <div className="qr-section">
                    <div className="qr-box">
                        <div className="qr-placeholder">
                            <div className="qr-code">
                                <div className="qr-grid">
                                    {[...Array(9)].map((_, i) => (
                                        <div key={i} className="qr-cell"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="qr-label">Scan to Register</div>
                        <div className="entrance-fee">ENTRANCE FEE</div>
                    </div>
                </div>

                <div className="cta-content">
                    <h2 className="cta-title">Ready to Compete?</h2>
                    <p className="cta-description">
                        Join over 1000+ students in the biggest technical fest of the year.
                        Showcase your skills, win cash prizes, and get recognized by industry leaders.
                    </p>
                    <div className="cta-buttons">
                        <button className="btn-register">Register Online →</button>
                        <button className="btn-brochure">Download Brochure</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RegistrationCTA;
