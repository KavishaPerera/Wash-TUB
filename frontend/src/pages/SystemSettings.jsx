import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';
import './SystemSettings.css';

const SystemSettings = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('pricing');

    // Pricing State
    const [prices, setPrices] = useState([
        { id: 1, service: 'Wash & Fold', price: '150.00', unit: 'per kg', minOrder: '2 kg', status: 'active' },
        { id: 2, service: 'Dry Cleaning', price: '450.00', unit: 'per item', minOrder: '1 item', status: 'active' },
        { id: 3, service: 'Ironing', price: '80.00', unit: 'per item', minOrder: '5 items', status: 'active' },
        { id: 4, service: 'Curtain Cleaning', price: '350.00', unit: 'per kg', minOrder: '3 kg', status: 'inactive' },
        { id: 5, service: 'Carpet Cleaning', price: '250.00', unit: 'per sqft', minOrder: '50 sqft', status: 'active' },
    ]);

    // Business Info State
    const [businessInfo, setBusinessInfo] = useState({
        name: 'WashTub Laundry',
        address: '123, Laundry Avenue, Colombo 03',
        phone: '+94 11 234 5678',
        email: 'info@washtub.com',
        website: 'www.washtub.com',
        taxRate: '15',
        currency: 'LKR'
    });

    // Delivery Settings State
    const [deliverySettings, setDeliverySettings] = useState({
        standardFee: '350.00',
        freeDeliveryThreshold: '5000.00',
        maxDistance: '15',
        expressFee: '750.00',
        pickupStart: '08:00',
        pickupEnd: '18:00'
    });

    const handleLogout = () => {
        navigate('/signin');
    };

    const handlePriceChange = (id, field, value) => {
        setPrices(prices.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleInfoChange = (e) => {
        setBusinessInfo({ ...businessInfo, [e.target.name]: e.target.value });
    };

    const handleDeliveryChange = (e) => {
        setDeliverySettings({ ...deliverySettings, [e.target.name]: e.target.value });
    };

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
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
                    <Link to="/service-management" className="nav-item">
                        <span>Service Management</span>
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
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h1>System Settings</h1>
                            <p>Manage pricing, business info, and delivery parameters</p>
                        </div>
                    </div>
                </header>

                <div className="dashboard-content">
                    {/* Tabs */}
                    <div className="settings-tabs">
                        <button
                            className={`settings-tab ${activeTab === 'pricing' ? 'active' : ''}`}
                            onClick={() => setActiveTab('pricing')}
                        >
                            💰 Service Pricing
                        </button>
                        <button
                            className={`settings-tab ${activeTab === 'business' ? 'active' : ''}`}
                            onClick={() => setActiveTab('business')}
                        >
                            🏢 Business Info
                        </button>
                        <button
                            className={`settings-tab ${activeTab === 'delivery' ? 'active' : ''}`}
                            onClick={() => setActiveTab('delivery')}
                        >
                            🚚 Delivery Settings
                        </button>
                    </div>

                    {/* Pricing Tab */}
                    {activeTab === 'pricing' && (
                        <section className="dashboard-table-section" style={{ padding: '2rem' }}>
                            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h2>Manage Service Prices</h2>
                                <button className="btn btn-primary btn-small">+ Add Service</button>
                            </div>

                            <div className="table-container">
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Service Name</th>
                                            <th>Price (LKR)</th>
                                            <th>Unit</th>
                                            <th>Min Order</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {prices.map(item => (
                                            <tr key={item.id}>
                                                <td className="service-name">{item.service}</td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="price-input"
                                                        value={item.price}
                                                        onChange={(e) => handlePriceChange(item.id, 'price', e.target.value)}
                                                    />
                                                </td>
                                                <td>{item.unit}</td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="price-input min-order-input"
                                                        value={item.minOrder}
                                                        onChange={(e) => handlePriceChange(item.id, 'minOrder', e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${item.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                                                        {item.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="actions-cell">
                                                    <button className="btn-action btn-save">Save</button>
                                                    <button className="btn-action btn-toggle">Disable</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="info-box">
                                <p>ℹ️ Prices are inclusive of all taxes. Changes reflect immediately in the customer app.</p>
                            </div>
                        </section>
                    )}

                    {/* Business Info Tab */}
                    {activeTab === 'business' && (
                        <section className="dashboard-form-section">
                            <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-light)' }}>Business Details</h2>
                            <div className="settings-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Business Name</label>
                                        <input type="text" name="name" value={businessInfo.name} onChange={handleInfoChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Contact Number</label>
                                        <input type="text" name="phone" value={businessInfo.phone} onChange={handleInfoChange} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input type="email" name="email" value={businessInfo.email} onChange={handleInfoChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Website</label>
                                        <input type="text" name="website" value={businessInfo.website} onChange={handleInfoChange} />
                                    </div>
                                </div>
                                <div className="form-group full-width">
                                    <label>Address</label>
                                    <textarea rows="3" name="address" value={businessInfo.address} onChange={handleInfoChange}></textarea>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Tax Rate (%)</label>
                                        <input type="number" name="taxRate" value={businessInfo.taxRate} onChange={handleInfoChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Currency</label>
                                        <select name="currency" value={businessInfo.currency} onChange={handleInfoChange}>
                                            <option value="LKR">LKR (Sri Lankan Rupee)</option>
                                            <option value="USD">USD (US Dollar)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button className="btn btn-primary btn-large">Save Changes</button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Delivery Settings Tab */}
                    {activeTab === 'delivery' && (
                        <section className="dashboard-form-section">
                            <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-light)' }}>Delivery Parameters</h2>
                            <div className="settings-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Standard Delivery Fee (LKR)</label>
                                        <input type="number" name="standardFee" value={deliverySettings.standardFee} onChange={handleDeliveryChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Express Delivery Fee (LKR)</label>
                                        <input type="number" name="expressFee" value={deliverySettings.expressFee} onChange={handleDeliveryChange} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Free Delivery Threshold (LKR)</label>
                                        <input type="number" name="freeDeliveryThreshold" value={deliverySettings.freeDeliveryThreshold} onChange={handleDeliveryChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Max Delivery Distance (km)</label>
                                        <input type="number" name="maxDistance" value={deliverySettings.maxDistance} onChange={handleDeliveryChange} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Pickup Start Time</label>
                                        <input type="time" name="pickupStart" value={deliverySettings.pickupStart} onChange={handleDeliveryChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Pickup End Time</label>
                                        <input type="time" name="pickupEnd" value={deliverySettings.pickupEnd} onChange={handleDeliveryChange} />
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button className="btn btn-primary btn-large">Update Delivery Settings</button>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SystemSettings;
