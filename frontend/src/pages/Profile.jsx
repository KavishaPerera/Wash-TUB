import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css'; // Use shared dashboard styles
import './Profile.css'; // Additional profile-specific styles

const Profile = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: 'Amandi',
        lastName: 'Perera',
        email: 'amandi.perera@email.com',
        phone: '+94 77 123 4567',
        address: '123 Galle Road, Colombo 03',
        city: 'Colombo',
        postalCode: '00300'
    });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        // Save profile logic here
        console.log('Profile saved:', profileData);
        setIsEditing(false);
        alert('Profile updated successfully!');
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        // Change password logic here
        console.log('Password changed');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        alert('Password changed successfully!');
    };

    const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); sessionStorage.removeItem('token'); sessionStorage.removeItem('user'); navigate('/signin'); };

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h2 className="logo">WashTub</h2>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/customer-dashboard" className="nav-item">
                        <span>Overview</span>
                    </Link>
                    <Link to="/my-orders" className="nav-item">
                        <span>My Orders</span>
                    </Link>
                    <Link to="/new-order" className="nav-item">
                        <span>New Order</span>
                    </Link>
                    <a href="#" className="nav-item active">
                        <span>Profile</span>
                    </a>
                    <Link to="/notifications" className="nav-item">
                        <span>Notifications</span>
                    </Link>
                </nav>

                <button className="logout-btn" onClick={handleLogout}>
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h1>My Profile</h1>
                            <p>Manage your account settings and preferences</p>
                        </div>
                    </div>
                </header>

                <div className="profile-content">
                    {/* Profile Card */}
                    <section className="profile-card">
                        <div className="profile-avatar-section">
                            <div className="avatar">
                                <span className="avatar-text">
                                    {profileData.firstName[0]}{profileData.lastName[0]}
                                </span>
                            </div>
                            <div className="avatar-info">
                                <h2>{profileData.firstName} {profileData.lastName}</h2>
                                <p>Customer since January 2026</p>
                                <button className="btn btn-secondary btn-small">
                                    Change Photo
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Personal Information */}
                    <section className="form-section">
                        <div className="section-header">
                            <h2>Personal Information</h2>
                            {!isEditing && (
                                <button
                                    className="btn btn-secondary btn-small"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSaveProfile}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={profileData.firstName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={profileData.lastName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={profileData.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={profileData.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={profileData.address}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="city">City</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={profileData.city}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="postalCode">Postal Code</label>
                                    <input
                                        type="text"
                                        id="postalCode"
                                        name="postalCode"
                                        value={profileData.postalCode}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </form>
                    </section>

                    {/* Change Password */}
                    <section className="form-section">
                        <div className="section-header">
                            <h2>Change Password</h2>
                        </div>

                        <form onSubmit={handleChangePassword}>
                            <div className="form-group">
                                <label htmlFor="currentPassword">Current Password</label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={passwords.currentPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="newPassword">New Password</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        value={passwords.newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm New Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={passwords.confirmPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </section>

                </div>
            </main>
        </div>
    );
};

export default Profile;
