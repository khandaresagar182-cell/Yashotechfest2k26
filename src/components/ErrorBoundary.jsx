import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log error in development only
        if (process.env.NODE_ENV === 'development') {
            console.error('Error caught by boundary:', error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-container">
                        <div className="error-header">
                            <h1 className="error-title">YashoTech Fest 2K26</h1>
                            <p className="error-subtitle">Yashoda Technical Campus, Satara</p>
                        </div>

                        <div className="error-content">
                            <div className="error-icon-box">
                                <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                            </div>

                            <h2>Technical Difficulty</h2>
                            <p className="error-message">
                                We're experiencing a temporary technical issue. Our team has been notified and is working to resolve this.
                            </p>

                            <div className="error-suggestions">
                                <p className="suggestion-title">You can try:</p>
                                <ul>
                                    <li>Refreshing this page</li>
                                    <li>Returning to the homepage</li>
                                    <li>Clearing your browser cache</li>
                                </ul>
                            </div>
                        </div>

                        <div className="error-actions">
                            <button
                                className="error-btn primary"
                                onClick={() => window.location.reload()}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="23 4 23 10 17 10"></polyline>
                                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                                </svg>
                                Refresh Page
                            </button>
                            <button
                                className="error-btn secondary"
                                onClick={() => window.location.href = '/'}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                                Go to Homepage
                            </button>
                        </div>

                        <p className="error-footer">
                            If this issue persists, please contact technical support.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
