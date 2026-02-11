import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { registrationAPI } from '../config/api';
import './RegistrationPage.css';

// Load Razorpay script
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const RegistrationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Check if user navigated with a specific event
    const initialEvent = location.state?.eventName || '';

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        college: '',
        event: initialEvent,
        teammate2: '',
        teammate3: '',
        teammate4: '',
        teammate5: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // const [emailExists, setEmailExists] = useState(false); // Removed duplicate check


    // Flat rate team events (always ₹200) - NOW EMPTY as per new requirement
    const isFlatRateEvent = false;

    const isTechnicalAuction = formData.event === "Technical Auction";
    const isPaperPresentation = formData.event === "Technical Paper Presentation";
    const isBridgeMaking = formData.event === "Bridge Making Competition";
    const isBuildYourBrain = formData.event === "Build Your Brain";
    const isFixIt = formData.event === "Fix It";
    const isWebDesign = formData.event === "Web Design Challenge";
    const isQuiz = formData.event === "Technical Quiz Competition" || formData.event === "Technical Quiz" || formData.event === "Quiz Competition";
    const isPaperCup = formData.event === "Paper Cup Tower Madness";
    const isOldPosterPresentation = formData.event === "Poster Presentation";
    const isPosterPresentation = formData.event === "Poster & Model Presentation";
    const isOptionalTwoMembers = isWebDesign || isQuiz || isOldPosterPresentation || isPaperPresentation || isBridgeMaking || isBuildYourBrain || isFixIt || isPosterPresentation || isPaperCup || formData.event === "Robo Race";

    const isStrictTwoMembers = false; // All previously strict events are now optional 1-2

    const isTreasureHunt = formData.event === "Technical Treasure Hunt";
    const isBgmi = formData.event === "BGMI Competition";
    const isFreeFire = formData.event === "Free Fire (E Sport Event)";

    // Events with Min 2, Max 4 members
    const isFourMemberEvent = isTreasureHunt || isBgmi || isFreeFire;

    // Dynamic pricing team events (₹50 per person)
    const isDynamicTeamEvent = [
        "Technical Auction",
        "Technical Paper Presentation",
        "Bridge Making Competition",
        "Paper Cup Tower Madness",
        "Build Your Brain",
        "Build Your Brain",
        "Fix It",
        "Web Design Challenge",
        "Poster Presentation",
        "Poster & Model Presentation",
        "Technical Quiz Competition",
        "Technical Quiz",
        "Quiz Competition",
        "Technical Treasure Hunt",
        "Robo Race",
        "BGMI Competition",
        "Free Fire (E Sport Event)"
    ].includes(formData.event);

    // Any team event (for showing teammate fields)
    const isTeamEvent = isFlatRateEvent || isDynamicTeamEvent;

    // Update form if state changes or navigation happens
    useEffect(() => {
        if (location.state?.eventName) {
            setFormData(prev => ({ ...prev, event: location.state.eventName }));
        }
    }, [location.state]);

    // Load Razorpay script on component mount
    useEffect(() => {
        loadRazorpayScript();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError(''); // Clear error on input change
    };

    // Check email availability - REMOVED
    /*
    const handleEmailBlur = async () => {
        if (formData.email) {
            try {
                const response = await registrationAPI.checkEmail(formData.email);
                setEmailExists(response.data.exists);
            } catch (err) {
                if (process.env.NODE_ENV === 'development') {
                    console.error('Email check failed:', err);
                }
            }
        }
    };
    */


    // Handle Razorpay payment
    const handlePayment = async (orderData) => {
        try {
            setLoading(true);

            // ---------------------------------------------------------
            // 🛑 MOCK PAYMENT HANDLING (For Testing/No API Key)
            // ---------------------------------------------------------
            if (orderData.orderId.startsWith('order_mock') || orderData.keyId === 'mock_key_id') {
                // Mock payment mode detected

                // Simulate user payment interaction delay
                setTimeout(async () => {
                    try {
                        // Call backend verification directly with mock data
                        const verifyResponse = await registrationAPI.verifyPayment({
                            razorpay_order_id: orderData.orderId,
                            razorpay_payment_id: `pay_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                            razorpay_signature: 'mock_signature_bypass'
                        });

                        if (verifyResponse.data.success) {
                            alert(`🎉 Mock Payment Successful!\n\n(Test Mode - No Real Money Deducted)\nAmount: ₹${orderData.amount}`);
                            navigate('/');
                        }
                    } catch (verifyError) {
                        if (process.env.NODE_ENV === 'development') {
                            console.error('Mock verification failed:', verifyError);
                        }
                        alert('❌ Mock payment verification failed.');
                    } finally {
                        setLoading(false);
                    }
                }, 1500); // 1.5s delay to simulate processing
                return;
            }
            // ---------------------------------------------------------

            // Configure Razorpay options with data from backend
            const options = {
                key: orderData.keyId, // Razorpay Key ID from backend
                amount: orderData.amount * 100, // Convert to paise (₹200 = 20000 paise)
                currency: orderData.currency || 'INR',
                name: "YashoTech Fest 2K26",
                description: `${formData.event} Registration`,
                order_id: orderData.orderId,
                handler: async function (response) {
                    // Payment successful - verify on backend
                    try {
                        const verifyResponse = await registrationAPI.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyResponse.data.success) {
                            alert(`🎉 Payment Successful! Registration Confirmed.\n\nAmount Paid: ₹${orderData.amount}`);
                            navigate('/');
                        }
                    } catch (verifyError) {
                        if (process.env.NODE_ENV === 'development') {
                            console.error('Payment verification error:', verifyError);
                        }
                        alert('❌ Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.phone
                },
                notes: {
                    event: formData.event,
                    college: formData.college
                },
                theme: {
                    color: "#135bec" // YashoTech blue brand color
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        setError('Payment cancelled. Please try again.');
                    }
                }
            };

            // Check if Razorpay script is loaded
            if (!window.Razorpay) {
                alert('Payment system not loaded. Please refresh the page.');
                setLoading(false);
                return;
            }

            // Open Razorpay payment modal
            const razorpay = new window.Razorpay(options);
            razorpay.open();

            // Reset loading state when modal opens
            setLoading(false);
        } catch (err) {
            setError('Payment initialization failed. Please try again.');
            if (process.env.NODE_ENV === 'development') {
                console.error('Payment error:', err);
            }
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 0. Name Validation
        if (formData.fullName.trim().length < 2) {
            setError('Full Name must contain at least 2 alphabets.');
            return;
        }

        // 1. Email Validation (Basic Regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        // 2. Phone Validation (Numbers only, exactly 10 digits)
        if (!phoneRegex.test(formData.phone)) {
            setError('Mobile number must be exactly 10 digits (numbers only).');
            return;
        }

        // if (emailExists) {
        //     setError('This email is already registered. Please use a different email.');
        //     return;
        // }


        setLoading(true);
        setError('');

        try {
            // Create registration and get Razorpay order
            const response = await registrationAPI.create(formData);

            if (response.data.success) {
                // Open Razorpay payment modal
                await handlePayment(response.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            setLoading(false);
        }
    };

    // All available events for dropdown
    const allEvents = [
        "Coding Competition", "BGMI Competition",
        "Technical Auction", "Mock Job Interviews", "Technical Treasure Hunt", "Paper Cup Tower Madness",
        "Technical Paper Presentation", "Bridge Making Competition", "Build Your Brain",
        "Technical Quiz Competition", "Robo Race", "Web Design Challenge", "Poster Presentation", "Poster & Model Presentation",
        "Technical Quiz", "Free Fire (E Sport Event)"
    ];

    // Event Icons Mapping
    const eventIcons = {
        "Coding Competition": "< >",
        "BGMI Competition": "⚔️",
        "Technical Auction": "🔨",
        "Mock Job Interviews": "💼",
        "Technical Treasure Hunt": "🗺️",
        "Paper Cup Tower Madness": "🥤",
        "Technical Paper Presentation": "📄",
        "Bridge Making Competition": "🛠️",
        "Build Your Brain": "💡",
        "Technical Quiz Competition": "📝",
        "Robo Race": "🤖",
        "Quiz Competition": "📝",
        "Fix It": "🔧",
        "Web Design Challenge": "🖥️",
        "Poster Presentation": "📊",
        "Technical Quiz": "📝",
        "Poster & Model Presentation": "📊",
        "Free Fire (E Sport Event)": "🎮"
    };

    return (
        <div className="registration-container">
            {/* Left Sidebar - Branding */}
            <div className="reg-sidebar">
                <div className="brand-header">
                    <div className="brand-section">
                        <h3>Yashoda Technical Campus, Satara</h3>
                        <h1 className="brand-title">
                            YASHO<span className="highlight-text">TECH</span><br />
                            FEST <span className="highlight-text">2K26</span>
                        </h1>
                        <p className="brand-tagline">"Think it, Crack it, Lead it."</p>
                    </div>

                    <div className="info-cards">
                        <div className="info-card">
                            <span className="info-icon">🏆</span>
                            <div className="info-content">
                                <h4>Win Exciting Prizes</h4>
                                <p>State Level Technical Competition</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <span className="info-icon">📅</span>
                            <div className="info-content">
                                <h4>24 February 2026</h4>
                                <p>Mark your calendars</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="trophy-container">
                    🏆
                </div>

                <div className="footer-copy">
                    © 2026 Yashoda Shikshan Prasarak Mandal. All Rights Reserved.
                </div>
            </div>

            {/* Right Content - Form */}
            <div className="reg-content">
                <motion.div
                    className="reg-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="form-header">
                        <div>
                            <h2>Student Registration</h2>
                            <p className="form-desc">Fill in your details to participate.</p>
                        </div>
                        <div className="entry-fee-badge">
                            <span className="fee-label">Entry Fee</span>
                            <div className="fee-amount" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1' }}>
                                {isFlatRateEvent ? (
                                    // BGMI and Free Fire: Always ₹200
                                    <>
                                        <span>₹200</span>
                                        <span style={{ fontSize: '0.4em', fontWeight: 'normal', marginTop: '2px' }}>
                                            per team
                                        </span>
                                    </>
                                ) : isDynamicTeamEvent ? (
                                    // Other team events: ₹50 per person
                                    <>
                                        <span>₹{(() => {
                                            // Calculate based on filled teammates
                                            let teamSize = 1; // Team leader
                                            if (formData.teammate2?.trim()) teamSize++;
                                            if (formData.teammate3?.trim()) teamSize++;
                                            if (formData.teammate4?.trim()) teamSize++;
                                            return teamSize * 50;
                                        })()}</span>
                                        <span style={{ fontSize: '0.4em', fontWeight: 'normal', marginTop: '2px' }}>
                                            ₹50 × {(() => {
                                                let count = 1;
                                                if (formData.teammate2?.trim()) count++;
                                                if (formData.teammate3?.trim()) count++;
                                                if (formData.teammate4?.trim()) count++;
                                                return count;
                                            })()} players
                                        </span>
                                    </>
                                ) : (
                                    // Solo events: ₹50
                                    <>
                                        <span>₹50</span>
                                        <span style={{ fontSize: '0.4em', fontWeight: 'normal', marginTop: '2px' }}>
                                            per person
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <form className="reg-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Select Event to Participate</label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    {eventIcons[formData.event] || "🎮"}
                                </span>
                                <select
                                    name="event"
                                    className="form-select"
                                    value={formData.event}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="" disabled>Select your battle</option>
                                    {(allEvents || []).map((ev, idx) => (
                                        <option key={idx} value={ev}>{ev}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {formData.event && (
                            <>
                                <div className="form-group">
                                    <label>Full Name <span style={{ color: 'red' }}>*</span></label>
                                    <div className="input-wrapper">
                                        <span className="input-icon">👤</span>
                                        <input
                                            type="text"
                                            name="fullName"
                                            className="form-input"
                                            placeholder="Full Name"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Email Address <span style={{ color: 'red' }}>*</span></label>
                                        <div className="input-wrapper">
                                            <span className="input-icon">✉️</span>
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-input"
                                                placeholder="you@example.com"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                // onBlur={handleEmailBlur} // Removed
                                                required
                                            />

                                        </div>
                                        {/* {emailExists && (
                                            <p style={{ color: 'red', fontSize: '0.9em', marginTop: '0.5rem' }}>
                                                This email is already registered
                                            </p>
                                        )} */}

                                    </div>
                                    <div className="form-group">
                                        <label>Mobile Number <span style={{ color: 'red' }}>*</span></label>
                                        <div className="input-wrapper">
                                            <span className="input-icon">📞</span>
                                            <input
                                                type="tel"
                                                name="phone"
                                                className="form-input"
                                                placeholder="Mobile Number"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>College Name</label>
                                    <div className="input-wrapper">
                                        <span className="input-icon">🎓</span>
                                        <input
                                            type="text"
                                            name="college"
                                            className="form-input"
                                            placeholder="Enter your college name"
                                            value={formData.college}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Team Members Section - Only for BGMI & Free Fire & Technical Auction & Paper Presentation */}
                                {isTeamEvent && (
                                    <div className="team-section" style={{ marginTop: '1.5rem', marginBottom: '1.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                        <h4 style={{ color: '#1e3a8a', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span>👥</span> Team Details
                                            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>
                                                {isTechnicalAuction
                                                    ? '(Min 2, Max 3 members)'
                                                    : isFourMemberEvent
                                                        ? '(Max 4 members)'
                                                        : isStrictTwoMembers
                                                            ? '(Exactly 2 members required)'
                                                            : isOptionalTwoMembers
                                                                ? '(1 or 2 Members)'
                                                                : '(2 Main Required + 2 Optional)'}
                                            </span>
                                        </h4>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Teammate 2 Name <span style={{ color: ((isFourMemberEvent && !isBgmi && !isFreeFire) || isOptionalTwoMembers) ? '#64748b' : 'red', fontSize: ((isFourMemberEvent && !isBgmi && !isFreeFire) || isOptionalTwoMembers) ? '0.85em' : '1em' }}>{((isFourMemberEvent && !isBgmi && !isFreeFire) || isOptionalTwoMembers) ? '(Optional)' : '*'}</span></label>
                                                <input
                                                    type="text"
                                                    name="teammate2"
                                                    className="form-input"
                                                    placeholder="Player 2 Name"
                                                    value={formData.teammate2}
                                                    onChange={handleInputChange}
                                                    required={isTeamEvent && !isOptionalTwoMembers && (!isFourMemberEvent || isBgmi || isFreeFire)}
                                                />
                                            </div>

                                            {/* Teammate 3: Optional for Tech Auction/Treasure Hunt/BGMI/FF, Hidden for others check */}
                                            {!isStrictTwoMembers && !isOptionalTwoMembers && (
                                                <div className="form-group">
                                                    <label>Teammate 3 Name <span style={{ color: (isTechnicalAuction || isFourMemberEvent) ? '#64748b' : 'red', fontSize: (isTechnicalAuction || isFourMemberEvent) ? '0.85em' : '1em' }}>{(isTechnicalAuction || isFourMemberEvent) ? '(Optional)' : '*'}</span></label>
                                                    <input
                                                        type="text"
                                                        name="teammate3"
                                                        className="form-input"
                                                        placeholder="Player 3 Name"
                                                        value={formData.teammate3}
                                                        onChange={handleInputChange}
                                                        required={isTeamEvent && !isTechnicalAuction && !isFourMemberEvent}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {!isTechnicalAuction && !isStrictTwoMembers && !isOptionalTwoMembers && (
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Teammate 4 Name <span style={{ color: '#64748b', fontSize: '0.85em' }}>(Optional)</span></label>
                                                    <input
                                                        type="text"
                                                        name="teammate4"
                                                        className="form-input"
                                                        placeholder="Player 4 Name"
                                                        value={formData.teammate4}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                {!isFourMemberEvent && (
                                                    <div className="form-group">
                                                        <label>Teammate 5 Name <span style={{ color: '#64748b', fontSize: '0.85em' }}>(Optional)</span></label>
                                                        <input
                                                            type="text"
                                                            name="teammate5"
                                                            className="form-input"
                                                            placeholder="Player 5 Name"
                                                            value={formData.teammate5}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}


                                {/* Error Message */}
                                {error && (
                                    <div style={{
                                        padding: '1rem',
                                        background: '#fee2e2',
                                        border: '1px solid #ef4444',
                                        borderRadius: '8px',
                                        color: '#991b1b',
                                        marginBottom: '1rem'
                                    }}>
                                        ⚠️ {error}
                                    </div>
                                )}

                                <div className="checkbox-group">
                                    <label htmlFor="agree">I agree to the <span style={{ color: '#2563eb', fontWeight: 'bold' }}>rules & regulations</span></label>
                                </div>

                                <button type="submit" className="btn-confirm" disabled={loading}>
                                    {loading ? '⏳ Processing Payment...' : 'CONFIRM REGISTRATION'}
                                </button>
                            </>

                        )}
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default RegistrationPage;
