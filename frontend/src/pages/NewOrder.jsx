import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NewOrder.css';

const NewOrder = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        serviceType: '',
        items: '',
        pickupDate: '',
        pickupTime: '',
        deliveryAddress: '',
        specialInstructions: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle order submission logic here
        console.log('Order submitted:', formData);
        alert('Order placed successfully!');
        navigate('/customer-dashboard');
    };

    const handleBack = () => {
        navigate('/customer-dashboard');
    };

    return (
        <div className="new-order-page">
            {/* Sidebar */}
            <aside className="order-sidebar">
                <div className="sidebar-header">
                    <h2 className="logo">WashTub</h2>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/customer-dashboard" className="nav-item">
                        <span>← Back to Dashboard</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="order-main">
                <header className="order-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h1>Create New Order</h1>
                            <p>Fill in the details below to place your laundry order</p>
                        </div>
                    </div>
                </header>

                <form className="order-form" onSubmit={handleSubmit}>
                    {/* Service Selection */}
                    <section className="form-section">
                        <h2>Service Type</h2>
                        <div className="service-options">
                            <label className={`service-card ${formData.serviceType === 'wash-fold' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="serviceType"
                                    value="wash-fold"
                                    checked={formData.serviceType === 'wash-fold'}
                                    onChange={handleChange}
                                />
                                <span className="service-icon">🧺</span>
                                <span className="service-name">Wash & Fold</span>
                                <span className="service-price">Rs. 50/kg</span>
                            </label>

                            <label className={`service-card ${formData.serviceType === 'dry-clean' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="serviceType"
                                    value="dry-clean"
                                    checked={formData.serviceType === 'dry-clean'}
                                    onChange={handleChange}
                                />
                                <span className="service-icon">👔</span>
                                <span className="service-name">Dry Cleaning</span>
                                <span className="service-price">Rs. 150/item</span>
                            </label>

                            <label className={`service-card ${formData.serviceType === 'iron-press' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="serviceType"
                                    value="iron-press"
                                    checked={formData.serviceType === 'iron-press'}
                                    onChange={handleChange}
                                />
                                <span className="service-icon">👕</span>
                                <span className="service-name">Iron & Press</span>
                                <span className="service-price">Rs. 30/item</span>
                            </label>

                            <label className={`service-card ${formData.serviceType === 'premium' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="serviceType"
                                    value="premium"
                                    checked={formData.serviceType === 'premium'}
                                    onChange={handleChange}
                                />
                                <span className="service-icon">✨</span>
                                <span className="service-name">Premium Care</span>
                                <span className="service-price">Rs. 200/item</span>
                            </label>
                        </div>
                    </section>

                    {/* Item Details */}
                    <section className="form-section">
                        <h2>Item Details</h2>
                        <div className="form-group">
                            <label htmlFor="items">Number of Items / Weight (kg)</label>
                            <input
                                type="text"
                                id="items"
                                name="items"
                                value={formData.items}
                                onChange={handleChange}
                                placeholder="e.g., 5 items or 3 kg"
                                required
                            />
                        </div>
                    </section>

                    {/* Pickup Schedule */}
                    <section className="form-section">
                        <h2>Pickup Schedule</h2>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="pickupDate">Pickup Date</label>
                                <input
                                    type="date"
                                    id="pickupDate"
                                    name="pickupDate"
                                    value={formData.pickupDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="pickupTime">Pickup Time</label>
                                <select
                                    id="pickupTime"
                                    name="pickupTime"
                                    value={formData.pickupTime}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select time slot</option>
                                    <option value="09:00-11:00">09:00 AM - 11:00 AM</option>
                                    <option value="11:00-13:00">11:00 AM - 01:00 PM</option>
                                    <option value="14:00-16:00">02:00 PM - 04:00 PM</option>
                                    <option value="16:00-18:00">04:00 PM - 06:00 PM</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Delivery Address */}
                    <section className="form-section">
                        <h2>Delivery Address</h2>
                        <div className="form-group">
                            <label htmlFor="deliveryAddress">Address</label>
                            <textarea
                                id="deliveryAddress"
                                name="deliveryAddress"
                                value={formData.deliveryAddress}
                                onChange={handleChange}
                                placeholder="Enter your complete delivery address"
                                rows="3"
                                required
                            />
                        </div>
                    </section>

                    {/* Special Instructions */}
                    <section className="form-section">
                        <h2>Special Instructions (Optional)</h2>
                        <div className="form-group">
                            <label htmlFor="specialInstructions">Additional Notes</label>
                            <textarea
                                id="specialInstructions"
                                name="specialInstructions"
                                value={formData.specialInstructions}
                                onChange={handleChange}
                                placeholder="Any special requirements or instructions..."
                                rows="3"
                            />
                        </div>
                    </section>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={handleBack}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Place Order
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default NewOrder;
