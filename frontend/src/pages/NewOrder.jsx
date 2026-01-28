import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import CustomizeModal from '../components/CustomizeModal';
import './NewOrder.css';

// Service catalog data
const serviceItems = [
    { id: 1, name: 'T-Shirt', price: 150.00, category: 'gents-casual' },
    { id: 2, name: 'Shirt', price: 200.00, category: 'gents-casual' },
    { id: 3, name: 'Shorts', price: 180.00, category: 'gents-casual' },
    { id: 4, name: 'Jeans', price: 250.00, category: 'gents-casual' },
    { id: 5, name: 'Jacket', price: 400.00, category: 'gents-casual' },
    { id: 6, name: 'Hoodie', price: 350.00, category: 'gents-casual' },
    { id: 7, name: 'Suit (2 Pcs)', price: 800.00, category: 'gents-formal' },
    { id: 8, name: 'Suit (3 Pcs)', price: 1000.00, category: 'gents-formal' },
    { id: 9, name: 'Blazer', price: 450.00, category: 'gents-formal' },
    { id: 10, name: 'Dress Shirt', price: 220.00, category: 'gents-formal' },
    { id: 11, name: 'Dress', price: 300.00, category: 'ladies-casual' },
    { id: 12, name: 'Blouse', price: 180.00, category: 'ladies-casual' },
    { id: 13, name: 'Skirt', price: 200.00, category: 'ladies-casual' },
    { id: 14, name: 'Scarf', price: 100.00, category: 'ladies-casual' },
    { id: 15, name: 'Evening Gown', price: 600.00, category: 'ladies-formal' },
    { id: 16, name: 'Cocktail Dress', price: 450.00, category: 'ladies-formal' },
    { id: 17, name: 'Business Suit', price: 700.00, category: 'ladies-formal' },
    { id: 18, name: 'Kids T-Shirt', price: 100.00, category: 'kids' },
    { id: 19, name: 'Kids Pants', price: 120.00, category: 'kids' },
    { id: 20, name: 'Kids Dress', price: 150.00, category: 'kids' },
    { id: 21, name: 'Bedsheet', price: 250.00, category: 'household' },
    { id: 22, name: 'Curtain', price: 300.00, category: 'household' },
    { id: 23, name: 'Pillow Cover', price: 80.00, category: 'household' },
    { id: 24, name: 'Saree', price: 350.00, category: 'traditional' },
    { id: 25, name: 'Lungi', price: 120.00, category: 'traditional' },
];

const categories = [
    { id: 'all', label: 'ALL ITEMS' },
    { id: 'gents-casual', label: 'GENTS CASUAL WEAR' },
    { id: 'gents-formal', label: 'GENTS FORMAL WEAR' },
    { id: 'ladies-casual', label: 'LADIES CASUAL WEAR' },
    { id: 'ladies-formal', label: 'LADIES FORMAL WEAR' },
    { id: 'kids', label: 'KIDS' },
    { id: 'household', label: 'HOUSEHOLD' },
    { id: 'traditional', label: 'TRADITIONAL' },
];

