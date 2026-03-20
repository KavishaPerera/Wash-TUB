import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './SignUp.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                navigate('/verify-code', { state: { email } });
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            setError('Failed to connect to server');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-page">
                <div className="auth-container animate-fadeInUp">
                    <div className="auth-card">
                        <div className="auth-brand">
                            <div className="auth-brand-icon">
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                                </svg>
                            </div>
                            <h2>Forgot Password</h2>
                            <p>Enter your email and we'll send you a reset code</p>
                        </div>

                        {error && (
                            <div className="auth-alert auth-alert-error">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="auth-field">
                                <label htmlFor="email">Email Address</label>
                                <div className="auth-input-wrap">
                                    <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="auth-btn-submit" disabled={isLoading}>
                                {isLoading ? (
                                    <><span className="auth-spinner"></span> Sending...</>
                                ) : (
                                    'Send Reset Code'
                                )}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <Link to="/signin" className="auth-back-link">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                                Back to Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
