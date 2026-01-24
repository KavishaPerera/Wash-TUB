import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SystemSettings.css';

const SystemSettings = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('pricing');

    const [services, setServices] = useState([
        { id: 1, name: 'Wash & Fold', pricePerKg: 50, pricePerItem: null, minOrder: 3, status: 'active' },
        { id: 2, name: 'Dry Cleaning', pricePerKg: null, pricePerItem: 150, minOrder: 1, status: 'active' },
        { id: 3, name: 'Iron & Press', pricePerKg: null, pricePerItem: 30, minOrder: 5, status: 'active' },
        { id: 4, name: 'Premium Care', pricePerKg: null, pricePerItem: 200, minOrder: 1, status: 'active' },
        { id: 5, name: 'Express Service', pricePerKg: 80, pricePerItem: null, minOrder: 2, status: 'active' },
    ]);

    const [businessSettings, setBusinessSettings] = useState({
        businessName: 'WashTub Laundry',
        email: 'info@washtub.lk',
        phone: '+94 11 234 5678',
        address: '123 Main Street, Colombo 03',
        workingHours: '8:00 AM - 8:00 PM',
        deliveryFee: 100,
        freeDeliveryMinimum: 1000,
        taxRate: 0
    });

    const [editingService, setEditingService] = useState(null);

    const handleLogout = () => {
        navigate('/signin');
    };

    const handleServiceChange = (id, field, value) => {
        setServices(prev => prev.map(service =>
            service.id === id ? { ...service, [field]: value } : service
        ));
    };

    const handleSaveService = (id) => {
        setEditingService(null);
        alert('Service price updated successfully!');
    };

    const handleBusinessSettingChange = (field, value) => {
        setBusinessSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveBusinessSettings = () => {
        alert('Business settings saved successfully!');
    };

    const handleToggleServiceStatus = (id) => {
        setServices(prev => prev.map(service =>
            service.id === id
                ? { ...service, status: service.status === 'active' ? 'inactive' : 'active' }
                : service
        ));
    };

    return (
        <div className="settings-page">
            {/* Sidebar */}
            <aside className="settings-sidebar">
                <div className="sidebar-header">
                    <h2 className="logo">WashTub</h2>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/admin-dashboard" className="nav-item">
                        <span>Overview</span>
                    </Link>
                    <Link to="/user-management" className="nav-item">
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
                    <a href="#" className="nav-item active">
                        <span>System Settings</span>
                    </a>
                </nav>

                <button className="logout-btn" onClick={handleLogout}>
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="settings-main">
                <header className="settings-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h1>System Settings</h1>
                            <p>Manage pricing, services, and business configuration</p>
                        </div>
                    </div>
                </header>

                <div className="settings-content">
                    {/* Settings Tabs */}
                    <div className="settings-tabs">
                        <button
                            className={`settings-tab ${activeTab === 'pricing' ? 'active' : ''}`}
                            onClick={() => setActiveTab('pricing')}
                        >
                            Price List
                        </button>
                        <button
                            className={`settings-tab ${activeTab === 'business' ? 'active' : ''}`}
                            onClick={() => setActiveTab('business')}
                        >
                            Business Info
                        </button>
                        <button
                            className={`settings-tab ${activeTab === 'delivery' ? 'active' : ''}`}
                            onClick={() => setActiveTab('delivery')}
                        >
                            Delivery Settings
                        </button>
                    </div>

                    {/* Pricing Tab */}
                    {activeTab === 'pricing' && (
                        <section className="settings-section">
                            <div className="section-header">
                                <h2>Service Price List</h2>
                                <button className="btn btn-primary" onClick={() => alert('Add new service coming soon!')}>
                                    + Add Service
                                </button>
                            </div>

                            <div className="price-table-container">
                                <table className="price-table">
                                    <thead>
                                        <tr>
                                            <th>Service Name</th>
                                            <th>Price per Kg</th>
                                            <th>Price per Item</th>
                                            <th>Min. Order</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {services.map(service => (
                                            <tr key={service.id}>
                                                <td className="service-name">{service.name}</td>
                                                <td>
                                                    {editingService === service.id ? (
                                                        <input
                                                            type="number"
                                                            value={service.pricePerKg || ''}
                                                            onChange={(e) => handleServiceChange(service.id, 'pricePerKg', e.target.value ? Number(e.target.value) : null)}
                                                            className="price-input"
                                                            placeholder="N/A"
                                                        />
                                                    ) : (
                                                        service.pricePerKg ? `Rs. ${service.pricePerKg}` : '-'
                                                    )}
                                                </td>
                                                <td>
                                                    {editingService === service.id ? (
                                                        <input
                                                            type="number"
                                                            value={service.pricePerItem || ''}
                                                            onChange={(e) => handleServiceChange(service.id, 'pricePerItem', e.target.value ? Number(e.target.value) : null)}
                                                            className="price-input"
                                                            placeholder="N/A"
                                                        />
                                                    ) : (
                                                        service.pricePerItem ? `Rs. ${service.pricePerItem}` : '-'
                                                    )}
                                                </td>
                                                <td>
                                                    {editingService === service.id ? (
                                                        <input
                                                            type="number"
                                                            value={service.minOrder}
                                                            onChange={(e) => handleServiceChange(service.id, 'minOrder', Number(e.target.value))}
                                                            className="price-input min-order-input"
                                                        />
                                                    ) : (
                                                        service.minOrder
                                                    )}
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${service.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                                                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="actions-cell">
                                                    {editingService === service.id ? (
                                                        <>
                                                            <button
                                                                className="btn-action btn-save"
                                                                onClick={() => handleSaveService(service.id)}
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                className="btn-action btn-cancel"
                                                                onClick={() => setEditingService(null)}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                className="btn-action btn-edit"
                                                                onClick={() => setEditingService(service.id)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn-action btn-toggle"
                                                                onClick={() => handleToggleServiceStatus(service.id)}
                                                            >
                                                                {service.status === 'active' ? 'Disable' : 'Enable'}
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* Business Info Tab */}
                    {activeTab === 'business' && (
                        <section className="settings-section">
                            <div className="section-header">
                                <h2>Business Information</h2>
                            </div>

                            <form className="settings-form" onSubmit={(e) => { e.preventDefault(); handleSaveBusinessSettings(); }}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Business Name</label>
                                        <input
                                            type="text"
                                            value={businessSettings.businessName}
                                            onChange={(e) => handleBusinessSettingChange('businessName', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            value={businessSettings.email}
                                            onChange={(e) => handleBusinessSettingChange('email', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="tel"
                                            value={businessSettings.phone}
                                            onChange={(e) => handleBusinessSettingChange('phone', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Working Hours</label>
                                        <input
                                            type="text"
                                            value={businessSettings.workingHours}
                                            onChange={(e) => handleBusinessSettingChange('workingHours', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label>Business Address</label>
                                    <input
                                        type="text"
                                        value={businessSettings.address}
                                        onChange={(e) => handleBusinessSettingChange('address', e.target.value)}
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </section>
                    )}

                    {/* Delivery Settings Tab */}
                    {activeTab === 'delivery' && (
                        <section className="settings-section">
                            <div className="section-header">
                                <h2>Delivery Settings</h2>
                            </div>

                            <form className="settings-form" onSubmit={(e) => { e.preventDefault(); handleSaveBusinessSettings(); }}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Delivery Fee (Rs.)</label>
                                        <input
                                            type="number"
                                            value={businessSettings.deliveryFee}
                                            onChange={(e) => handleBusinessSettingChange('deliveryFee', Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Free Delivery Minimum (Rs.)</label>
                                        <input
                                            type="number"
                                            value={businessSettings.freeDeliveryMinimum}
                                            onChange={(e) => handleBusinessSettingChange('freeDeliveryMinimum', Number(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Tax Rate (%)</label>
                                    <input
                                        type="number"
                                        value={businessSettings.taxRate}
                                        onChange={(e) => handleBusinessSettingChange('taxRate', Number(e.target.value))}
                                        min="0"
                                        max="100"
                                        step="0.1"
                                    />
                                </div>

                                <div className="info-box">
                                    <p><strong>Note:</strong> Free delivery will be applied to orders above Rs. {businessSettings.freeDeliveryMinimum.toLocaleString()}</p>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SystemSettings;
