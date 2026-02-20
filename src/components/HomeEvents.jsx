import React from 'react';
import './HomeEvents.css';

const HomeEvents = () => {
    const departments = [
        {
            id: 1,
            name: 'AI & ML',
            icon: '💡',
            headerColor: '#fef3c7', // Yellow
            events: [
                { name: 'Coding Competition', icon: '< >', coord: 'Coord: Ms. Patil P.J.' },
                { name: 'BGMI Gaming', icon: '⚔️', coord: 'Coord: Mr. Pawar P.S.' }
            ]
        },
        {
            id: 2,
            name: 'Computer Engg.',
            icon: '💻',
            headerColor: '#dbeafe', // Blue
            events: [
                { name: 'Technical Auction', icon: '🔨', coord: 'Coord: Ms. Chavan S.A.' },
                { name: 'Mock Job Interviews', icon: '💼', coord: 'Coord: Ms. Virkar S.S.' },
                { name: 'Technical Treasure Hunt', icon: '🗺️', coord: 'Coord: Mrs. Shaikh D.T.' },
                { name: 'Paper Cup Tower Madness', icon: '🥤', coord: 'Coord: Mrs. Shinde J.M.' }
            ]
        },
        {
            id: 3,
            name: 'Civil Engg.',
            icon: '🏗️',
            headerColor: '#fed7aa', // Orange/Pink
            events: [
                { name: 'Technical Paper Presentation(CIVIL)', icon: '📄', coord: 'Coord: Ms. Chavan S.S' },
                { name: 'Bridge Making Competition', icon: '🛠️', coord: 'Coord: Ms. Jadhav R.D.' },
                { name: 'Build Your Brain', icon: '💡', coord: 'Coord: Mrs. Tate M.S.' }
            ]
        },
        {
            id: 4,
            name: 'Mechanical',
            icon: '⚙️',
            headerColor: '#fce7f3', // Pink
            events: [
                { name: 'Technical Quiz Competition', icon: '📝', coord: 'Coord: Mr. A.B. Pawar' },
                { name: 'Technical Paper Presentation', icon: '📄', coord: 'Coord: Mrs. A.H. Koli' }
            ]
        },
        {
            id: 5,
            name: 'E & TC',
            icon: '🔌',
            headerColor: '#e9d5ff', // Purple
            events: [
                { name: 'Robo Race', icon: '🤖', coord: 'Coord: Mr. A.B. Pawar' }
            ]
        },
        {
            id: 6,
            name: 'Info Tech',
            icon: '🌐',
            headerColor: '#ccfbf1', // Cyan
            events: [
                { name: 'Web Design Challenge', icon: '🖥️', coord: 'Coord: Ms. Chavan A.R.' },
                { name: 'Poster Presentation', icon: '📊', coord: 'Coord: Ms. Ghadge Prajakta' }
            ]
        },
        {
            id: 7,
            name: 'Sci & Humanities',
            icon: '🔬',
            headerColor: '#d1fae5', // Green
            events: [
                { name: 'Quiz Competition(GSH)', icon: '📝', coord: 'Coord: Ms. Navghune J.V.' },
                { name: 'Fix It', icon: '🔧', coord: 'Coord: Ms. Dhumal P.P.' }
            ]
        },
        {
            id: 8,
            name: 'Electrical Engg.',
            icon: '⚡',
            headerColor: '#ede9fe', // Light Purple
            events: [
                { name: 'Technical Quiz', icon: '📝', coord: 'Coord: Ms. P.S. Pawar' },
                { name: 'Poster & Model', icon: '📊', coord: 'Coord: Ms. K.B. Kambale' },
                { name: 'Free Fire (E-Sport)', icon: '🎮', coord: 'Coord: Ms. V.V. Gaikwad' }
            ]
        }
    ];

    return (
        <section className="home-events" id="department-events">
            <h2 className="home-events-title">Department Events</h2>
            <div className="title-underline"></div>
            <p className="home-events-subtitle">Explore technical competitions organized by our various engineering departments.</p>

            <div className="home-events-grid">
                {(departments || []).map((dept) => (
                    <div key={dept.id} className="dept-summary-card">
                        <div className="dept-summary-header" style={{ backgroundColor: dept.headerColor }}>
                            <span className="dept-summary-icon">{dept.icon}</span>
                            <span className="dept-summary-name">{dept.name}</span>
                        </div>
                        <div className="dept-summary-body">
                            {(dept.events || []).map((ev, idx) => (
                                <div key={idx} className="summary-event-item">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#f1f5f9',
                                            borderRadius: '6px',
                                            fontSize: '1.1rem',
                                            color: '#1e3a8a',
                                            flexShrink: 0
                                        }}>
                                            {ev.icon}
                                        </div>
                                        <div className="summary-event-name" style={{ marginBottom: 0, flex: 1 }}>
                                            {ev.name}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HomeEvents;
