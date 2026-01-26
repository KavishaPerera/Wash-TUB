import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Home, MapPin, Phone, User, Truck } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Checkout.css';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [currentStep, setCurrentStep] = useState(1); // 1 = Delivery Details, 2 = Payment
    const [formData, setFormData] = useState({
        // Delivery Details
        fullName: '',
        phone: '',
        address: '',
        city: '',
        deliveryOption: 'delivery',
        // Payment Details
        paymentMethod: 'visa',
        cardName: '',
        cardNumber: '',
        expireDate: '',
        cvc: ''
    });

    const DELIVERY_FEE = 200;

    useEffect(() => {
        if (location.state?.cartItems) {
            setCartItems(location.state.cartItems);
        }
    }, [location.state]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.totalPrice || item.price), 0);
    const deliveryFee = formData.deliveryOption === 'delivery' ? DELIVERY_FEE : 0;
    const discounts = 0;
    const grandTotal = totalAmount + deliveryFee - discounts;

    const handleDeliverySubmit = (e) => {
        e.preventDefault();
        // Validate delivery form before proceeding
        if (formData.fullName && formData.phone && formData.address && formData.city) {
            setCurrentStep(2);
        }
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        // Generate a mock order ID
        const newOrderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        setOrderId(newOrderId);
        setOrderSuccess(true);
    };

    const handleGoToDashboard = () => {
        navigate('/customer-dashboard');
    };

    const handleViewOrder = () => {
        navigate('/my-orders');
    };

    const handleBackToDelivery = () => {
        setCurrentStep(1);
    };

    // Success Screen
    if (orderSuccess) {
        return (
            <div className="checkout-page">
                <div className="success-container">
                    <div className="success-content">
                        <div className="success-icon">
                            <Check size={40} strokeWidth={2} />
                        </div>
                        <h2 className="success-title">Your order is successfully placed</h2>
                        <div className="success-actions">
                            <button className="btn-dashboard" onClick={handleGoToDashboard}>
                                <Home size={18} />
                                GO TO DASHBOARD
                            </button>
                            <button className="btn-view-order" onClick={handleViewOrder}>
                                VIEW ORDER
                                <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Step 1: Delivery Details
    if (currentStep === 1) {
        return (
            <div className="checkout-page">
                <div className="checkout-container">
                    <div className="checkout-header">
                        <Link to="/cart" className="back-link">
                            <ArrowLeft size={20} />
                            Back to Basket
                        </Link>
                        <h1>Delivery Details</h1>
                        <div className="step-indicator">
                            <span className="step active">1. Delivery</span>
                            <span className="step">2. Payment</span>
                        </div>
                    </div>

                    <form onSubmit={handleDeliverySubmit} className="checkout-content">
                        <div className="delivery-form-section">
                            {/* Contact Details */}
                            <div className="form-card">
                                <h2 className="section-title"><User size={20} /> Contact Details</h2>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="form-card">
                                <h2 className="section-title"><MapPin size={20} /> Delivery Address</h2>
                                <div className="form-group">
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter your address"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter your city"
                                    />
                                </div>
                            </div>

                            {/* Delivery Option */}
                            <div className="form-card">
                                <h2 className="section-title"><Truck size={20} /> Delivery Option</h2>
                                <div className="radio-group">
                                    <label className={`radio-option ${formData.deliveryOption === 'pickup' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="deliveryOption"
                                            value="pickup"
                                            checked={formData.deliveryOption === 'pickup'}
                                            onChange={handleInputChange}
                                        />
                                        <span className="radio-label">
                                            <strong>Self Pickup</strong>
                                            <small>Free - Pick up from our store</small>
                                        </span>
                                    </label>
                                    <label className={`radio-option ${formData.deliveryOption === 'delivery' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="deliveryOption"
                                            value="delivery"
                                            checked={formData.deliveryOption === 'delivery'}
                                            onChange={handleInputChange}
                                        />
                                        <span className="radio-label">
                                            <strong>Home Delivery</strong>
                                            <small>LKR {DELIVERY_FEE}.00 - Delivered to your door</small>
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="order-summary-section">
                            <div className="summary-card">
                                <h2 className="summary-title">Order Summary</h2>
                                <div className="summary-items">
                                    {cartItems.map((item, index) => (
                                        <div key={index} className="summary-item">
                                            <span>{item.name} x{item.quantity || 1}</span>
                                            <span>LKR {(item.totalPrice || item.price).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="summary-totals">
                                    <div className="summary-row">
                                        <span>Sub-total</span>
                                        <span>LKR {totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Delivery Fee</span>
                                        <span>{deliveryFee === 0 ? 'Free' : `LKR ${deliveryFee.toFixed(2)}`}</span>
                                    </div>
                                    <div className="summary-row total">
                                        <span>Total</span>
                                        <span>LKR {grandTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                                <button type="submit" className="btn-proceed">
                                    Proceed to Payment
                                    <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // Step 2: Payment
    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <div className="checkout-header">
                    <button onClick={handleBackToDelivery} className="back-link">
                        <ArrowLeft size={20} />
                        Back to Delivery Details
                    </button>
                    <h1>Payment</h1>
                    <div className="step-indicator">
                        <span className="step completed">1. Delivery ✓</span>
                        <span className="step active">2. Payment</span>
                    </div>
                </div>

                <form onSubmit={handlePaymentSubmit} className="checkout-content">
                    {/* Payment Options Section */}
                    <div className="payment-form-section">
                        <div className="payment-card">
                            <h2 className="section-title">Payment Option</h2>

                            {/* Payment Methods - Visa and Mastercard */}
                            <div className="payment-methods">
                                <label
                                    className={`payment-method-option ${formData.paymentMethod === 'visa' ? 'selected' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'visa' }))}
                                >
                                    <div className="method-icon visa-icon">
                                        <span className="visa-text">VISA</span>
                                    </div>
                                    <span className="method-name">Visa Card</span>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="visa"
                                        checked={formData.paymentMethod === 'visa'}
                                        onChange={() => setFormData(prev => ({ ...prev, paymentMethod: 'visa' }))}
                                    />
                                </label>

                                <label
                                    className={`payment-method-option ${formData.paymentMethod === 'mastercard' ? 'selected' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'mastercard' }))}
                                >
                                    <div className="method-icon mastercard-icon">
                                        <div className="mc-circles">
                                            <span className="mc-circle mc-red"></span>
                                            <span className="mc-circle mc-orange"></span>
                                        </div>
                                    </div>
                                    <span className="method-name">Master Card</span>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="mastercard"
                                        checked={formData.paymentMethod === 'mastercard'}
                                        onChange={() => setFormData(prev => ({ ...prev, paymentMethod: 'mastercard' }))}
                                    />
                                </label>
                            </div>

                            {/* Card Details Form */}
                            {(formData.paymentMethod === 'visa' || formData.paymentMethod === 'mastercard') && (
                                <div className="card-details-form">
                                    <div className="form-group">
                                        <label>Name on Card</label>
                                        <input
                                            type="text"
                                            name="cardName"
                                            value={formData.cardName}
                                            onChange={handleInputChange}
                                            required
                                            placeholder=""
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Card Number</label>
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleInputChange}
                                            required
                                            placeholder=""
                                            maxLength="19"
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Expire Date</label>
                                            <input
                                                type="text"
                                                name="expireDate"
                                                value={formData.expireDate}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="DD/YY"
                                                maxLength="5"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>CVC</label>
                                            <input
                                                type="text"
                                                name="cvc"
                                                value={formData.cvc}
                                                onChange={handleInputChange}
                                                required
                                                placeholder=""
                                                maxLength="4"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card Totals Section */}
                    <div className="card-totals-section">
                        <div className="totals-card">
                            <h2 className="totals-title">Order Totals</h2>
                            <div className="totals-content">
                                <div className="totals-row">
                                    <span className="totals-label">Sub-total</span>
                                    <span className="totals-value">LKR {totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="totals-row">
                                    <span className="totals-label">Delivery Fee</span>
                                    <span className="totals-value">{deliveryFee === 0 ? 'Free' : `LKR ${deliveryFee.toFixed(2)}`}</span>
                                </div>
                                <div className="totals-row">
                                    <span className="totals-label">Discounts</span>
                                    <span className="totals-value discount">{discounts}</span>
                                </div>
                                <div className="totals-row total-final">
                                    <span className="totals-label">Total</span>
                                    <span className="totals-value total-amount">LKR {grandTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            <button type="submit" className="btn-confirm-payment">
                                CONFIRM PAYMENT
                                <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
