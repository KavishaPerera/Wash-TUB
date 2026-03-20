import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './SignUp.css';

const SetNewPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword: formData.newPassword })
            });

            const data = await response.json();

            if (data.success) {
                navigate('/signin');
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError('Failed to connect to server');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const EyeOpen = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );

    const EyeOff = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );

    if (!email) {
        return (
            <>
                <Navbar />
                <div className="auth-page">
                    <div className="auth-container animate-fadeInUp">
                        <div className="auth-card">
                            <div className="auth-brand">
                                <h2>Session Expired</h2>
                                <p>Please start the password reset process again.</p>
                            </div>
                            <div className="auth-footer">
                                <Link to="/forgot-password" className="auth-btn-submit" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    Go to Forgot Password
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="auth-page">
                <div className="auth-container animate-fadeInUp">
                    <div className="auth-card">
                        <div className="auth-brand">
                            <div className="auth-brand-icon">
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                            </div>
                            <h2>Set New Password</h2>
                            <p>Must be at least 6 characters and different from your previous password</p>
                        </div>

                        {error && (
                            <div className="auth-alert auth-alert-error">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="auth-field">
                                <label htmlFor="newPassword">New Password</label>
                                <div className="auth-input-wrap">
                                    <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        id="newPassword"
                                        name="newPassword"
                                        placeholder="Enter new password"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        style={{ paddingRight: '2.75rem' }}
                                        required
                                    />
                                    <button type="button" className="auth-eye-btn" onClick={() => setShowNewPassword(!showNewPassword)}>
                                        {showNewPassword ? <EyeOff /> : <EyeOpen />}
                                    </button>
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className="auth-input-wrap">
                                    <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="Confirm new password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        style={{ paddingRight: '2.75rem' }}
                                        required
                                    />
                                    <button type="button" className="auth-eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? <EyeOff /> : <EyeOpen />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="auth-btn-submit" disabled={isLoading}>
                                {isLoading ? (
                                    <><span className="auth-spinner"></span> Resetting Password...</>
                                ) : (
                                    'Reset Password'
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

export default SetNewPassword;
