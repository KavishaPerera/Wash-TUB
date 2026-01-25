import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, User, CreditCard, Truck } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Checkout.css';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        deliveryOption: 'pickup',
        paymentMethod: 'card'
    });

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
    const deliveryFee = formData.deliveryOption === 'delivery' ? 200 : 0;
    const grandTotal = totalAmount + deliveryFee;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would submit the order
        alert('Order placed successfully!');
        navigate('/');
    };

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <div className="checkout-header">
                    <Link to="/cart" className="back-link">
                        <ArrowLeft size={20} />
                        Back to Basket
                    </Link>
                    <h1>Checkout</h1>
                </div>

                <form onSubmit={handleSubmit} className="checkout-content">
                    <div className="checkout-form">
                        <section className="form-section">
                            <h2><User size={20} /> Contact Details</h2>
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
                        </section>

                        <section className="form-section">
                            <h2><MapPin size={20} /> Delivery Address</h2>
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
                        </section>

                        <section className="form-section">
                            <h2><Truck size={20} /> Delivery Option</h2>
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
                                        <small>LKR 200.00 - Delivered to your door</small>
                                    </span>
                                </label>
                            </div>
                        </section>

                        <section className="form-section">
                            <h2><CreditCard size={20} /> Payment Method</h2>
                            <div className="radio-group">
                                <label className={`radio-option ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={formData.paymentMethod === 'card'}
                                        onChange={handleInputChange}
                                    />
                                    <span className="radio-label">
                                        <strong>Card Payment</strong>
                                        <small>Pay securely with card</small>
                                    </span>
                                </label>
                            </div>
                        </section>
                    </div>

                    <div className="order-summary">
                        <h2>Order Summary</h2>
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
                                <span>Subtotal</span>
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
                        <button type="submit" className="btn-place-order">
                            Place Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
