import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';
import './SystemSettings.css';

const SystemSettings = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('business');

    // Business Info State
    const BUSINESS_DEFAULTS = {
        name: 'WashTub Laundry',
        phone1: '+94 11 452 8476',
        phone2: '+94 77 643 9276',
        supportEmail: 'support@washtub.lk',
        infoEmail: 'info@washtub.lk',
        website: 'www.washtub.lk',
        address: '478/A, Pannipitiya Rd, Pelawatta, Sri Lanka',
        businessHours: 'Mon - Sun: 7:00 AM - 9:00 PM',
        taxRate: '15',
        currency: 'LKR',
    };
    const [businessInfo, setBusinessInfo] = useState(() => {
        try {
            const saved = localStorage.getItem('washtub_business_info');
            return saved ? { ...BUSINESS_DEFAULTS, ...JSON.parse(saved) } : BUSINESS_DEFAULTS;
        } catch { return BUSINESS_DEFAULTS; }
    });

    // FAQ State
    const FAQ_DEFAULTS = [
        { id: 1, question: 'How do I schedule a pickup?', answer: 'Simply log in to your account, select "New Order", choose your preferred time slot, and we\'ll handle the rest.' },
        { id: 2, question: 'What is the turnaround time?', answer: 'Our standard turnaround time is 24-48 hours. Express same-day service is available for selected areas.' },
        { id: 3, question: 'Do you offer delivery?', answer: 'Yes, we offer free pickup and delivery for orders above LKR 2000 within our service areas.' },
    ];
    const [faqs, setFaqs] = useState(() => {
        try {
            const saved = localStorage.getItem('washtub_faqs');
            return saved ? JSON.parse(saved) : FAQ_DEFAULTS;
        } catch { return FAQ_DEFAULTS; }
    });

    // Delivery Settings State
    const DELIVERY_SETTINGS_DEFAULTS = {
        deliveryFee: '350.00',
        pickupFee: '200.00',
        pickupStart: '08:00',
        pickupEnd: '18:00'
    };
    const [deliverySettings, setDeliverySettings] = useState(() => {
        try {
            const saved = localStorage.getItem('washtub_delivery_settings');
            return saved ? { ...DELIVERY_SETTINGS_DEFAULTS, ...JSON.parse(saved) } : DELIVERY_SETTINGS_DEFAULTS;
        } catch { return DELIVERY_SETTINGS_DEFAULTS; }
    });

    // Cities State
    const CITY_DEFAULTS = [
        { id: 1, city: 'Battaramulla', postalCode: '10120' },
        { id: 2, city: 'Hokandara', postalCode: '10118' },
        { id: 3, city: 'Koswatta', postalCode: '10120' },
        { id: 4, city: 'Malabe', postalCode: '10115' },
        { id: 5, city: 'Pelawatta', postalCode: '10120' },
        { id: 6, city: 'Sri Jayawardenapura', postalCode: '10100' },
        { id: 7, city: 'Thalawathugoda', postalCode: '10116' },
    ];
    const [cities, setCities] = useState(() => {
        try {
            const saved = localStorage.getItem('washtub_cities');
            return saved ? JSON.parse(saved) : CITY_DEFAULTS;
        } catch { return CITY_DEFAULTS; }
    });

    const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); sessionStorage.removeItem('token'); sessionStorage.removeItem('user'); navigate('/signin'); };

    const handleInfoChange = (e) => {
        setBusinessInfo({ ...businessInfo, [e.target.name]: e.target.value });
    };

    const handleSaveBusinessInfo = () => {
        localStorage.setItem('washtub_business_info', JSON.stringify(businessInfo));
        localStorage.setItem('washtub_faqs', JSON.stringify(faqs));
        alert('Business information saved successfully.');
    };

    const handleFaqChange = (id, field, value) => {
        setFaqs(faqs.map(f => f.id === id ? { ...f, [field]: value } : f));
    };
    const handleAddFaq = () => {
        setFaqs([...faqs, { id: Date.now(), question: '', answer: '' }]);
    };
    const handleRemoveFaq = (id) => {
        setFaqs(faqs.filter(f => f.id !== id));
    };

    const handleDeliveryChange = (e) => {
        setDeliverySettings({ ...deliverySettings, [e.target.name]: e.target.value });
    };

    const handleSaveDeliverySettings = () => {
        localStorage.setItem('washtub_delivery_settings', JSON.stringify(deliverySettings));
        localStorage.setItem('washtub_cities', JSON.stringify(cities));
        alert('Delivery settings saved successfully.');
    };

    const handleCityChange = (id, field, value) => {
        setCities(cities.map(c => c.id === id ? { ...c, [field]: value } : c));
    };
    const handleAddCity = () => {
        setCities([...cities, { id: Date.now(), city: '', postalCode: '' }]);
    };
    const handleRemoveCity = (id) => {
        setCities(cities.filter(c => c.id !== id));
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
                            <p>Manage business info and delivery parameters</p>
                        </div>
                    </div>
                </header>

                <div className="dashboard-content">
                    {/* Tabs */}
                    <div className="settings-tabs">
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

                    {/* Business Info Tab */}
                    {activeTab === 'business' && (
                        <section className="dashboard-form-section">
                            <div className="settings-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Business Name</label>
                                        <input type="text" name="name" value={businessInfo.name} onChange={handleInfoChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Website</label>
                                        <input type="text" name="website" value={businessInfo.website} onChange={handleInfoChange} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Phone 1</label>
                                        <input type="text" name="phone1" value={businessInfo.phone1} onChange={handleInfoChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone 2</label>
                                        <input type="text" name="phone2" value={businessInfo.phone2} onChange={handleInfoChange} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Support Email</label>
                                        <input type="email" name="supportEmail" value={businessInfo.supportEmail} onChange={handleInfoChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Info Email</label>
                                        <input type="email" name="infoEmail" value={businessInfo.infoEmail} onChange={handleInfoChange} />
                                    </div>
                                </div>
                                <div className="form-group full-width">
                                    <label>Address</label>
                                    <textarea rows="3" name="address" value={businessInfo.address} onChange={handleInfoChange}></textarea>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Business Hours</label>
                                        <input type="text" name="businessHours" value={businessInfo.businessHours} onChange={handleInfoChange} placeholder="e.g. Mon - Sun: 7:00 AM - 9:00 PM" />
                                    </div>
                                    <div className="form-group">
                                        <label>Currency</label>
                                        <select name="currency" value={businessInfo.currency} onChange={handleInfoChange}>
                                            <option value="LKR">LKR (Sri Lankan Rupee)</option>
                                            <option value="USD">USD (US Dollar)</option>
                                        </select>
                                    </div>
                                </div>
                                {/* FAQ Manager */}
                                <div className="faq-manager">
                                    <div className="faq-manager-header">
                                        <h3>Frequently Asked Questions</h3>
                                        <button className="btn btn-secondary btn-sm" onClick={handleAddFaq}>+ Add FAQ</button>
                                    </div>
                                    {faqs.map((faq, index) => (
                                        <div key={faq.id} className="faq-entry">
                                            <div className="faq-entry-header">
                                                <span className="faq-entry-label">FAQ #{index + 1}</span>
                                                <button className="faq-remove-btn" onClick={() => handleRemoveFaq(faq.id)}>Remove</button>
                                            </div>
                                            <div className="form-group">
                                                <label>Question</label>
                                                <input
                                                    type="text"
                                                    value={faq.question}
                                                    onChange={e => handleFaqChange(faq.id, 'question', e.target.value)}
                                                    placeholder="Enter question"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Answer</label>
                                                <textarea
                                                    rows="3"
                                                    value={faq.answer}
                                                    onChange={e => handleFaqChange(faq.id, 'answer', e.target.value)}
                                                    placeholder="Enter answer"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="form-actions">
                                    <button className="btn btn-primary btn-large" onClick={handleSaveBusinessInfo}>Save Changes</button>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Delivery Settings Tab */}
                    {activeTab === 'delivery' && (
                        <section className="dashboard-form-section">
                            <div className="settings-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Pickup &amp; Delivery Fee (LKR)</label>
                                        <input type="number" name="deliveryFee" value={deliverySettings.deliveryFee} onChange={handleDeliveryChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Pickup Only Fee (LKR)</label>
                                        <input type="number" name="pickupFee" value={deliverySettings.pickupFee} onChange={handleDeliveryChange} />
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

                                {/* City Manager */}
                                <div className="city-manager">
                                    <div className="city-manager-header">
                                        <h3>Service Areas</h3>
                                        <button className="btn btn-secondary btn-sm" onClick={handleAddCity}>+ Add City</button>
                                    </div>
                                    {cities.map((entry, index) => (
                                        <div key={entry.id} className="city-entry">
                                            <div className="faq-entry-header">
                                                <span className="faq-entry-label">City #{index + 1}</span>
                                                <button className="faq-remove-btn" onClick={() => handleRemoveCity(entry.id)}>Remove</button>
                                            </div>
                                            <div className="city-entry-row">
                                                <div className="form-group">
                                                    <label>City Name</label>
                                                    <input
                                                        type="text"
                                                        value={entry.city}
                                                        onChange={e => handleCityChange(entry.id, 'city', e.target.value)}
                                                        placeholder="e.g. Malabe"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Postal Code</label>
                                                    <input
                                                        type="text"
                                                        value={entry.postalCode}
                                                        onChange={e => handleCityChange(entry.id, 'postalCode', e.target.value)}
                                                        placeholder="e.g. 10115"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="form-actions">
                                    <button className="btn btn-primary btn-large" onClick={handleSaveDeliverySettings}>Update Delivery Settings</button>
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
