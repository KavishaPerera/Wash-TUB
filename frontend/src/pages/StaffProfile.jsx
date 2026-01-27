import { useState } from 'react';
import StaffSidebar from '../components/StaffSidebar';
import './StaffDashboard.css';
import './StaffProfile.css';

const StaffProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: 'Staff',
        lastName: 'Member',
        email: 'staff@washtub.com',
        phone: '+94 77 123 4567',
        role: 'Staff Member',
        id: 'STF-2026-001'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        setIsEditing(false);
        // Add save logic here
        alert('Profile updated successfully!');
    };

    return (
        <div className="dashboard">
            <StaffSidebar activePage="profile" />

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <div>
                            <h1>My Profile</h1>
                            <p>Manage your account settings</p>
                        </div>
                    </div>
                </header>

                <div className="staff-profile-container">
                    {/* Identity Section */}
                    <div className="profile-section">
                        <div className="staff-avatar-wrapper">
                            <div className="staff-avatar">
                                {profileData.firstName[0]}{profileData.lastName[0]}
                            </div>
                            <div className="staff-info">
                                <h3>{profileData.firstName} {profileData.lastName}</h3>
                                <p>{profileData.id}</p>
                                <span className="staff-role-badge">{profileData.role}</span>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>Personal Information</h2>
                            {!isEditing ? (
                                <button className="btn btn-secondary btn-small" onClick={() => setIsEditing(true)}>
                                    Edit Details
                                </button>
                            ) : (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-secondary btn-small" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </button>
                                    <button className="btn btn-primary btn-small" onClick={handleSave}>
                                        Save
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="form-row">
                            <div className="profile-form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={profileData.firstName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="profile-form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={profileData.lastName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="profile-form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profileData.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="profile-form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Security Section (Placeholder) */}
                    <div className="profile-section">
                        <div className="section-header">
                            <h2>Security</h2>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Password</h4>
                                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Last changed 30 days ago</p>
                            </div>
                            <button className="btn btn-secondary btn-small">Change Password</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StaffProfile;
