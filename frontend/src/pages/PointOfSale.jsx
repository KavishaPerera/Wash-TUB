import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, CreditCard, ShoppingCart, Trash2, Plus, Minus, Search } from 'lucide-react';
import CustomizeModal from '../components/CustomizeModal';
import './PointOfSale.css';

const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'gents-casual', name: 'Gents Casual Wear' },
    { id: 'gents-formal', name: 'Gents Formal Wear' },
    { id: 'ladies-casual', name: 'Ladies Casual Wear' },
    { id: 'ladies-formal', name: 'Ladies Formal Wear' },
    { id: 'kids', name: 'Kids' },
    { id: 'household', name: 'Household' },
    { id: 'traditional', name: 'Traditional' }
];

const pricingItems = [
    // Gents Casual Wear
    { id: 1, name: 'T-Shirt', price: 150, category: 'gents-casual' },
    { id: 2, name: 'Shirt', price: 200, category: 'gents-casual' },
    { id: 3, name: 'Shorts', price: 180, category: 'gents-casual' },
    { id: 4, name: 'Jeans', price: 250, category: 'gents-casual' },
    { id: 5, name: 'Jacket', price: 400, category: 'gents-casual' },
    { id: 6, name: 'Hoodie', price: 350, category: 'gents-casual' },

    // Gents Formal Wear
    { id: 7, name: 'Suit (2 Pcs)', price: 800, category: 'gents-formal' },
    { id: 8, name: 'Suit (3 Pcs)', price: 1000, category: 'gents-formal' },
    { id: 9, name: 'Blazer', price: 500, category: 'gents-formal' },
    { id: 10, name: 'Formal Shirt', price: 250, category: 'gents-formal' },
    { id: 11, name: 'Formal Trousers', price: 300, category: 'gents-formal' },
    { id: 12, name: 'Tie', price: 100, category: 'gents-formal' },

    // Ladies Casual Wear
    { id: 13, name: 'Blouse', price: 200, category: 'ladies-casual' },
    { id: 14, name: 'T-Shirt', price: 150, category: 'ladies-casual' },
    { id: 15, name: 'Jeans', price: 250, category: 'ladies-casual' },
    { id: 16, name: 'Skirt', price: 220, category: 'ladies-casual' },
    { id: 17, name: 'Frock', price: 300, category: 'ladies-casual' },
    { id: 18, name: 'Jacket', price: 400, category: 'ladies-casual' },

    // Ladies Formal Wear
    { id: 19, name: 'Formal Dress', price: 450, category: 'ladies-formal' },
    { id: 20, name: 'Formal Blouse', price: 250, category: 'ladies-formal' },
    { id: 21, name: 'Formal Skirt', price: 280, category: 'ladies-formal' },
    { id: 22, name: 'Blazer', price: 500, category: 'ladies-formal' },
    { id: 23, name: 'Formal Trousers', price: 300, category: 'ladies-formal' },

    // Kids
    { id: 24, name: 'Kids T-Shirt', price: 100, category: 'kids' },
    { id: 25, name: 'Kids Shorts', price: 120, category: 'kids' },
    { id: 26, name: 'Kids Dress', price: 200, category: 'kids' },
    { id: 27, name: 'Kids Jeans', price: 180, category: 'kids' },
    { id: 28, name: 'School Uniform', price: 250, category: 'kids' },

    // Household
    { id: 29, name: 'Bed Sheet (S)', price: 200, category: 'household' },
    { id: 30, name: 'Bed Sheet (L)', price: 300, category: 'household' },
    { id: 31, name: 'Pillow Case', price: 80, category: 'household' },
    { id: 32, name: 'Bath Towel', price: 150, category: 'household' },
    { id: 33, name: 'Hand Towel', price: 80, category: 'household' },
    { id: 34, name: 'Curtain (Per Kg)', price: 400, category: 'household' },
    { id: 35, name: 'Table Cloth', price: 250, category: 'household' },
    { id: 36, name: 'Blanket', price: 500, category: 'household' },

    // Traditional
    { id: 37, name: 'Saree', price: 350, category: 'traditional' },
    { id: 38, name: 'Saree Blouse', price: 200, category: 'traditional' },
    { id: 39, name: 'Kurta', price: 250, category: 'traditional' },
    { id: 40, name: 'Salwar', price: 200, category: 'traditional' },
    { id: 41, name: 'Sherwani', price: 800, category: 'traditional' },
    { id: 42, name: 'Lehenga', price: 600, category: 'traditional' }
];

