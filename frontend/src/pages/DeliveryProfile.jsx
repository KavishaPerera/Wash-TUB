import { useState } from 'react';
import DeliverySidebar from '../components/DeliverySidebar';
import { User, Mail, Phone, MapPin, Shield, Camera, Edit2, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import './DeliveryDashboard.css'; // Reusing the dashboard styles

const DeliveryProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: 'Driver Name',
        email: 'driver@washtub.com',
        phone: '077-1234567',
        address: '123 Main St, Colombo',
    });

    // Change Password state
    const [pwData, setPwData] = useState({ current: '', newPw: '', confirm: '' });
    const [pwShow, setPwShow] = useState({ current: false, newPw: false, confirm: false });
    const [pwLoading, setPwLoading] = useState(false);
    const [pwMsg, setPwMsg] = useState(null); // { type: 'success'|'error', text: '' }

    const token = localStorage.getItem('token');

    const handlePwChange = (e) => setPwData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const toggleShow = (field) => setPwShow(prev => ({ ...prev, [field]: !prev[field] }));

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
            const res = await fetch('http://localhost:5000/api/auth/change-password', {
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        setIsEditing(false);
        // Here you would typically save the data to your backend
        console.log('Profile saved:', profileData);
    };

    return (
        <div className="dashboard">
            <DeliverySidebar activePage="profile" />

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <h1>My Profile</h1>
                    </div>
                    <button
                        className="btn-primary"
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        {isEditing ? 'Save Changes' : <><Edit2 size={16} /> Edit Profile</>}
                    </button>
                </header>

                {/* Profile Identity Card */}
                <div style={{ marginTop: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={36} color="#94a3b8" />
                        </div>
                        {isEditing && (
                            <button style={{ position: 'absolute', bottom: 0, right: 0, background: '#38bdf8', color: 'white', border: 'none', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <Camera size={13} />
                            </button>
                        )}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>{profileData.name}</h2>
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>Delivery Partner</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#475569' }}>
                            <Shield size={14} color="#38bdf8" /> Verified
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
                            { label: 'Full Name',     name: 'name',    type: 'text',  icon: <User  size={15} color="#94a3b8" /> },
                            { label: 'Email Address', name: 'email',   type: 'email', icon: <Mail  size={15} color="#94a3b8" /> },
                            { label: 'Phone Number',  name: 'phone',   type: 'tel',   icon: <Phone size={15} color="#94a3b8" /> },
                            { label: 'Address',       name: 'address', type: 'text',  icon: <MapPin size={15} color="#94a3b8" /> },
                        ].map(({ label, name, type, icon }) => (
                            <div key={name} className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', fontWeight: 500, color: '#64748b' }}>{label}</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', lineHeight: 0 }}>{icon}</span>
                                    <input
                                        type={type}
                                        name={name}
                                        value={profileData[name]}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        style={{ width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.2rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', background: isEditing ? 'white' : '#f8fafc', color: '#0f172a', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Change Password */}
                <div style={{ marginTop: '1.25rem', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Lock size={15} color="#38bdf8" /> Change Password
                    </h3>

                    {pwMsg && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1rem', borderRadius: '8px', marginBottom: '1rem', background: pwMsg.type === 'success' ? '#f0fdf4' : '#fef2f2', color: pwMsg.type === 'success' ? '#16a34a' : '#dc2626', fontSize: '0.85rem', fontWeight: 500 }}>
                            {pwMsg.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                            {pwMsg.text}
                        </div>
                    )}

                    <form onSubmit={handleChangePassword}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                            {[{ label: 'Current Password', field: 'current' }, { label: 'New Password', field: 'newPw' }, { label: 'Confirm Password', field: 'confirm' }].map(({ label, field }) => (
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
            </main>
        </div>
    );
};

export default DeliveryProfile;
