import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './SignUp.css'; // Reusing SignUp styles for consistency

const API_URL = 'http://localhost:5000/api';

const SignIn = () => {
    const navigate = useNavigate();
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

                // Navigate to the appropriate dashboard based on role
                navigate(data.redirectPath || '/customer-dashboard');
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
            <div className="signup-page">
                <div className="signup-container animate-fadeInUp">
                    <div className="signup-card">
                        <div className="signup-header">
                            <h2>Welcome Back</h2>
                            <p>Sign in to continue managing your laundry</p>
                        </div>

                        {error && (
                            <div className="alert alert-error">
                                <span className="alert-icon">⚠️</span>
                                {error}
                            </div>
                        )}

                        <form className="signup-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input 
                                        type="checkbox" 
                                        style={{ width: 'auto' }} 
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    /> Remember me
                                </label>
                                <a href="#" style={{ color: 'var(--color-primary-light)', fontSize: '0.9rem', textDecoration: 'none' }}>Forgot Password?</a>
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-primary" 
                                style={{ marginTop: '0.5rem', width: '100%' }}
                                disabled={loading}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="signup-footer">
                            Don't have an account? <Link to="/signup">Sign Up</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignIn;
