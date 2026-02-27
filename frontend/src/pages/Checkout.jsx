import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Home, MapPin, Phone, User, Truck, Calendar, Loader } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './Checkout.css';
import Swal from 'sweetalert2';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, totalAmount, clearCart } = useCart();
    const [currentStep, setCurrentStep] = useState(1); // 1 = Delivery Details, 2 = Payment
    const [submitting, setSubmitting] = useState(false);

    // Auth guard — must be logged in as a customer to access checkout
    const token = localStorage.getItem('token');
    if (!token) {
        // Not logged in at all — redirect to sign in with return URL
        navigate('/signin?redirect=/checkout', { replace: true });
        return null;
    }
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role && user.role !== 'customer') {
            navigate('/', { replace: true });
            return null;
        }
    } catch { /* ignore */ }
    const [formData, setFormData] = useState({
        // Delivery Details
        fullName: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        deliveryOption: 'delivery',
        pickupDate: '',
        pickupTime: '',
        specialInstructions: '',
        // Payment Details
        paymentMethod: 'visa',
        cardName: '',
        cardNumber: '',
        expireDate: '',
        cvc: ''
    });

    const DELIVERY_FEE = 350;
    const PICKUP_FEE = 200;

    const CITY_POSTAL_MAP = {
        'Battaramulla': '10120',
        'Hokandara': '10118',
        'Koswatta': '10120',
        'Malabe': '10115',
        'Pelawatta': '10120',
        'Sri Jayawardenapura': '10100',
        'Thalawathugoda': '10116',
    };

    // Redirect if cart is empty (but not while submitting — clearCart fires before navigate)
    if (cartItems.length === 0 && !submitting) {
        return (
            <div className="checkout-page">
                <div className="checkout-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                    <h2 style={{ color: '#2d3748', marginBottom: '1rem' }}>Your cart is empty</h2>
                    <p style={{ color: '#718096', marginBottom: '2rem' }}>Add some services before checking out.</p>
                    <Link to="/pricing" className="btn-proceed" style={{ display: 'inline-flex', textDecoration: 'none' }}>
                        Browse Services
                    </Link>
                </div>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'city') {
            setFormData(prev => ({ ...prev, city: value, postalCode: CITY_POSTAL_MAP[value] || '' }));
        } else if (name === 'cardNumber') {
            const digits = value.replace(/\D/g, '');
            let formatted = '';
            if (formData.paymentMethod === 'amex') {
                // 4-6-5 format, max 15 digits
                const d = digits.slice(0, 15);
                if (d.length <= 4) formatted = d;
                else if (d.length <= 10) formatted = d.slice(0, 4) + ' ' + d.slice(4);
                else formatted = d.slice(0, 4) + ' ' + d.slice(4, 10) + ' ' + d.slice(10);
            } else {
                // 4-4-4-4 format, max 16 digits
                const d = digits.slice(0, 16);
                formatted = d.match(/.{1,4}/g)?.join(' ') || d;
            }
            setFormData(prev => ({ ...prev, cardNumber: formatted }));
        } else if (name === 'expireDate') {
            const digits = value.replace(/\D/g, '').slice(0, 4);
            let formatted = digits;
            if (digits.length >= 3) {
                formatted = digits.slice(0, 2) + '/' + digits.slice(2);
            } else if (value.endsWith('/') && digits.length === 2) {
                formatted = digits + '/';
            }
            setFormData(prev => ({ ...prev, expireDate: formatted }));
        } else if (name === 'cvc') {
            const digits = value.replace(/\D/g, '').slice(0, 3);
            setFormData(prev => ({ ...prev, cvc: digits }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const deliveryFee = formData.deliveryOption === 'delivery' ? DELIVERY_FEE : PICKUP_FEE;
    const discounts = 0;
    const grandTotal = totalAmount + deliveryFee - discounts;

    const handleDeliverySubmit = (e) => {
        e.preventDefault();

        const isDelivery = formData.deliveryOption === 'delivery';

        // Contact fields always required
        if (!formData.fullName || !formData.phone) {
            Swal.fire({
                icon: 'warning',
                title: 'Contact Details Required',
                text: 'Please enter your full name and phone number.',
                confirmButtonColor: '#0ea5e9',
            });
            return;
        }

        // Address fields required only for Home Delivery
        if (isDelivery && (!formData.address || !formData.city || !formData.postalCode)) {
            Swal.fire({
                icon: 'warning',
                title: 'Delivery Address Required',
                text: 'Please fill in your address, city, and postal code for home delivery.',
                confirmButtonColor: '#0ea5e9',
            });
            return;
        }

        // Schedule always required
        if (!formData.pickupDate || !formData.pickupTime) {
            Swal.fire({
                icon: 'warning',
                title: 'Pickup Schedule Required',
                text: 'Please select your preferred pickup date and time.',
                confirmButtonColor: '#0ea5e9',
            });
            return;
        }

        // All good — proceed to payment
        setCurrentStep(2);
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();

        // Validate card details if paying by card
        if (formData.paymentMethod === 'visa' || formData.paymentMethod === 'mastercard' || formData.paymentMethod === 'amex') {
            if (!formData.cardName || !formData.cardNumber || !formData.expireDate || !formData.cvc) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Card Details Required',
                    text: 'Please fill in all card details.',
                    confirmButtonColor: '#0ea5e9',
                });
                return;
            }
        }

        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                Swal.fire({
                    icon: 'error',
                    title: 'Not Logged In',
                    text: 'Please sign in to place an order.',
                    confirmButtonColor: '#0ea5e9',
                });
                navigate('/signin');
                return;
            }

            const payload = {
                deliveryDetails: {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    deliveryOption: formData.deliveryOption,
                    pickupDate: formData.pickupDate,
                    pickupTime: formData.pickupTime,
                    specialInstructions: formData.specialInstructions,
                    paymentMethod: formData.paymentMethod,
                },
                items: cartItems.map(item => ({
                    serviceId: item.serviceId,
                    name: item.name,
                    method: item.method,
                    unitType: item.unitType,
                    price: item.price,
                    quantity: item.quantity,
                    totalPrice: item.totalPrice,
                })),
            };

            const res = await fetch(`${API}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to place order');
            }

            // Success!
            clearCart();
            navigate('/payment-success', {
                state: {
                    orderNumber: data.orderNumber,
                    total: data.total,
                    orderId: data.orderId,
                    customerName: formData.fullName,
                    customerPhone: formData.phone,
                    customerAddress: formData.deliveryOption === 'delivery'
                        ? `${formData.address}, ${formData.city}, ${formData.postalCode}`
                        : 'Store Pickup',
                    deliveryOption: formData.deliveryOption,
                    paymentMethod: formData.paymentMethod,
                    pickupDate: formData.pickupDate,
                    pickupTime: formData.pickupTime,
                    items: cartItems.map(item => ({
                        name: item.name,
                        method: item.method,
                        unitType: item.unitType,
                        quantity: item.quantity,
                        price: item.price,
                        totalPrice: item.totalPrice,
                    })),
                    subtotal: totalAmount,
                    deliveryFee,
                },
            });
        } catch (err) {
            console.error('Order error:', err);
            Swal.fire({
                icon: 'error',
                title: 'Order Failed',
                text: err.message || 'Something went wrong. Please try again.',
                confirmButtonColor: '#0ea5e9',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleBackToDelivery = () => {
        setCurrentStep(1);
    };

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

                            {/* Delivery Option */}
                            <div className="form-card">
                                <h2 className="section-title"><Truck size={20} /> Delivery Option</h2>
                                <div className="radio-group">
                                    <label className={`radio-option ${formData.deliveryOption === 'delivery' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="deliveryOption"
                                            value="delivery"
                                            checked={formData.deliveryOption === 'delivery'}
                                            onChange={handleInputChange}
                                        />
                                        <span className="radio-label">
                                            <strong>Pickup &amp; Delivery</strong>
                                            <small>LKR {DELIVERY_FEE}.00 - We pick up and deliver to your door</small>
                                        </span>
                                    </label>
                                    <label className={`radio-option ${formData.deliveryOption === 'pickup' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="deliveryOption"
                                            value="pickup"
                                            checked={formData.deliveryOption === 'pickup'}
                                            onChange={handleInputChange}
                                        />
                                        <span className="radio-label">
                                            <strong>Pickup Only</strong>
                                            <small>LKR {PICKUP_FEE}.00 - We pick up your order from you</small>
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Delivery Address - only show for home delivery */}
                            {formData.deliveryOption === 'delivery' && (
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
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>City</label>
                                            <select
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '0.875rem 1rem',
                                                    border: '1px solid #d4e4ec',
                                                    borderRadius: '4px',
                                                    fontSize: '1rem',
                                                    color: formData.city ? '#2d3748' : '#a0aec0',
                                                    background: 'white'
                                                }}
                                            >
                                                <option value="" disabled>Select your city</option>
                                                {Object.keys(CITY_POSTAL_MAP).map(city => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Postal Code</label>
                                            <input
                                                type="text"
                                                name="postalCode"
                                                value={formData.postalCode}
                                                readOnly
                                                placeholder="Auto-filled based on city"
                                                style={{ background: '#f7fafc', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Pickup Schedule */}
                            <div className="form-card">
                                <h2 className="section-title"><Calendar size={20} /> Pickup Schedule</h2>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Pickup Date</label>
                                        <input
                                            type="date"
                                            name="pickupDate"
                                            value={formData.pickupDate}
                                            onChange={handleInputChange}
                                            min={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Pickup Time</label>
                                        <select
                                            name="pickupTime"
                                            value={formData.pickupTime}
                                            onChange={handleInputChange}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.875rem 1rem',
                                                border: '1px solid #d4e4ec',
                                                borderRadius: '4px',
                                                fontSize: '1rem',
                                                color: formData.pickupTime ? '#2d3748' : '#a0aec0',
                                                background: 'white'
                                            }}
                                        >
                                            <option value="" disabled>Select time slot</option>
                                            <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM</option>
                                            <option value="12:00 PM - 03:00 PM">12:00 PM - 03:00 PM</option>
                                            <option value="03:00 PM - 06:00 PM">03:00 PM - 06:00 PM</option>
                                            <option value="06:00 PM - 09:00 PM">06:00 PM - 09:00 PM</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Special Instructions */}
                            <div className="form-card">
                                <h2 className="section-title">Special Instructions</h2>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <textarea
                                        name="specialInstructions"
                                        value={formData.specialInstructions}
                                        onChange={handleInputChange}
                                        placeholder="Any special instructions for your order? (optional)"
                                        rows={3}
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem 1rem',
                                            border: '1px solid #d4e4ec',
                                            borderRadius: '4px',
                                            fontSize: '1rem',
                                            fontFamily: 'inherit',
                                            resize: 'vertical',
                                        }}
                                    />
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
                                            <span>{item.name} {item.method ? `(${item.method})` : ''} x{item.quantity}</span>
                                            <span>LKR {(item.totalPrice || item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="summary-totals">
                                    <div className="summary-row">
                                        <span>Sub-total</span>
                                        <span>LKR {totalAmount.toFixed(2)}</span>
                                    </div>
                                    {formData.deliveryOption === 'delivery' && (
                                        <div className="summary-row">
                                            <span>Delivery Fee</span>
                                            <span>LKR {DELIVERY_FEE}.00</span>
                                        </div>
                                    )}
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
                            <h2 className="section-title">Payment Method</h2>

                            {/* Payment Methods */}
                            <div className="payment-methods">
                                <label
                                    className={`payment-method-option ${formData.paymentMethod === 'visa' ? 'selected' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'visa', cardNumber: '' }))}
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
                                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'mastercard', cardNumber: '' }))}
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

                                <label
                                    className={`payment-method-option ${formData.paymentMethod === 'amex' ? 'selected' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'amex', cardNumber: '' }))}
                                >
                                    <div className="method-icon amex-icon">
                                        <span className="amex-text">AMEX</span>
                                    </div>
                                    <span className="method-name">American Express</span>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="amex"
                                        checked={formData.paymentMethod === 'amex'}
                                        onChange={() => setFormData(prev => ({ ...prev, paymentMethod: 'amex' }))}
                                    />
                                </label>
                            </div>

                            {/* Card Details Form - only when card selected */}
                            {(formData.paymentMethod === 'visa' || formData.paymentMethod === 'mastercard' || formData.paymentMethod === 'amex') && (
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
                                            placeholder={formData.paymentMethod === 'amex' ? '1234 567890 12345' : '1234 5678 9012 3456'}
                                            maxLength={formData.paymentMethod === 'amex' ? 17 : 19}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Expiry Date</label>
                                            <input
                                                type="text"
                                                name="expireDate"
                                                value={formData.expireDate}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="MM/YY"
                                                maxLength="5"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>CVV</label>
                                            <input
                                                type="password"
                                                name="cvc"
                                                value={formData.cvc}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="•••"
                                                maxLength="3"
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
                            <button type="submit" className="btn-confirm-payment" disabled={submitting}>
                                {submitting ? (
                                    <>
                                        <Loader size={18} className="spin" />
                                        Placing Order...
                                    </>
                                ) : (
                                    <>
                                        CONFIRM PAYMENT
                                        <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
