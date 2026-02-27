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
        vehicleType: 'Motorcycle',
        vehicleNumber: 'WP ABC-1234',
        licenseNumber: 'B1234567',
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
            {/* Sidebar */}
            <DeliverySidebar activePage="profile" />

            {/* Main Content */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <h1>My Profile</h1>
                    
                    </div>
                    <button 
                        className={`btn-primary ${isEditing ? 'btn-save' : ''}`}
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        {isEditing ? 'Save Changes' : <><Edit2 size={18} /> Edit Profile</>}
                    </button>
                </header>

                <div className="profile-content" style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                    {/* Left Column - Avatar & Quick Info */}
                    <div className="profile-card" style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                        <div className="avatar-container" style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem' }}>
                            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                <User size={64} color="#94a3b8" />
                            </div>
                            {isEditing && (
                                <button style={{ position: 'absolute', bottom: '0', right: '0', background: '#38bdf8', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                                    <Camera size={18} />
                                </button>
                            )}
                        </div>
                        <h2 style={{ marginBottom: '0.5rem', color: '#0f172a' }}>{profileData.name}</h2>
                        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Delivery Partner</p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569' }}>
                                <Shield size={18} color="#38bdf8" />
                                <span>Verified Partner</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569' }}>
                                <span style={{ background: '#10b981', width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block' }}></span>
                                <span>Currently Online</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details Form */}
                    <div className="profile-details" style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ marginBottom: '1.5rem', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>Personal Information</h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={profileData.name} 
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: isEditing ? 'white' : '#f8fafc', color: '#0f172a' }}
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={profileData.email} 
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: isEditing ? 'white' : '#f8fafc', color: '#0f172a' }}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>Phone Number</label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input 
                                        type="tel" 
                                        name="phone"
                                        value={profileData.phone} 
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: isEditing ? 'white' : '#f8fafc', color: '#0f172a' }}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>Address</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input 
                                        type="text" 
                                        name="address"
                                        value={profileData.address} 
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: isEditing ? 'white' : '#f8fafc', color: '#0f172a' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <h3 style={{ marginBottom: '1.5rem', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>Vehicle & License Details</h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>Vehicle Type</label>
                                <select 
                                    name="vehicleType"
                                    value={profileData.vehicleType} 
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: isEditing ? 'white' : '#f8fafc', color: '#0f172a' }}
                                >
                                    <option value="Motorcycle">Motorcycle</option>
                                    <option value="Car">Car</option>
                                    <option value="Van">Van</option>
                                    <option value="Truck">Truck</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>Vehicle Number</label>
                                <input 
                                    type="text" 
                                    name="vehicleNumber"
                                    value={profileData.vehicleNumber} 
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: isEditing ? 'white' : '#f8fafc', color: '#0f172a' }}
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>License Number</label>
                                <input 
                                    type="text" 
                                    name="licenseNumber"
                                    value={profileData.licenseNumber} 
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: isEditing ? 'white' : '#f8fafc', color: '#0f172a' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Change Password Section ── */}
                <div style={{ marginTop: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Lock size={18} color="#38bdf8" /> Change Password
                    </h3>

                    {/* Alert */}
                    {pwMsg && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.6rem',
                            padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem',
                            background: pwMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
                            color: pwMsg.type === 'success' ? '#16a34a' : '#dc2626',
                            fontSize: '0.9rem', fontWeight: 500,
                        }}>
                            {pwMsg.type === 'success'
                                ? <CheckCircle size={16} />
                                : <AlertCircle size={16} />}
                            {pwMsg.text}
                        </div>
                    )}

                    <form onSubmit={handleChangePassword}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            {[{ label: 'Current Password', field: 'current' }, { label: 'New Password', field: 'newPw' }, { label: 'Confirm New Password', field: 'confirm' }].map(({ label, field }) => (
                                <div key={field} className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontSize: '0.9rem', fontWeight: '500' }}>{label}</label>
                                    <div style={{ position: 'relative' }}>
                                        <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                                        <input
                                            type={pwShow[field] ? 'text' : 'password'}
                                            name={field}
                                            value={pwData[field]}
                                            onChange={handlePwChange}
                                            placeholder={label}
                                            required
                                            style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 2.5rem', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a', boxSizing: 'border-box' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => toggleShow(field)}
                                            style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}
                                        >
                                            {pwShow[field] ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={pwLoading}
                            className="btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Lock size={16} />
                            {pwLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default DeliveryProfile;
