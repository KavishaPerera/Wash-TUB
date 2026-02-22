import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AddUser.css';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:5000/api';

const AddUser = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'customer',
        address: '',
        city: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.role) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Fields',
                text: 'Please fill in all required fields.',
                confirmButtonColor: '#0ea5e9',
            });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Password Mismatch',
                text: 'The passwords you entered do not match. Please try again.',
                confirmButtonColor: '#0ea5e9',
            });
            return;
        }

        if (formData.password.length < 6) {
            Swal.fire({
                icon: 'warning',
                title: 'Weak Password',
                text: 'Password must be at least 6 characters.',
                confirmButtonColor: '#0ea5e9',
            });
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const fullAddress = [formData.address, formData.city].filter(Boolean).join(', ');

            const response = await fetch(`${API_URL}/admin/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone || undefined,
                    address: fullAddress || undefined,
                    role: formData.role,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Account Created!',
                    html: `
                        <p style="margin-bottom:8px">The account has been created successfully.</p>
                        <p style="font-size:0.9rem;color:#475569">
                            Login credentials have been <strong>emailed to</strong><br/>
                            <span style="color:#0ea5e9;font-weight:600">${formData.email}</span>
                        </p>`,
                    confirmButtonColor: '#0ea5e9',
                    confirmButtonText: 'Go to User Management',
                });
                navigate('/user-management');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Create User',
                    text: data.message || 'An unexpected error occurred.',
                    confirmButtonColor: '#0ea5e9',
                });
            }
        } catch (err) {
            console.error('Create user error:', err);
            Swal.fire({
                icon: 'error',
                title: 'Connection Error',
                text: 'Unable to reach the server. Please make sure the backend is running.',
                confirmButtonColor: '#0ea5e9',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/user-management');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/signin');
    };

    return (
        <div className="add-user-page">
            {/* Sidebar */}
            <aside className="add-user-sidebar">
                <div className="sidebar-header">
                    <h2 className="logo">WashTub</h2>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/admin-dashboard" className="nav-item">
                        <span>Overview</span>
                    </Link>
                    <Link to="/user-management" className="nav-item active">
                        <span>User Management</span>
                    </Link>
                    <Link to="/all-orders" className="nav-item">
                        <span>All Orders</span>
                    </Link>
                    <Link to="/payment" className="nav-item">
                        <span>Payment</span>
                    </Link>
                    <Link to="/generate-report" className="nav-item">
                        <span>Generate Reports</span>
                    </Link>
                    <Link to="/system-settings" className="nav-item">
                        <span>System Settings</span>
                    </Link>
                </nav>

                <button className="logout-btn" onClick={handleLogout}>
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="add-user-main">
                <header className="add-user-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h1>Add New User</h1>
                            <p>Create an account and email credentials to the user</p>
                        </div>
                    </div>
                </header>

                <div className="add-user-content">
                    <form onSubmit={handleSubmit} className="add-user-form">
                        {/* Personal Information */}
                        <section className="form-section">
                            <h2>Personal Information</h2>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name *</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="Enter first name"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name *</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Enter last name"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="email">Email Address *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter email address"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Account Settings */}
                        <section className="form-section">
                            <h2>Account Settings</h2>

                            <div className="form-group">
                                <label htmlFor="role">User Role *</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                >
                                    <option value="customer">Customer</option>
                                    <option value="staff">Staff</option>
                                    <option value="delivery">Delivery Personnel</option>
                                    <option value="owner">Admin</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="password">Password *</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter password (min. 6 characters)"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password *</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm password"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Address Information */}
                        <section className="form-section">
                            <h2>Address Information (Optional)</h2>

                            <div className="form-group">
                                <label htmlFor="address">Street Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter street address"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Enter city"
                                    disabled={loading}
                                />
                            </div>
                        </section>

                        {/* Form Actions */}
                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create User & Send Credentials'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AddUser;
