import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './SignUp.css';

const API_URL = 'http://localhost:5000/api';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear errors when user types
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            setError('Please fill in all required fields');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    role: 'customer'
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Store token and user info in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                setSuccess('Account created successfully! Redirecting...');
                
                // Redirect to appropriate dashboard after short delay
                setTimeout(() => {
                    navigate(data.redirectPath || '/customer-dashboard');
                }, 1500);
            } else {
                setError(data.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Registration error:', err);
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
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                            </div>
                            <h2>Create Account</h2>
                            <p>Join WashTub for premium laundry service</p>
                        </div>

                        {error && (
                            <div className="auth-alert auth-alert-error">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="auth-alert auth-alert-success">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                <span>{success}</span>
                            </div>
                        )}

                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="auth-form-row">
                                <div className="auth-field">
                                    <label htmlFor="firstName">First Name</label>
                                    <div className="auth-input-wrap">
                                        <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        <input type="text" id="firstName" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="auth-field">
                                    <label htmlFor="lastName">Last Name</label>
                                    <div className="auth-input-wrap">
                                        <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        <input type="text" id="lastName" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="email">Email Address</label>
                                <div className="auth-input-wrap">
                                    <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                    <input type="email" id="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="phone">Phone Number <span className="auth-optional">(optional)</span></label>
                                <div className="auth-input-wrap">
                                    <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                    <input type="tel" id="phone" name="phone" placeholder="07X XXX XXXX" value={formData.phone} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="auth-form-row">
                                <div className="auth-field">
                                    <label htmlFor="password">Password</label>
                                    <div className="auth-input-wrap">
                                        <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                        <input type="password" id="password" name="password" placeholder="Min 6 characters" value={formData.password} onChange={handleChange} required minLength={6} />
                                    </div>
                                </div>
                                <div className="auth-field">
                                    <label htmlFor="confirmPassword">Confirm</label>
                                    <div className="auth-input-wrap">
                                        <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Re-enter password" value={formData.confirmPassword} onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="auth-btn-submit" disabled={loading}>
                                {loading ? (
                                    <><span className="auth-spinner"></span> Creating Account...</>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>

                        <div className="auth-footer">
                            Already have an account? <Link to="/signin">Sign In</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUp;
