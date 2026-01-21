import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './SignUp.css'; // Reusing SignUp styles for consistency

const SignIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        role: 'customer',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Sign in submitted:', formData);

        // Navigate based on role
        if (formData.role === 'customer') {
            navigate('/customer-dashboard');
        } else if (formData.role === 'staff') {
            navigate('/staff-dashboard');
        } else if (formData.role === 'owner') {
            navigate('/admin-dashboard');
        } else if (formData.role === 'delivery_person') {
            navigate('/delivery-dashboard');
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

                            <div className="form-group">
                                <label htmlFor="role">Role</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="customer">Customer</option>
                                    <option value="staff">Staff</option>
                                    <option value="owner">Owner</option>
                                    <option value="delivery_person">Delivery Person</option>
                                </select>
                            </div>

                            <div className="form-group" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="checkbox" style={{ width: 'auto' }} /> Remember me
                                </label>
                                <a href="#" style={{ color: 'var(--color-primary-light)', fontSize: '0.9rem', textDecoration: 'none' }}>Forgot Password?</a>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>
                                Sign In
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
