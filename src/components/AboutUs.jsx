import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
    return (
        <section className="about-us" id="about-us">
            <div className="about-container">
                <div className="about-header">
                    <h2 className="about-title">About Us</h2>
                    <div className="title-underline"></div>
                </div>

                <div className="about-content">
                    <div
                        className="about-card"
                        onClick={() => window.open('https://www.yes.edu.in/', '_blank')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-icon">🎓</div>
                        <h3>Yashoda Technical Campus</h3>
                        <p>
                            Yashoda Technical Campus, Faculty of Polytechnic is a premier institution
                            committed to delivering quality technical education through its NBA-accredited
                            programs. The institute offers industry-oriented diploma courses that prepare
                            students to excel in the ever-evolving technological landscape.
                        </p>
                    </div>

                    <div className="about-card">
                        <div className="card-icon">🏆</div>
                        <h3>YashoTech Fest 2K26</h3>
                        <p>
                            YashoTech Fest 2K26 is our state-level technical competition that brings
                            together brilliant minds from across the region. With exciting events across
                            multiple departments, participants compete for amazing prizes while showcasing
                            their technical prowess and innovation.
                        </p>
                    </div>


                </div>
            </div>
        </section>
    );
};

export default AboutUs;
