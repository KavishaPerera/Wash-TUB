import { useState, useEffect } from 'react';
import DeliverySidebar from '../components/DeliverySidebar';
import { User, Mail, Phone, MapPin, Shield, Edit2, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import './DeliveryDashboard.css';

const API = 'http://localhost:5000/api';

const DeliveryProfile = () => {
    const [isEditing, setIsEditing]   = useState(false);
    const [loading, setLoading]       = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [profileMsg, setProfileMsg] = useState(null); // { type, text }

    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName:  '',
        email:     '',
        phone:     '',
        address:   '',
    });
    // Keep original to restore on cancel
    const [original, setOriginal] = useState(null);

    // Change Password state
    const [pwData, setPwData]     = useState({ current: '', newPw: '', confirm: '' });
    const [pwShow, setPwShow]     = useState({ current: false, newPw: false, confirm: false });
    const [pwLoading, setPwLoading] = useState(false);
    const [pwMsg, setPwMsg]       = useState(null);

    const token = localStorage.getItem('token');

    // â”€â”€ Fetch profile on mount â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
                    firstName: u.firstName  || '',
                    lastName:  u.lastName   || '',
                    email:     u.email      || '',
                    phone:     u.phone      || '',
                    address:   u.address    || '',
                };
                setProfileData(filled);
                setOriginal(filled);
            } catch (err) {
                setProfileMsg({ type: 'error', text: 'Could not load profile. Please refresh.' });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleCancelEdit = () => {
        setProfileData(original);
        setIsEditing(false);
        setProfileMsg(null);
    };

    // â”€â”€ Save profile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
                phone:     data.user.phone     || '',
                address:   data.user.address   || '',
            };
            setProfileData(updated);
            setOriginal(updated);

            // Keep localStorage in sync so dashboard header stays current
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

    // â”€â”€ Change password â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const handlePwChange  = (e) => setPwData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const toggleShow      = (field) => setPwShow(prev => ({ ...prev, [field]: !prev[field] }));

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

    const fullName = `${profileData.firstName} ${profileData.lastName}`.trim() || 'Delivery Partner';

    return (
        <div className="dashboard">
            <DeliverySidebar activePage="profile" />

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <h1>My Profile</h1>
                    </div>
                    {!loading && (
                        <div style={{ display: 'flex', gap: '0.6rem' }}>
                            {isEditing && (
                                <button
                                    onClick={handleCancelEdit}
                                    style={{ padding: '0.55rem 1.1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer', fontSize: '0.88rem' }}
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                className="btn-primary"
                                onClick={isEditing ? handleSave : () => { setIsEditing(true); setProfileMsg(null); }}
                                disabled={saveLoading}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                {saveLoading
                                    ? <><Loader size={15} className="spin" /> Saving...</>
                                    : isEditing
                                        ? <><CheckCircle size={15} /> Save Changes</>
                                        : <><Edit2 size={15} /> Edit Profile</>}
                            </button>
                        </div>
                    )}
                </header>

                {/* Profile alert */}
                {profileMsg && (
                    <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1rem', borderRadius: '8px', background: profileMsg.type === 'success' ? '#f0fdf4' : '#fef2f2', color: profileMsg.type === 'success' ? '#16a34a' : '#dc2626', fontSize: '0.88rem', fontWeight: 500 }}>
                        {profileMsg.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                        {profileMsg.text}
                    </div>
                )}

                {loading ? (
                    <div style={{ marginTop: '4rem', textAlign: 'center', color: '#64748b' }}>
                        <Loader size={32} color="#38bdf8" style={{ marginBottom: '0.75rem' }} />
                        <p>Loading profile...</p>
                    </div>
                ) : (
                    <>
                        {/* Identity Card */}
                        <div style={{ marginTop: '1.25rem', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <User size={34} color="#38bdf8" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#0f172a' }}>{fullName}</h2>
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.83rem', color: '#64748b' }}>{profileData.email}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#475569' }}>
                                    <Shield size={13} color="#38bdf8" /> Verified
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#10b981' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} /> Online
                                </span>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div style={{ marginTop: '1.25rem', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '1.5rem' }}>
                            <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                                Personal Information
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {[
                                    { label: 'First Name',    name: 'firstName', type: 'text',  icon: <User  size={15} color="#94a3b8" />, disabled: false },
                                    { label: 'Last Name',     name: 'lastName',  type: 'text',  icon: <User  size={15} color="#94a3b8" />, disabled: false },
                                    { label: 'Email Address', name: 'email',     type: 'email', icon: <Mail  size={15} color="#94a3b8" />, disabled: true },
                                    { label: 'Phone Number',  name: 'phone',     type: 'tel',   icon: <Phone size={15} color="#94a3b8" />, disabled: false },
                                    { label: 'Address',       name: 'address',   type: 'text',  icon: <MapPin size={15} color="#94a3b8" />, disabled: false },
                                ].map(({ label, name, type, icon, disabled }) => (
                                    <div key={name} className="form-group">
                                        <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', fontWeight: 500, color: '#64748b' }}>
                                            {label}
                                            {disabled && <span style={{ marginLeft: '0.4rem', fontSize: '0.75rem', color: '#94a3b8' }}>(cannot be changed)</span>}
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', lineHeight: 0 }}>{icon}</span>
                                            <input
                                                type={type}
                                                name={name}
                                                value={profileData[name]}
                                                onChange={handleInputChange}
                                                disabled={!isEditing || disabled}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.6rem 0.75rem 0.6rem 2.2rem',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '8px',
                                                    fontSize: '0.88rem',
                                                    background: (isEditing && !disabled) ? 'white' : '#f8fafc',
                                                    color: disabled ? '#94a3b8' : '#0f172a',
                                                    boxSizing: 'border-box',
                                                    outline: 'none',
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Change Password */}
                        <div style={{ marginTop: '1.25rem', marginBottom: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '1.5rem' }}>
                            <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Lock size={15} color="#38bdf8" /> Change Password
                            </h3>

                            {pwMsg && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1rem', borderRadius: '8px', marginBottom: '1rem', background: pwMsg.type === 'success' ? '#f0fdf4' : '#fef2f2', color: pwMsg.type === 'success' ? '#16a34a' : '#dc2626', fontSize: '0.85rem', fontWeight: 500 }}>
                                    {pwMsg.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                    {pwMsg.text}
                                </div>
                            )}

                            <form onSubmit={handleChangePassword}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                                    {[
                                        { label: 'Current Password', field: 'current' },
                                        { label: 'New Password',     field: 'newPw'   },
                                        { label: 'Confirm Password', field: 'confirm' },
                                    ].map(({ label, field }) => (
                                        <div key={field} className="form-group">
                                            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', fontWeight: 500, color: '#64748b' }}>{label}</label>
                                            <div style={{ position: 'relative' }}>
                                                <Lock size={14} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                                                <input
                                                    type={pwShow[field] ? 'text' : 'password'}
                                                    name={field}
                                                    value={pwData[field]}
                                                    onChange={handlePwChange}
                                                    placeholder={label}
                                                    required
                                                    style={{ width: '100%', padding: '0.6rem 2.2rem 0.6rem 2.2rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', color: '#0f172a', boxSizing: 'border-box' }}
                                                />
                                                <button type="button" onClick={() => toggleShow(field)} style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, lineHeight: 0 }}>
                                                    {pwShow[field] ? <EyeOff size={14} /> : <Eye size={14} />}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button type="submit" disabled={pwLoading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Lock size={14} />
                                    {pwLoading ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default DeliveryProfile;
