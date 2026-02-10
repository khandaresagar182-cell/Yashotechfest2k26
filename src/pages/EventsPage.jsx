import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import EventsHeader from '../components/EventsHeader';
import DepartmentEvents from '../components/DepartmentEvents';
import Footer from '../components/Footer';

const EventsPage = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <motion.div
            className="events-page"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <EventsHeader />
            <DepartmentEvents />
            <Footer />
        </motion.div>
    );
};

export default EventsPage;
