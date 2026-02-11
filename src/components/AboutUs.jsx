import { motion } from 'framer-motion';
import './AboutUs.css';

const AboutUs = () => {
    return (
        <section className="about-us" id="about-us">
            <div className="about-container">
                <motion.div
                    className="about-header"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="about-title">About Us</h2>
                    <div className="title-underline"></div>
                </motion.div>

                <div className="about-content">
                    <motion.div
                        className="about-card"
                        onClick={() => window.open('https://www.yes.edu.in/', '_blank')}
                        style={{ cursor: 'pointer' }}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="card-icon">🎓</div>
                        <h3>Yashoda Technical Campus</h3>
                        <p>
                            Yashoda Technical Campus, Faculty of Polytechnic is a premier institution
                            committed to delivering quality technical education through its NBA-accredited
                            programs. The institute offers industry-oriented diploma courses that prepare
                            students to excel in the ever-evolving technological landscape.
                        </p>
                    </motion.div>

                    <motion.div
                        className="about-card"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <div className="card-icon">🏆</div>
                        <h3>YashoTech Fest 2K26</h3>
                        <p>
                            Beyond academics, Yashoda Polytechnic focuses on the holistic development
                            of students by fostering professional skills, values, and leadership qualities,
                            shaping them into skilled professionals and responsible youth of India.
                        </p>
                    </motion.div>


                </div>
            </div>
        </section>
    );
};

export default AboutUs;
