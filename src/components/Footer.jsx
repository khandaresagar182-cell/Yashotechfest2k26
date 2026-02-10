import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section patrons-section">
                    <h4>PATRONS</h4>
                    <div className="patron-card">
                        <span className="patron-name">Prof. Dashrath Sagare</span>
                        <small>President, YSPM, Satara</small>
                    </div>
                    <div className="patron-card">
                        <span className="patron-name">Dr. Ajinkya Sagare</span>
                        <small>Vice President, YSPM, Satara</small>
                    </div>
                </div>

                <div className="footer-section convenor-section">
                    <h4>CONVENOR</h4>
                    <div className="convenor-card">
                        <span className="convenor-name">Dr. Ganesh Survase</span>
                        <small>Registrar, YSPM, Satara</small>
                    </div>
                    <div className="convenor-card">
                        <span className="convenor-name">Dr. Pravin Gavade</span>
                        <small>Principal,Yashoda Polytechnic, Satara</small>
                    </div>
                </div>

                <div className="footer-section">
                    <h4>ALL HOD'S</h4>
                    <p>Prof. R.S. Khandekar (HOD GSH)</p>
                    <p>Dr. R.H. Basugade (HOD ME)</p>
                    <p>Prof. P.S. Matkar (HOD CE)</p>
                    <p>Prof. T.S. Kenjale (HOD IF)</p>
                    <p>Prof. B.P. Kumbhar (HOD EE)</p>
                    <p>Prof. G.J. Sutar (HOD CO)</p>
                    <p>Prof. S.G. Dolas (HOD AI & ML)</p>
                </div>

                <div className="footer-section">
                    <h4>FACULTY COORDINATORS</h4>
                    <p>Prof. A.R. Phadtare</p>
                    <p>Prof. P.R. Gosavi</p>
                    <p>Prof. P.S. Pawar</p>
                </div>

                <div className="footer-section">
                    <h4>STUDENT ASSOC. PRESIDENTS</h4>
                    <div className="association-list">
                        <p>Mr. Rajaram Deshpande (AI & ML)</p>
                        <p>Ms. Sanika Shinde (CO)</p>
                        <p>Ms. Shravanii Mardhekar (IF)</p>
                        <p>Mr. Shreyash Sawant (ME)</p>
                        <p>Ms. Vaishnavi Bhilare (CE)</p>
                        <p>Mr. Ayush Sawant (EE)</p>
                        <p>Ms. Satvika Kale (GSH)</p>  
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-logo">
                    <h3>Yashoda Technical Campus</h3>
                    <p>Satara, Maharashtra</p>
                </div>
                <p className="copyright">© 2026 AI/ML Association. All rights reserved</p>
            </div>
        </footer>
    );
};

export default Footer;
