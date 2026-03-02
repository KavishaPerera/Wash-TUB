import { useState, useEffect } from 'react';
import StaffSidebar from '../components/StaffSidebar';
import { Eye, EyeOff, Edit2, CheckCircle, AlertCircle, Loader, Lock } from 'lucide-react';
import './StaffDashboard.css';
import './StaffProfile.css';

const API = 'http://localhost:5000/api';

const StaffProfile = () => {
    const [isEditing, setIsEditing]     = useState(false);
    const [loading, setLoading]         = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [profileMsg, setProfileMsg]   = useState(null); // { type: 'success'|'error', text }

    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName:  '',
        email:     '',
        phone:     '',
        address:   '',
    });
    const [original, setOriginal] = useState(null);

    // Change Password
    const [pwData, setPwData]       = useState({ current: '', newPw: '', confirm: '' });
    const [pwShow, setPwShow]       = useState({ current: false, newPw: false, confirm: false });
    const [pwLoading, setPwLoading] = useState(false);
    const [pwMsg, setPwMsg]         = useState(null);

    const token = localStorage.getItem('token');

    // ── Fetch profile on mount ──────────────────────────────────
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Failed to load profile');
                const data = await res.json();
                const u = data.user;
                const filled = {
                    firstName: u.firstName || '',
                    lastName:  u.lastName  || '',
                    email:     u.email     || '',
                    phone:     u.phone     || '',
                    address:   u.address   || '',
                };
                setProfileData(filled);
                setOriginal(filled);
            } catch {
                setProfileMsg({ type: 'error', text: 'Could not load profile. Please refresh.' });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleCancelEdit = () => {
        setProfileData(original);
        setIsEditing(false);
        setProfileMsg(null);
    };

    // ── Save profile ─────────────────────────────────────────────
    const handleSave = async () => {
        setProfileMsg(null);
        if (!profileData.firstName.trim() || !profileData.lastName.trim()) {
            setProfileMsg({ type: 'error', text: 'First name and last name are required.' });
            return;
        }
        setSaveLoading(true);
        try {
            const res = await fetch(`${API}/auth/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    firstName: profileData.firstName.trim(),
                    lastName:  profileData.lastName.trim(),
                    phone:     profileData.phone.trim(),
                    address:   profileData.address.trim(),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to save');

            const updated = {
                firstName: data.user.firstName,
                lastName:  data.user.lastName,
                email:     data.user.email,
                phone:     data.user.phone   || '',
                address:   data.user.address || '',
            };
            setProfileData(updated);
            setOriginal(updated);

            // Keep localStorage in sync
            try {
                const stored = JSON.parse(localStorage.getItem('user') || '{}');
                stored.first_name = data.user.firstName;
                stored.last_name  = data.user.lastName;
                localStorage.setItem('user', JSON.stringify(stored));
            } catch (_) {}

            setIsEditing(false);
            setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setProfileMsg({ type: 'error', text: err.message });
        } finally {
            setSaveLoading(false);
        }
    };

    // ── Change password ──────────────────────────────────────────
    const handlePwChange = (e) => setPwData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const toggleShow     = (field) => setPwShow(prev => ({ ...prev, [field]: !prev[field] }));

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPwMsg(null);
        if (pwData.newPw !== pwData.confirm) {
            setPwMsg({ type: 'error', text: 'New passwords do not match.' });
            return;
        }
        if (pwData.newPw.length < 6) {
            setPwMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
            return;
        }
        setPwLoading(true);
        try {
            const res = await fetch(`${API}/auth/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ currentPassword: pwData.current, newPassword: pwData.newPw }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to change password');
            setPwMsg({ type: 'success', text: 'Password changed successfully!' });
            setPwData({ current: '', newPw: '', confirm: '' });
        } catch (err) {
            setPwMsg({ type: 'error', text: err.message });
        } finally {
            setPwLoading(false);
        }
    };

    const initials = profileData.firstName && profileData.lastName
        ? `${profileData.firstName[0]}${profileData.lastName[0]}`.toUpperCase()
        : '?';

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
                    {!loading && (
                        <div style={{ display: 'flex', gap: '0.6rem' }}>
                            {isEditing && (
                                <button
                                    className="btn btn-secondary btn-small"
                                    onClick={handleCancelEdit}
                                    style={{ padding: '0.5rem 1rem' }}
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                className="btn btn-primary btn-small"
                                onClick={isEditing ? handleSave : () => { setIsEditing(true); setProfileMsg(null); }}
                                disabled={saveLoading}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem' }}
                            >
                                {saveLoading
                                    ? <><Loader size={14} /> Saving...</>
                                    : isEditing
                                        ? <><CheckCircle size={14} /> Save Changes</>
                                        : <><Edit2 size={14} /> Edit Profile</>}
                            </button>
                        </div>
                    )}
                </header>

                {/* Alert banner */}
                {profileMsg && (
                    <div style={{ margin: '1rem 0 0', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1rem', borderRadius: '8px', background: profileMsg.type === 'success' ? '#f0fdf4' : '#fef2f2', color: profileMsg.type === 'success' ? '#16a34a' : '#dc2626', fontSize: '0.88rem', fontWeight: 500 }}>
                        {profileMsg.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                        {profileMsg.text}
                    </div>
                )}

                {loading ? (
                    <div style={{ marginTop: '4rem', textAlign: 'center', color: '#64748b' }}>
                        <Loader size={32} color="#6366f1" style={{ marginBottom: '0.75rem' }} />
                        <p>Loading profile...</p>
                    </div>
                ) : (
                    <div className="staff-profile-container">
                        {/* Identity Section */}
                        <div className="profile-section">
                            <div className="staff-avatar-wrapper">
                                <div className="staff-avatar">{initials}</div>
                                <div className="staff-info">
                                    <h3>{profileData.firstName} {profileData.lastName}</h3>
                                    <p>{profileData.email}</p>
                                    <span className="staff-role-badge">Staff Member</span>
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="profile-section">
                            <div className="section-header">
                                <h2>Personal Information</h2>
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
                                    <label>Email Address <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400 }}>(cannot be changed)</span></label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileData.email}
                                        disabled
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

                            <div className="form-row">
                                <div className="profile-form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={profileData.address}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Change Password */}
                        <div className="profile-section">
                            <div className="section-header">
                                <h2>Change Password</h2>
                            </div>

                            {pwMsg && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1rem', borderRadius: '8px', marginBottom: '1rem', background: pwMsg.type === 'success' ? '#f0fdf4' : '#fef2f2', color: pwMsg.type === 'success' ? '#16a34a' : '#dc2626', fontSize: '0.88rem', fontWeight: 500 }}>
                                    {pwMsg.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                    {pwMsg.text}
                                </div>
                            )}

                            <form onSubmit={handleChangePassword}>
                                <div className="form-row">
                                    {[
                                        { label: 'Current Password', field: 'current' },
                                        { label: 'New Password',     field: 'newPw'   },
                                        { label: 'Confirm Password', field: 'confirm' },
                                    ].map(({ label, field }) => (
                                        <div key={field} className="profile-form-group">
                                            <label>{label}</label>
                                            <div style={{ position: 'relative' }}>
                                                <Lock size={14} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                                <input
                                                    type={pwShow[field] ? 'text' : 'password'}
                                                    name={field}
                                                    value={pwData[field]}
                                                    onChange={handlePwChange}
                                                    placeholder={label}
                                                    required
                                                    style={{ paddingLeft: '2.2rem', paddingRight: '2.2rem', width: '100%', boxSizing: 'border-box' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => toggleShow(field)}
                                                    style={{ position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, lineHeight: 0 }}
                                                >
                                                    {pwShow[field] ? <EyeOff size={14} /> : <Eye size={14} />}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="submit"
                                    disabled={pwLoading}
                                    className="btn btn-primary btn-small"
                                    style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                >
                                    <Lock size={14} />
                                    {pwLoading ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StaffProfile;