const NewOrder = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState('catalog'); // 'catalog', 'basket', 'delivery'
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [basket, setBasket] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showCustomizeModal, setShowCustomizeModal] = useState(false);

    // Delivery form data
    const [deliveryData, setDeliveryData] = useState({
        fullName: '',
        phoneNumber: '',
        deliveryOption: 'self-pickup', // 'self-pickup' or 'home-delivery'
        pickupDate: '',
        pickupTime: '',
        address: ''
    });

    // Filter items based on selected category
    const filteredItems = selectedCategory === 'all'
        ? serviceItems
        : serviceItems.filter(item => item.category === selectedCategory);

    // Handle add button click
    const handleAddClick = (item) => {
        setSelectedItem(item);
        setShowCustomizeModal(true);
    };

    // Add item to basket
    const handleAddToBasket = (customizedItem) => {
        setBasket([...basket, { ...customizedItem, basketId: Date.now() }]);
        setShowCustomizeModal(false);
    };

    // Remove item from basket
    const handleRemoveFromBasket = (basketId) => {
        setBasket(basket.filter(item => item.basketId !== basketId));
    };

    // Calculate totals
    const totalItems = basket.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = basket.reduce((sum, item) => sum + item.totalPrice, 0);
    const deliveryFee = deliveryData.deliveryOption === 'home-delivery' ? 200.00 : 0;
    const total = subtotal + deliveryFee;

    // Handle delivery form changes
    const handleDeliveryChange = (e) => {
        const { name, value } = e.target;
        setDeliveryData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle final order submission
    const handlePlaceOrder = () => {
        // Validate delivery details
        if (!deliveryData.fullName || !deliveryData.phoneNumber || !deliveryData.pickupDate || !deliveryData.pickupTime) {
            alert('Please fill in all required fields');
            return;
        }

        if (deliveryData.deliveryOption === 'home-delivery' && !deliveryData.address) {
            alert('Please enter your delivery address');
            return;
        }

        // Create order object
        const orderData = {
            items: basket,
            delivery: deliveryData,
            total: total,
            createdAt: new Date().toISOString()
        };

        console.log('Order placed:', orderData);
        alert('Order placed successfully!');
        navigate('/customer-dashboard');
    };

    return (
        <div className="new-order-page">
            {/* Catalog View */}
            {currentStep === 'catalog' && (
                <div className="catalog-container">
                    <div className="catalog-header">
                        <Link to="/customer-dashboard" className="back-link">
                            <ArrowLeft size={20} />
                            <span>Back to Dashboard</span>
                        </Link>
                        <h1>Select Services</h1>
                        {basket.length > 0 && (
                            <button
                                className="view-basket-btn"
                                onClick={() => setCurrentStep('basket')}
                            >
                                View Basket ({basket.length})
                            </button>
                        )}
                    </div>

                    {/* Category Filter */}
                    <div className="category-filter">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category.id)}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>

                    {/* Service Items Grid */}
                    <div className="services-grid">
                        {filteredItems.map(item => (
                            <div key={item.id} className="service-item-card">
                                <div className="service-item-info">
                                    <h3>{item.name}</h3>
                                    <p className="service-item-price">LKR {item.price.toFixed(2)}</p>
                                </div>
                                <button
                                    className="add-btn"
                                    onClick={() => handleAddClick(item)}
                                >
                                    Add
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Basket View */}
            {currentStep === 'basket' && (
                <div className="basket-container">
                    <div className="basket-header">
                        <button
                            className="back-link"
                            onClick={() => setCurrentStep('catalog')}
                        >
                            <ArrowLeft size={20} />
                            <span>Back to Price List</span>
                        </button>
                    </div>

                    <h1>Your Basket</h1>

                    {basket.length > 0 ? (
                        <>
                            <div className="basket-table">
                                <div className="basket-table-header">
                                    <div className="col-item">ITEM</div>
                                    <div className="col-method">METHOD</div>
                                    <div className="col-qty">QTY</div>
                                    <div className="col-price">PRICE</div>
                                    <div className="col-action"></div>
                                </div>
                                {basket.map(item => (
                                    <div key={item.basketId} className="basket-table-row">
                                        <div className="col-item">{item.name}</div>
                                        <div className="col-method">{item.method}</div>
                                        <div className="col-qty">{item.quantity}</div>
                                        <div className="col-price">LKR {item.totalPrice.toFixed(2)}</div>
                                        <div className="col-action">
                                            <button
                                                className="remove-btn"
                                                onClick={() => handleRemoveFromBasket(item.basketId)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="basket-summary">
                                <div className="summary-row">
                                    <span>Total Items:</span>
                                    <span>{totalItems}</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total Amount:</span>
                                    <span>LKR {subtotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                className="checkout-btn"
                                onClick={() => setCurrentStep('delivery')}
                            >
                                Proceed to Checkout
                            </button>
                        </>
                    ) : (
                        <div className="empty-basket">
                            <p>Your basket is empty</p>
                            <button
                                className="btn-primary"
                                onClick={() => setCurrentStep('catalog')}
                            >
                                Browse Services
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Delivery Details View */}
            {currentStep === 'delivery' && (
                <div className="delivery-container">
                    <div className="delivery-header">
                        <h1>Delivery Details</h1>
                        <div className="step-indicator">
                            <span className="step active">1. Delivery</span>
                            <span className="step">2. Payment</span>
                        </div>
                    </div>

                    <div className="delivery-content">
                        <div className="delivery-form-section">
                            {/* Contact Details */}
                            <div className="form-card">
                                <h2>
                                    <span className="icon">👤</span>
                                    Contact Details
                                </h2>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={deliveryData.fullName}
                                        onChange={handleDeliveryChange}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={deliveryData.phoneNumber}
                                        onChange={handleDeliveryChange}
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>

                            {/* Delivery Option */}
                            <div className="form-card">
                                <h2>
                                    <span className="icon">🚚</span>
                                    Delivery Option
                                </h2>
                                <div className="delivery-options">
                                    <label className="delivery-option-card">
                                        <input
                                            type="radio"
                                            name="deliveryOption"
                                            value="self-pickup"
                                            checked={deliveryData.deliveryOption === 'self-pickup'}
                                            onChange={handleDeliveryChange}
                                        />
                                        <div className="option-content">
                                            <h3>Self Pickup</h3>
                                            <p>Free - Pick up from our store</p>
                                        </div>
                                    </label>
                                    <label className="delivery-option-card">
                                        <input
                                            type="radio"
                                            name="deliveryOption"
                                            value="home-delivery"
                                            checked={deliveryData.deliveryOption === 'home-delivery'}
                                            onChange={handleDeliveryChange}
                                        />
                                        <div className="option-content">
                                            <h3>Home Delivery</h3>
                                            <p>LKR 200.00 - Deliver to your doorstep</p>
                                        </div>
                                    </label>
                                </div>

                                {deliveryData.deliveryOption === 'home-delivery' && (
                                    <div className="form-group">
                                        <label>Delivery Address</label>
                                        <textarea
                                            name="address"
                                            value={deliveryData.address}
                                            onChange={handleDeliveryChange}
                                            placeholder="Enter your complete delivery address"
                                            rows="3"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Pickup Schedule */}
                            <div className="form-card">
                                <h2>
                                    <span className="icon">📅</span>
                                    Pickup Schedule
                                </h2>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Pickup Date</label>
                                        <input
                                            type="date"
                                            name="pickupDate"
                                            value={deliveryData.pickupDate}
                                            onChange={handleDeliveryChange}
                                            placeholder="mm/dd/yyyy"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Pickup Time</label>
                                        <select
                                            name="pickupTime"
                                            value={deliveryData.pickupTime}
                                            onChange={handleDeliveryChange}
                                        >
                                            <option value="">Select time slot</option>
                                            <option value="09:00-11:00">09:00 AM - 11:00 AM</option>
                                            <option value="11:00-13:00">11:00 AM - 01:00 PM</option>
                                            <option value="14:00-16:00">02:00 PM - 04:00 PM</option>
                                            <option value="16:00-18:00">04:00 PM - 06:00 PM</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="order-summary-sidebar">
                            <div className="summary-card">
                                <h2>Order Summary</h2>

                                <div className="summary-items">
                                    {basket.map(item => (
                                        <div key={item.basketId} className="summary-item">
                                            <span>{item.name} x{item.quantity}</span>
                                            <span>LKR {item.totalPrice.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="summary-divider"></div>

                                <div className="summary-calculations">
                                    <div className="calc-row">
                                        <span>Sub-total</span>
                                        <span>LKR {subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="calc-row">
                                        <span>Delivery Fee</span>
                                        <span>LKR {deliveryFee.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="summary-divider"></div>

                                <div className="summary-total">
                                    <span>Total</span>
                                    <span>LKR {total.toFixed(2)}</span>
                                </div>

                                <button
                                    className="proceed-payment-btn"
                                    onClick={handlePlaceOrder}
                                >
                                    Proceed to Payment →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Customize Modal */}
            {showCustomizeModal && selectedItem && (
                <CustomizeModal
                    item={selectedItem}
                    onClose={() => setShowCustomizeModal(false)}
                    onAddToBasket={handleAddToBasket}
                />
            )}
        </div>
    );
};

export default NewOrder;
