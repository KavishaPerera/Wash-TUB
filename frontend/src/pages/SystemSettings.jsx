import { useState, useEffect } from 'react';
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
    };
    const [deliverySettings, setDeliverySettings] = useState(() => {
        try {
            const saved = localStorage.getItem('washtub_delivery_settings');
            return saved ? { ...DELIVERY_SETTINGS_DEFAULTS, ...JSON.parse(saved) } : DELIVERY_SETTINGS_DEFAULTS;
        } catch { return DELIVERY_SETTINGS_DEFAULTS; }
    });

    // Time Slots State
    const TIME_SLOT_DEFAULTS = [
        { id: 1, label: '09:00 AM - 12:00 PM' },
        { id: 2, label: '12:00 PM - 03:00 PM' },
        { id: 3, label: '03:00 PM - 06:00 PM' },
        { id: 4, label: '06:00 PM - 09:00 PM' },
    ];
    const [timeSlots, setTimeSlots] = useState(() => {
        try {
            const saved = localStorage.getItem('washtub_time_slots');
            return saved ? JSON.parse(saved) : TIME_SLOT_DEFAULTS;
        } catch { return TIME_SLOT_DEFAULTS; }
    });

    // Blocked Dates State
    const [blockedDates, setBlockedDates] = useState(() => {
        try {
            const saved = localStorage.getItem('washtub_blocked_dates');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
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
        localStorage.setItem('washtub_time_slots', JSON.stringify(timeSlots));
        localStorage.setItem('washtub_blocked_dates', JSON.stringify(blockedDates));
        alert('Delivery settings saved successfully.');
    };

    const handleAddTimeSlot = () => {
        setTimeSlots([...timeSlots, { id: Date.now(), label: '' }]);
    };
    const handleTimeSlotChange = (id, value) => {
        setTimeSlots(timeSlots.map(s => s.id === id ? { ...s, label: value } : s));
    };
    const handleRemoveTimeSlot = (id) => {
        setTimeSlots(timeSlots.filter(s => s.id !== id));
    };

    const handleAddBlockedDate = () => {
        setBlockedDates([...blockedDates, { id: Date.now(), date: '', reason: '' }]);
    };
    const handleBlockedDateChange = (id, field, value) => {
        setBlockedDates(blockedDates.map(d => d.id === id ? { ...d, [field]: value } : d));
    };
    const handleRemoveBlockedDate = (id) => {
        setBlockedDates(blockedDates.filter(d => d.id !== id));
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

    // ── Promotions State ──────────────────────────────────────────────
    const PROMO_FORM_DEFAULTS = {
        code: '', description: '', discountType: 'percentage',
        discountValue: '', minOrderAmount: '', maxUses: '', expiresAt: '', targetType: 'all',
    };
    const [promoForm, setPromoForm] = useState(PROMO_FORM_DEFAULTS);
    const [promotions, setPromotions] = useState([]);
    const [topCustomers, setTopCustomers] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
    const [lowSalesServices, setLowSalesServices] = useState([]);
    const [promoLoading, setPromoLoading] = useState(false);
    const [promoMsg, setPromoMsg] = useState('');
    const [promoError, setPromoError] = useState('');
    const [sendingEmails, setSendingEmails] = useState(null); // promotionId being sent

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const API_URL = 'http://localhost:5000/api';
    const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

    const fetchPromotions = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/promotions`, { headers: authHeaders });
            if (res.ok) setPromotions(await res.json());
        } catch { /* silent */ }
    };

    useEffect(() => {
        if (activeTab === 'promotions') fetchPromotions();
    }, [activeTab]);

    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const rand = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        setPromoForm(f => ({ ...f, code: `PROMO-${rand}` }));
    };

    const handlePromoFormChange = (e) => {
        setPromoForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleCreatePromotion = async () => {
        setPromoMsg(''); setPromoError('');
        if (!promoForm.code || !promoForm.discountValue) {
            setPromoError('Code and discount value are required.');
            return;
        }
        setPromoLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/promotions`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({
                    code: promoForm.code,
                    description: promoForm.description,
                    discountType: promoForm.discountType,
                    discountValue: parseFloat(promoForm.discountValue),
                    minOrderAmount: parseFloat(promoForm.minOrderAmount) || 0,
                    maxUses: promoForm.maxUses ? parseInt(promoForm.maxUses) : null,
                    expiresAt: promoForm.expiresAt || null,
                }),
            });
            const data = await res.json();
            if (!res.ok) { setPromoError(data.message || 'Failed to create promotion.'); return; }

            // Send in-app notifications based on target type
            if (promoForm.targetType === 'all' && data.promotion?.id) {
                try {
                    const custRes = await fetch(`${API_URL}/admin/promotions/active-customers`, { headers: authHeaders });
                    const customers = await custRes.json();
                    const allIds = customers.map(c => c.id);
                    if (allIds.length > 0) {
                        await fetch(`${API_URL}/admin/promotions/send-notifications`, {
                            method: 'POST',
                            headers: authHeaders,
                            body: JSON.stringify({ promotionId: data.promotion.id, customerIds: allIds }),
                        });
                        setPromoMsg(`Promotion created & notifications sent to ${allIds.length} customer(s)!`);
                    } else {
                        setPromoMsg('Promotion created! (No active customers found.)');
                    }
                } catch {
                    setPromoMsg('Promotion created! (Notifications could not be sent.)');
                }
            } else if (selectedCustomerIds.length > 0 && data.promotion?.id) {
                try {
                    await fetch(`${API_URL}/admin/promotions/send-notifications`, {
                        method: 'POST',
                        headers: authHeaders,
                        body: JSON.stringify({ promotionId: data.promotion.id, customerIds: selectedCustomerIds }),
                    });
                    setPromoMsg(`Promotion created & notifications sent to ${selectedCustomerIds.length} customer(s)!`);
                } catch {
                    setPromoMsg('Promotion created! (Notifications could not be sent.)');
                }
            } else {
                setPromoMsg('Promotion created successfully!');
            }

            setPromoForm(PROMO_FORM_DEFAULTS);
            setTopCustomers([]);
            setSelectedCustomers([]);
            setSelectedCustomerIds([]);
            fetchPromotions();
        } catch { setPromoError('Network error.'); }
        finally { setPromoLoading(false); }
    };

    const handleDeletePromotion = async (id) => {
        if (!window.confirm('Delete this promotion?')) return;
        try {
            await fetch(`${API_URL}/admin/promotions/${id}`, { method: 'DELETE', headers: authHeaders });
            fetchPromotions();
        } catch { /* silent */ }
    };

    const handleLoadTopCustomers = async () => {
        setPromoLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/promotions/top-customers`, { headers: authHeaders });
            if (res.ok) { setTopCustomers(await res.json()); setSelectedCustomers([]); setSelectedCustomerIds([]); }
        } catch { /* silent */ }
        finally { setPromoLoading(false); }
    };

    const handleLoadLowSalesServices = async () => {
        setPromoLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/promotions/low-sales-services`, { headers: authHeaders });
            if (res.ok) setLowSalesServices(await res.json());
        } catch { /* silent */ }
        finally { setPromoLoading(false); }
    };

    const toggleCustomerSelect = (customer) => {
        const { email, id } = customer;
        setSelectedCustomers(prev =>
            prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
        );
        setSelectedCustomerIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSendEmails = async (promotionId) => {
        const promo = promotions.find(p => p.id === promotionId);
        if (!promo) return;

        let recipients;
        if (promo.target_type === 'top_customers' || selectedCustomers.length > 0) {
            if (selectedCustomers.length === 0) {
                alert('Select at least one customer to send the email to.');
                return;
            }
            recipients = topCustomers
                .filter(c => selectedCustomers.includes(c.email))
                .map(c => ({ email: c.email, first_name: c.first_name }));
        } else {
            recipients = selectedCustomers.map(e => ({ email: e, first_name: 'Valued Customer' }));
        }

        if (recipients.length === 0) {
            alert('No recipients selected.');
            return;
        }

        setSendingEmails(promotionId);
        try {
            const res = await fetch(`${API_URL}/admin/promotions/send-emails`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({ promotionId, emails: recipients }),
            });
            const data = await res.json();
            alert(data.message || 'Emails sent.');
        } catch { alert('Failed to send emails.'); }
        finally { setSendingEmails(null); }
    };

    const handleSendToSelected = async (promoId) => {
        if (selectedCustomers.length === 0) {
            alert('Select at least one customer first.');
            return;
        }
        const recipients = topCustomers
            .filter(c => selectedCustomers.includes(c.email))
            .map(c => ({ email: c.email, first_name: c.first_name }));

        setSendingEmails(promoId);
        try {
            const res = await fetch(`${API_URL}/admin/promotions/send-emails`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({ promotionId: promoId, emails: recipients }),
            });
            const data = await res.json();
            alert(data.message || 'Emails sent.');
        } catch { alert('Failed to send emails.'); }
        finally { setSendingEmails(null); }
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
                        <button
                            className={`settings-tab ${activeTab === 'promotions' ? 'active' : ''}`}
                            onClick={() => setActiveTab('promotions')}
                        >
                            🎁 Promotions
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

                                {/* Time Slots Manager */}
                                <div className="timeslot-manager">
                                    <div className="timeslot-manager-header">
                                        <h3>Pickup Time Slots</h3>
                                        <button className="btn btn-secondary btn-sm" onClick={handleAddTimeSlot}>+ Add Slot</button>
                                    </div>
                                    {timeSlots.map((slot, index) => (
                                        <div key={slot.id} className="timeslot-entry">
                                            <div className="faq-entry-header">
                                                <span className="faq-entry-label">Slot #{index + 1}</span>
                                                <button className="faq-remove-btn" onClick={() => handleRemoveTimeSlot(slot.id)}>Remove</button>
                                            </div>
                                            <div className="form-group">
                                                <label>Time Slot Label</label>
                                                <input
                                                    type="text"
                                                    value={slot.label}
                                                    onChange={e => handleTimeSlotChange(slot.id, e.target.value)}
                                                    placeholder="e.g. 09:00 AM - 12:00 PM"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Blocked Dates Manager */}
                                <div className="blocked-dates-manager">
                                    <div className="blocked-dates-manager-header">
                                        <h3>Blocked Dates</h3>
                                        <button className="btn btn-secondary btn-sm" onClick={handleAddBlockedDate}>+ Add Date</button>
                                    </div>
                                    {blockedDates.length === 0 && (
                                        <p className="blocked-dates-empty">No dates blocked. Add poya days or holidays here.</p>
                                    )}
                                    {blockedDates.map((entry, index) => (
                                        <div key={entry.id} className="blocked-date-entry">
                                            <div className="faq-entry-header">
                                                <span className="faq-entry-label">Date #{index + 1}</span>
                                                <button className="faq-remove-btn" onClick={() => handleRemoveBlockedDate(entry.id)}>Remove</button>
                                            </div>
                                            <div className="city-entry-row">
                                                <div className="form-group">
                                                    <label>Date</label>
                                                    <input
                                                        type="date"
                                                        value={entry.date}
                                                        onChange={e => handleBlockedDateChange(entry.id, 'date', e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Reason</label>
                                                    <input
                                                        type="text"
                                                        value={entry.reason}
                                                        onChange={e => handleBlockedDateChange(entry.id, 'reason', e.target.value)}
                                                        placeholder="e.g. Poya Day"
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
                    {/* Promotions Tab */}
                    {activeTab === 'promotions' && (
                        <section className="dashboard-form-section">
                            {/* ── Create Promotion ── */}
                            <div className="promo-card">
                                <h3 className="promo-section-title">Create New Promotion</h3>
                                {promoMsg && <div className="promo-alert promo-alert-success">{promoMsg}</div>}
                                {promoError && <div className="promo-alert promo-alert-error">{promoError}</div>}

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Promo Code</label>
                                        <div className="promo-code-row">
                                            <input
                                                type="text"
                                                name="code"
                                                value={promoForm.code}
                                                onChange={handlePromoFormChange}
                                                placeholder="e.g. PROMO-ABC123"
                                                style={{ textTransform: 'uppercase' }}
                                            />
                                            <button className="btn btn-secondary btn-sm generate-btn" onClick={generateCode}>
                                                Generate
                                            </button>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Description (optional)</label>
                                        <input
                                            type="text"
                                            name="description"
                                            value={promoForm.description}
                                            onChange={handlePromoFormChange}
                                            placeholder="e.g. New Year Special"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Discount Type</label>
                                        <select name="discountType" value={promoForm.discountType} onChange={handlePromoFormChange}>
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed Amount (LKR)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Discount Value</label>
                                        <input
                                            type="number"
                                            name="discountValue"
                                            value={promoForm.discountValue}
                                            onChange={handlePromoFormChange}
                                            placeholder={promoForm.discountType === 'percentage' ? 'e.g. 10' : 'e.g. 200'}
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Min Order Amount (LKR)</label>
                                        <input
                                            type="number"
                                            name="minOrderAmount"
                                            value={promoForm.minOrderAmount}
                                            onChange={handlePromoFormChange}
                                            placeholder="e.g. 500 (leave blank for none)"
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Max Uses (leave blank for unlimited)</label>
                                        <input
                                            type="number"
                                            name="maxUses"
                                            value={promoForm.maxUses}
                                            onChange={handlePromoFormChange}
                                            placeholder="e.g. 50"
                                            min="1"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Expiry Date (optional)</label>
                                        <input
                                            type="date"
                                            name="expiresAt"
                                            value={promoForm.expiresAt}
                                            onChange={handlePromoFormChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Target Customers for Email</label>
                                        <select name="targetType" value={promoForm.targetType} onChange={handlePromoFormChange}>
                                            <option value="all">All Active Customers</option>
                                            <option value="top">Top Customers (select manually)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleCreatePromotion}
                                        disabled={promoLoading}
                                    >
                                        {promoLoading ? 'Creating…' : 'Create Promotion'}
                                    </button>
                                </div>
                            </div>

                            {/* ── Top Customers (shown when target = top) ── */}
                            {promoForm.targetType === 'top' && (
                                <div className="promo-card">
                                    <div className="promo-section-header">
                                        <h3 className="promo-section-title">Top Customers by Spend</h3>
                                        <button className="btn btn-secondary btn-sm" onClick={handleLoadTopCustomers} disabled={promoLoading}>
                                            {promoLoading ? 'Loading…' : 'Load Top Customers'}
                                        </button>
                                    </div>
                                    {topCustomers.length > 0 && (
                                        <div className="promo-table-wrap">
                                            <table className="promo-table">
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Orders</th>
                                                        <th>Total Spent (LKR)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {topCustomers.map(c => (
                                                        <tr key={c.id} className={selectedCustomers.includes(c.email) ? 'promo-row-selected' : ''}>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedCustomers.includes(c.email)}
                                                                    onChange={() => toggleCustomerSelect(c)}
                                                                />
                                                            </td>
                                                            <td>{c.first_name} {c.last_name}</td>
                                                            <td>{c.email}</td>
                                                            <td>{c.order_count}</td>
                                                            <td>{parseFloat(c.total_spent).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <p className="promo-selected-count">{selectedCustomers.length} customer(s) selected</p>
                                        </div>
                                    )}
                                    {topCustomers.length === 0 && <p className="promo-empty">Click "Load Top Customers" to view the ranking.</p>}
                                </div>
                            )}

                            {/* ── Low Sales Services (informational) ── */}
                            <div className="promo-card">
                                <div className="promo-section-header">
                                    <h3 className="promo-section-title">Low Sales Services <span className="promo-badge-info">Insight</span></h3>
                                    <button className="btn btn-secondary btn-sm" onClick={handleLoadLowSalesServices} disabled={promoLoading}>
                                        {promoLoading ? 'Loading…' : 'View Low Sales Services'}
                                    </button>
                                </div>
                                <p className="promo-hint">Use this data to decide which services to promote. Create a promo code and target customers to boost these services.</p>
                                {lowSalesServices.length > 0 && (
                                    <div className="promo-table-wrap">
                                        <table className="promo-table">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Service</th>
                                                    <th>Unit</th>
                                                    <th>Orders</th>
                                                    <th>Revenue (LKR)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {lowSalesServices.map((s, i) => (
                                                    <tr key={s.service_id}>
                                                        <td>{i + 1}</td>
                                                        <td>{s.service_name}</td>
                                                        <td>{s.unit_type}</td>
                                                        <td>{s.order_count}</td>
                                                        <td>{parseFloat(s.total_revenue).toLocaleString('en-LK', { minimumFractionDigits: 2 })}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* ── Active Promotions ── */}
                            <div className="promo-card">
                                <h3 className="promo-section-title">Active Promotions</h3>
                                {promotions.length === 0 ? (
                                    <p className="promo-empty">No promotions created yet.</p>
                                ) : (
                                    <div className="promo-table-wrap">
                                        <table className="promo-table">
                                            <thead>
                                                <tr>
                                                    <th>Code</th>
                                                    <th>Discount</th>
                                                    <th>Min Order</th>
                                                    <th>Uses</th>
                                                    <th>Expires</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {promotions.map(p => {
                                                    const isExpired = p.expires_at && new Date(p.expires_at) < new Date();
                                                    const isFull = p.max_uses !== null && p.used_count >= p.max_uses;
                                                    const active = p.is_active && !isExpired && !isFull;
                                                    return (
                                                        <tr key={p.id}>
                                                            <td><strong>{p.code}</strong></td>
                                                            <td>
                                                                {p.discount_type === 'percentage'
                                                                    ? `${parseFloat(p.discount_value)}% off`
                                                                    : `LKR ${parseFloat(p.discount_value).toFixed(2)} off`}
                                                            </td>
                                                            <td>{parseFloat(p.min_order_amount) > 0 ? `LKR ${parseFloat(p.min_order_amount).toFixed(2)}` : '—'}</td>
                                                            <td>{p.used_count}{p.max_uses ? ` / ${p.max_uses}` : ''}</td>
                                                            <td>{p.expires_at ? new Date(p.expires_at).toLocaleDateString('en-GB') : '—'}</td>
                                                            <td>
                                                                <span className={`promo-status-badge ${active ? 'badge-active' : 'badge-inactive'}`}>
                                                                    {active ? 'Active' : isExpired ? 'Expired' : isFull ? 'Used Up' : 'Inactive'}
                                                                </span>
                                                            </td>
                                                            <td className="promo-actions">
                                                                <button
                                                                    className="btn btn-secondary btn-xs"
                                                                    onClick={() => {
                                                                        if (promoForm.targetType === 'top' && selectedCustomers.length > 0) {
                                                                            handleSendToSelected(p.id);
                                                                        } else {
                                                                            handleSendEmails(p.id);
                                                                        }
                                                                    }}
                                                                    disabled={sendingEmails === p.id}
                                                                >
                                                                    {sendingEmails === p.id ? 'Sending…' : '📧 Send'}
                                                                </button>
                                                                <button
                                                                    className="btn btn-danger btn-xs"
                                                                    onClick={() => handleDeletePromotion(p.id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SystemSettings;
