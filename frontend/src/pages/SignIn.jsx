import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './SignUp.css'; // Reusing SignUp styles for consistency

const API_URL = 'http://localhost:5000/api';

const SignIn = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectPath = searchParams.get('redirect');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError('Please enter your email and password');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Store token and user info
                const storage = rememberMe ? localStorage : sessionStorage;
                storage.setItem('token', data.token);
                storage.setItem('user', JSON.stringify(data.user));

                // Also set in localStorage for persistence check
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // If there's a redirect param (e.g. from checkout), go there;
                // otherwise navigate to the appropriate dashboard based on role
                if (redirectPath && data.user?.role === 'customer') {
                    navigate(redirectPath);
                } else {
                    navigate(data.redirectPath || '/customer-dashboard');
                }
            } else {
                setError(data.message || 'Invalid email or password');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Unable to connect to server. Please check if the server is running.');
        } finally {
            setLoading(false);
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
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            </div>
                            <h2>Welcome Back</h2>
                            <p>Sign in to manage your laundry</p>
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
                                    <input type="email" id="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="password">Password</label>
                                <div className="auth-input-wrap">
                                    <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                    <input type="password" id="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="auth-options">
                                <label className="auth-remember">
                                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                                    <span className="auth-checkbox-custom"></span>
                                    Remember me
                                </label>
                                <Link to="/forgot-password" className="auth-forgot-link">Forgot Password?</Link>
                            </div>

                            <button type="submit" className="auth-btn-submit" disabled={loading}>
                                {loading ? (
                                    <><span className="auth-spinner"></span> Signing In...</>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="auth-footer">
                            Don't have an account? <Link to="/signup">Sign Up</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignIn;