const PointOfSale = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('all');
    const [cart, setCart] = useState([]);
    const [customerDetails, setCustomerDetails] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const filteredItems = pricingItems.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    const handleAddToBasket = (customizedItem) => {
        // Create a unique ID for cart item since the same item can be added with different methods
        const cartItemUniqueId = `${customizedItem.id}-${customizedItem.method}-${Date.now()}`;

        const newItem = {
            ...customizedItem,
            cartId: cartItemUniqueId,
            price: customizedItem.totalPrice / customizedItem.quantity // Store unit price
        };

        const existingItemIndex = cart.findIndex(item =>
            item.id === newItem.id && item.method === newItem.method
        );

        if (existingItemIndex > -1) {
            const updatedCart = [...cart];
            updatedCart[existingItemIndex].quantity += newItem.quantity;
            setCart(updatedCart);
        } else {
            setCart([...cart, newItem]);
        }
    };

    const updateQuantity = (cartId, delta) => {
        setCart(cart.map(item => {
            if (item.cartId === cartId) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const removeFromCart = (cartId) => {
        setCart(cart.filter(item => item.cartId !== cartId));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleProcessPayment = () => {
        if (cart.length === 0) {
            alert('Cart is empty!');
            return;
        }
        if (!customerDetails.name || !customerDetails.phone || !customerDetails.email) {
            alert('Please enter customer details (Name, Email, Phone).');
            return;
        }
        alert(`Order created for ${customerDetails.name}! Total: LKR ${calculateTotal()}`);
        setCart([]);
        setCustomerDetails({ name: '', email: '', phone: '' });
    };

    return (
        <div className="pos-container">
            {/* Left Side - Service Selection (Pricing Style) */}
            <div className="pos-left-panel">
                <div className="pos-header-nav">
                    <div className="pos-title">
                        <h1>Point of Sale</h1>
                        <p>Select items to add to order</p>
                    </div>
                    <div className="pos-search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="category-tabs-container">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(category.id)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                <div className="pos-items-grid">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="pos-item-card" onClick={() => handleItemClick(item)}>
                            <div className="pos-item-info">
                                <div className="pos-item-details">
                                    <div className="pos-item-name">{item.name}</div>
                                    <div className="pos-item-price">LKR {item.price.toFixed(2)}</div>
                                </div>
                                <button className="pos-btn-add">
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side - Current Order Panel */}
            <div className="pos-right-panel">
                <div className="order-panel-header">
                    <h2>Current Order</h2>
                    <span className="item-count-badge">
                        {cart.reduce((acc, item) => acc + item.quantity, 0)} items
                    </span>
                </div>

                <div className="customer-section">
                    <h3><User size={16} /> Customer Details</h3>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Customer Name"
                            value={customerDetails.name}
                            onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={customerDetails.email}
                            onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={customerDetails.phone}
                            onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                        />
                    </div>
                </div>

                <div className="cart-content">
                    {cart.length === 0 ? (
                        <div className="empty-cart-state">
                            <ShoppingCart size={40} />
                            <p>Select items to add to order</p>
                        </div>
                    ) : (
                        <div className="cart-items-list">
                            {cart.map(item => (
                                <div key={item.cartId} className="cart-list-item">
                                    <div className="cart-item-info">
                                        <h4>{item.name}</h4>
                                        <div className="cart-item-meta">
                                            <span className="method-tag">{item.method}</span>
                                            <span className="cart-item-price">LKR {item.price}</span>
                                        </div>
                                    </div>
                                    <div className="cart-item-actions">
                                        <div className="qty-controls">
                                            <button onClick={() => updateQuantity(item.cartId, -1)}><Minus size={12} /></button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.cartId, 1)}><Plus size={12} /></button>
                                        </div>
                                        <button className="delete-btn" onClick={() => removeFromCart(item.cartId)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="order-panel-footer">
                    <div className="order-total">
                        <span>Total</span>
                        <span className="total-value">LKR {calculateTotal()}</span>
                    </div>
                    <button
                        className="process-payment-btn"
                        onClick={handleProcessPayment}
                        disabled={cart.length === 0}
                    >
                        <CreditCard size={20} />
                        Process Payment
                    </button>
                </div>
            </div>

            {/* Customization Modal */}
            {showModal && selectedItem && (
                <CustomizeModal
                    item={selectedItem}
                    onClose={handleCloseModal}
                    onAddToBasket={handleAddToBasket}
                />
            )}
        </div>
    );
};

export default PointOfSale;
