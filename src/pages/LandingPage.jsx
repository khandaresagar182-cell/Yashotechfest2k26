import React from 'react';
import Hero from '../components/Hero';
import AboutUs from '../components/AboutUs';
import PrizeBanner from '../components/PrizeBanner';
import HomeEvents from '../components/HomeEvents';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const LandingPage = () => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <motion.div
            className="landing-page"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Hero />
            </motion.div>

            <motion.div variants={itemVariants}>
                <AboutUs />
            </motion.div>

            <motion.div variants={itemVariants}>
                <PrizeBanner />
            </motion.div>

            <motion.div variants={itemVariants}>
                <HomeEvents />
            </motion.div>

            <motion.div variants={itemVariants}>
                <Footer />
            </motion.div>
        </motion.div>
    );
};

export default LandingPage;
