import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Checkout.css';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [formData, setFormData] = useState({
        paymentMethod: 'card',
        cardName: '',
        cardNumber: '',
        expireDate: '',
        cvc: ''
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
    const discounts = 0;
    const grandTotal = totalAmount - discounts;

    const handleSubmit = (e) => {
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

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <form onSubmit={handleSubmit} className="checkout-content">
                    {/* Payment Options Section */}
                    <div className="payment-form-section">
                        <div className="payment-card">
                            <h2 className="section-title">Payment Option</h2>

                            {/* Payment Method - Debit/Credit Card Only */}
                            <div className="payment-methods">
                                <label
                                    className="payment-method-option selected"
                                >
                                    <div className="method-icon card-icon">
                                        <div className="card-stripes"></div>
                                    </div>
                                    <span className="method-name">Debit/Credit Card</span>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={true}
                                        readOnly
                                    />
                                </label>
                            </div>

                            {/* Card Details Form - Only show when card is selected */}
                            {formData.paymentMethod === 'card' && (
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
                            <h2 className="totals-title">Card Totals</h2>
                            <div className="totals-content">
                                <div className="totals-row">
                                    <span className="totals-label">Sub-total</span>
                                    <span className="totals-value">LKR {totalAmount.toFixed(0) || 1320}</span>
                                </div>
                                <div className="totals-row">
                                    <span className="totals-label">Discounts</span>
                                    <span className="totals-value discount">{discounts}</span>
                                </div>
                                <div className="totals-row total-final">
                                    <span className="totals-label">Total</span>
                                    <span className="totals-value total-amount">LKR {grandTotal.toFixed(0) || 1320}</span>
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
