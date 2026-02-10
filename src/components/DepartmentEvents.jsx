import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DepartmentEvents.css';

const DepartmentEvents = () => {
    const navigate = useNavigate();

    const handleRegister = (eventName) => {
        navigate('/register', { state: { eventName } });
    };

    const departments = [
        {
            id: 1,
            name: 'AI & Machine Learning',
            icon: '💡',
            color: '#fef3c7', // Yellow accent
            events: [
                {
                    id: 101,
                    name: 'Coding Competition',
                    desc: 'Showcase your programming skills in this high intensity coding challenge.',
                    rulesLink: 'https://drive.google.com/file/d/1tqkD-WLzGOi-ANF4q0i_1De__yChKcVs/view?usp=sharing',
                    fees: '₹50',
                    type: 'TECH',
                    typeColor: '#d1fae5',
                    typeTextColor: '#065f46',
                    coords: [
                        { name: 'Ms. Patil P.J.', role: 'Faculty', phone: '9860744912' },
                        { name: 'Chitransh Karanjkar', role: 'Student', phone: '8010622639' }
                    ]
                },
                {
                    id: 102,
                    name: 'BGMI Competition',
                    desc: 'Battlegrounds Mobile India tournament. Squad up and survive till the end.',
                    rulesLink: 'https://drive.google.com/file/d/1pGGSuJ1e1AEEeWeixJwgCeDQDTq01XxE/view?usp=sharing',
                    fees: '₹50',
                    icon: '⚔️',
                    type: 'GAMING',
                    typeColor: '#f3e8ff',
                    typeTextColor: '#6b21a8',
                    coords: [
                        { name: 'Mr. Pawar P.S.', role: 'Faculty', phone: '9579552958' },
                        { name: 'Amit Bhosale', role: 'Student', phone: '8208468545' }
                    ]
                }
            ]
        },
        {
            id: 2,
            name: 'Computer Engineering',
            icon: '💻',
            color: '#dbeafe', // Blue accent
            events: [
                {
                    id: 201,
                    name: 'Technical Auction',
                    desc: 'Bid for the best tech components and build your virtual arsenal.',
                    rulesLink: 'https://drive.google.com/file/d/1aawqbworhNob-g4qg5Yay1hfvOxrYMNk/view?usp=sharing',
                    fees: '₹50',
                    icon: '🔨',
                    coords: [
                        { name: 'Ms. Chavan S.A.', role: 'Faculty', phone: '8928028408' },
                        { name: 'Suzan Mulla', role: 'Student', phone: '8668995298' }
                    ]
                },
                {
                    id: 202,
                    name: 'Mock Job Interviews',
                    desc: 'Prepare for the real world. Face expert panels and refine your skills.',
                    rulesLink: 'https://drive.google.com/file/d/1A4yOgpyyUff-9PJ5kbSzZzCQQ1o3fDyO/view?usp=sharing',
                    fees: '₹50',
                    icon: '💼',
                    coords: [
                        { name: 'Ms. Virkar S.S.', role: 'Faculty', phone: '9284539392' },
                        { name: 'Om Zare', role: 'Student', phone: '7028902877' }
                    ]
                },
                {
                    id: 203,
                    name: 'Technical Treasure Hunt',
                    desc: 'Solve clues and debug code to find the hidden treasure.',
                    rulesLink: 'https://drive.google.com/file/d/1UrBzxJ4PkhmKye4rLl7nwNt0taAiqvg7/view?usp=sharing',
                    fees: '₹50',
                    icon: '🗺️',
                    coords: [
                        { name: 'Mrs. Shaikh D.T.', role: 'Faculty', phone: '8080577785' },
                        { name: 'Swapnil Babar', role: 'Student', phone: '7841868563' }
                    ]
                },
                {
                    id: 204,
                    name: 'Paper Cup Tower Madness',
                    desc: 'A fun engineering challenge to test stability and structure.',
                    rulesLink: 'https://drive.google.com/file/d/1jcAdbuI_HO_Vkt4k_d43aHlg6Z6BzDgh/view?usp=sharing',
                    fees: '₹50',
                    icon: '🥤',
                    coords: [
                        { name: 'Mrs. Shinde J.M.', role: 'Faculty', phone: '9730722218' },
                        { name: 'Shreyash Ranamware', role: 'Student', phone: '9172450040' }
                    ]
                }
            ]
        },
        {
            id: 3,
            name: 'Civil Engineering',
            icon: '🏗️',
            color: '#fed7aa', // Orange accent
            events: [
                {
                    id: 301,
                    name: 'Technical Paper Presentation',
                    desc: 'Present your innovative ideas and research in civil engineering.',
                    rulesLink: 'https://drive.google.com/file/d/1L0yBwl7KsoRyH2f4LUGorducuWfmLLRf/view?usp=sharing',
                    fees: '₹50',
                    icon: '📄',
                    coords: [
                        { name: 'Ms. Chavan S.S', role: 'Faculty', phone: '9834418538' },
                        { name: 'Pranali Kakade', role: 'Student', phone: '8149824289' }
                    ]
                },
                {
                    id: 302,
                    name: 'Bridge Making Competition',
                    desc: 'Design and construct the strongest bridge with limited resources.',
                    rulesLink: 'https://drive.google.com/file/d/1qWbJYUCbnMaKCnO0SVKfpdGRxx9K6Q4T/view?usp=sharing',
                    fees: '₹50',
                    icon: '🛠️',
                    coords: [
                        { name: 'Ms. Jadhav R.D.', role: 'Faculty', phone: '8208181951' },
                        { name: 'Neel Nikam', role: 'Student', phone: '8275477077' }
                    ]
                },
                {
                    id: 303,
                    name: 'Build Your Brain',
                    desc: 'A challenging aptitude and logic test for civil engineers.',
                    rulesLink: 'https://drive.google.com/file/d/1XSFizEh13UlS7FsBZMBeMepwjnIqNIl0/view?usp=sharing',
                    fees: '₹50',
                    icon: '💡',
                    coords: [
                        { name: 'Mrs. Tate M.S.', role: 'Faculty', phone: '9209850713' },
                        { name: 'Aishwarya Nalawade', role: 'Student', phone: '9653481383' }
                    ]
                }
            ]
        },
        {
            id: 4,
            name: 'Mechanical Engineering',
            icon: '⚙️',
            color: '#fce7f3', // Pink accent
            events: [
                {
                    id: 401,
                    name: 'Technical Quiz Competition',
                    desc: 'Test your mechanical engineering knowledge.',
                    rulesLink: 'https://drive.google.com/file/d/1q_MGvrXJYvUSpesZrVbmtE959I2gUoYh/view?usp=sharing',
                    fees: '₹50',
                    icon: '📝',
                    coords: [
                        { name: 'Mr. A.B. Pawar', role: 'Faculty', phone: '9975696777' },
                        { name: 'Rohan Pawar', role: 'Student', phone: '9112618338' }
                    ]
                },
                {
                    id: 402,
                    name: 'Technical Paper Presentation',
                    desc: 'Present your technical papers and research.',
                    rulesLink: 'https://drive.google.com/file/d/1uZbJT8fIhOyV-z7iY5TBWT5SUtEloI-U/view?usp=sharing',
                    fees: '₹50',
                    icon: '📄',
                    coords: [
                        { name: 'Mrs. A.H. Koli', role: 'Faculty', phone: '9665844789' },
                        { name: 'Gaurav Dhaygude', role: 'Student', phone: '9226558089' }
                    ]
                }
            ]
        },
        {
            id: 5,
            name: 'E & TC Department',
            icon: '🔌',
            color: '#e9d5ff', // Purple accent
            events: [
                {
                    id: 501,
                    name: 'Robo Race',
                    desc: 'Navigate your robot through obstacles in the fastest time.',
                    rulesLink: 'https://drive.google.com/file/d/1X4dKS1yKcfa21HNgLC-DdUEK3ibWIY-e/view?usp=sharing',
                    fees: '₹50',
                    icon: '🤖',
                    coords: [
                        { name: 'Mr. A.B. Pawar', role: 'Faculty', phone: '9975696777' },
                        { name: 'Rohan Pawar', role: 'Student', phone: '9112618338' }
                    ]
                }
            ]
        },
        {
            id: 6,
            name: 'General Science & Humanities',
            icon: '♟️',
            color: '#fecaca', // Red accent
            events: [
                {
                    id: 601,
                    name: 'Quiz Competition',
                    desc: 'Test your general knowledge and quick thinking skills.',
                    rulesLink: 'https://drive.google.com/file/d/1pNktfBwNmv_ngQC1UlL9e9XbnfUx5Pou/view?usp=sharing',
                    fees: '₹50',
                    icon: '📝',
                    coords: [
                        { name: 'Ms. Navghune J.V.', role: 'Faculty', phone: '7066869776' },
                        { name: 'Satvika Kale', role: 'Student', phone: '7758046073' }
                    ]
                },
                {
                    id: 602,
                    name: 'Fix It',
                    desc: 'Troubleshoot and fix scientific and technical models.',
                    rulesLink: 'https://drive.google.com/file/d/1i-BDZA7ZPOG0JC_ogThgzDdlwede7qTC/view?usp=sharing',
                    fees: '₹50',
                    icon: '🔧',
                    coords: [
                        { name: 'Ms. Dhumal P.P.', role: 'Faculty', phone: '7887472862' },
                        { name: 'Praniti Jadhav', role: 'Student', phone: '7498456987' }
                    ]
                }
            ]
        },
        {
            id: 7,
            name: 'Information Technology',
            icon: '🌐',
            color: '#ccfbf1', // Cyan accent
            events: [
                {
                    id: 701,
                    name: 'Web Design Challenge',
                    desc: 'Create stunning and responsive web interfaces.',
                    rulesLink: 'https://drive.google.com/file/d/1a0OmsV33W9Dv2qSkAKwv9baKXxN-iadS/view?usp=sharing',
                    fees: '₹50',
                    icon: '🖥️',
                    coords: [
                        { name: 'Ms. Chavan A.R.', role: 'Faculty', phone: '9359706733' },
                        { name: 'Shreya Mane', role: 'Student', phone: '9403812048' }
                    ]
                },
                {
                    id: 702,
                    name: 'Poster Presentation',
                    desc: 'Present your innovative ideas through creative posters.',
                    rulesLink: 'https://drive.google.com/file/d/1aKiz96Yl1Q2eVJdoZjCXw8hCdTN145a4/view?usp=sharing',
                    fees: '₹50',
                    icon: '📊',
                    coords: [
                        { name: 'Ms. Ghadge Prajakta', role: 'Faculty', phone: '8956679005' },
                        { name: 'Prathamesh Ghapne', role: 'Student', phone: '7350396549' }
                    ]
                }
            ]
        },
        {
            id: 8,
            name: 'Electrical Engineering',
            icon: '⚡',
            color: '#ede9fe', // Light Purple accent
            events: [
                {
                    id: 801,
                    name: 'Technical Quiz',
                    desc: 'Test your electrical engineering knowledge.',
                    rulesLink: 'https://drive.google.com/file/d/1s2TdosvEJzkptfcITLq6Jg72m6WdlvEW/view?usp=sharing',
                    fees: '₹50',
                    icon: '📝',
                    coords: [
                        { name: 'Ms. P.S. Pawar', role: 'Faculty', phone: '9657636967' },
                        { name: 'Aayush Sawant', role: 'Student', phone: '7875603909' }
                    ]
                },
                {
                    id: 802,
                    name: 'Poster & Model Presentation',
                    desc: 'Showcase your technical posters and working models.',
                    rulesLink: 'https://drive.google.com/file/d/1Dya9w2rqU3z7aDutrifhZhbsijIFy_3v/view?usp=sharing',
                    fees: '₹50',
                    icon: '📊',
                    coords: [
                        { name: 'Ms. K.B. Kambale', role: 'Faculty', phone: '7066352274' },
                        { name: 'Rohit Jadhav', role: 'Student', phone: '9834696325' }
                    ]
                },
                {
                    id: 803,
                    name: 'Free Fire (E Sport Event)',
                    desc: 'Compete in this popular battle royale game.',
                    rulesLink: 'https://drive.google.com/file/d/11d4WsvysG05pHrMIUnlk9-UIQB_F1pXl/view?usp=sharing',
                    fees: '₹50',
                    icon: '🎮',
                    coords: [
                        { name: 'Ms. V.V. Gaikwad', role: 'Faculty', phone: '9356896674' },
                        { name: 'Soham Bodhe', role: 'Student', phone: '8308527962' }
                    ]
                }
            ]
        }
    ];

    return (
        <section className="department-events">
            <div className="events-container">
                {(departments || []).map(dept => (
                    <div key={dept.id} className="dept-section">
                        <div className="dept-header-row">
                            <span className="dept-section-icon" style={{ backgroundColor: dept.color }}>{dept.icon}</span>
                            <h2 className="dept-section-title">{dept.name}</h2>

                        </div>
                        <div className="dept-underline" style={{ backgroundColor: dept.color }}></div>

                        <div className="events-grid">
                            {(dept.events || []).map(event => (
                                <div key={event.id} className={`event-card ${dept.id === 1 ? 'aiml-event-card' : ''} ${dept.id === 2 ? 'comp-eng-event-card' : ''} ${dept.id === 3 ? 'civil-event-card' : ''} ${dept.id === 4 ? 'mechanical-event-card' : ''} ${dept.id === 5 ? 'entc-event-card' : ''} ${dept.id === 6 ? 'science-humanities-event-card' : ''} ${dept.id === 7 ? 'it-event-card' : ''} ${dept.id === 8 ? 'electrical-event-card' : ''}`}>
                                    <div className="event-card-top">
                                        <div className="event-icon-box" style={{ color: '#1e3a8a' }}>
                                            {event.icon || '< >'}
                                        </div>
                                        <a
                                            href={event.rulesLink || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="event-rules-link"
                                            onClick={(e) => {
                                                if (!event.rulesLink || event.rulesLink === '#') {
                                                    e.preventDefault();
                                                    alert('Rules details coming soon!');
                                                }
                                            }}
                                        >
                                            Rules & Regulations 📄
                                        </a>
                                    </div>

                                    <h3 className="event-title">{event.name}</h3>
                                    <p className="event-desc">{event.desc}</p>

                                    <div className="event-coords">
                                        {(event.coords || []).map((coord, idx) => (
                                            <div key={idx} className="coord-row">
                                                <span className="coord-icon">👤</span>
                                                <div className="coord-text">
                                                    <div><span className="coord-role">{coord.role}: </span>{coord.name}</div>
                                                    {coord.phone && <div className="coord-phone" style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>📞 {coord.phone}</div>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="event-footer">
                                        <div className="event-price">
                                            {event.fees} /Entry <span style={{ fontSize: '0.7em', fontWeight: '400' }}>per person</span>
                                        </div>
                                        <button
                                            className="btn-register"
                                            onClick={() => handleRegister(event.name)}
                                        >
                                            Register
                                        </button>
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

export default DepartmentEvents;
