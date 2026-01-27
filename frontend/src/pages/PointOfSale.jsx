import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CreditCard, ShoppingCart, Trash2, Plus, Minus, Search, Printer, X } from 'lucide-react';
import CustomizeModal from '../components/CustomizeModal';
import './PointOfSale.css';

// ... (Constants categories and pricingItems remain the same - abbreviated for brevity)
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
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Payment Logic State
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [amountGiven, setAmountGiven] = useState('');
    const [finalOrderData, setFinalOrderData] = useState(null);

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
        const cartItemUniqueId = `${customizedItem.id}-${customizedItem.method}-${Date.now()}`;
        const newItem = {
            ...customizedItem,
            cartId: cartItemUniqueId,
            price: customizedItem.totalPrice / customizedItem.quantity
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

    const handleProcessPaymentClick = () => {
        if (cart.length === 0) {
            alert('Cart is empty!');
            return;
        }
        if (!customerDetails.firstName || !customerDetails.lastName || !customerDetails.phone || !customerDetails.email) {
            alert('Please enter all customer details (First Name, Last Name, Email, Phone).');
            return;
        }

        // Open Payment Input Modal
        setIsPaymentModalOpen(true);
    };

    const handleConfirmPayment = () => {
        const total = calculateTotal();
        const paid = parseFloat(amountGiven);

        if (isNaN(paid) || paid < total) {
            alert('Please enter a valid amount greater than or equal to the total.');
            return;
        }

        // Prepare Final Data
        const orderData = {
            customer: customerDetails,
            items: cart,
            totalAmount: total,
            amountGiven: paid,
            balance: paid - total,
            date: new Date().toLocaleString()
        };

        setFinalOrderData(orderData);
        setIsPaymentModalOpen(false);
        setIsReceiptOpen(true);
    };

    const handleCloseReceipt = () => {
        setIsReceiptOpen(false);
        setCart([]);
        setCustomerDetails({ firstName: '', lastName: '', email: '', phone: '' });
        setAmountGiven('');
        setFinalOrderData(null);
    };

    const handlePrintReceipt = () => {
        window.print();
    };

    return (
        <div className="pos-container">
            {/* Left Side */}
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

            {/* Right Side */}
            <div className="pos-right-panel">
                <div className="order-panel-header">
                    <h2>Current Order</h2>
                    <span className="item-count-badge">
                        {cart.reduce((acc, item) => acc + item.quantity, 0)} items
                    </span>
                </div>

                <div className="customer-section">
                    <h3><User size={16} /> Customer Details</h3>
                    <div className="name-inputs-row" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={customerDetails.firstName}
                                onChange={(e) => setCustomerDetails({ ...customerDetails, firstName: e.target.value })}
                            />
                        </div>
                        <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={customerDetails.lastName}
                                onChange={(e) => setCustomerDetails({ ...customerDetails, lastName: e.target.value })}
                            />
                        </div>
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
                        onClick={handleProcessPaymentClick}
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

            {/* Payment Input Modal */}
            {isPaymentModalOpen && (
                <div className="overlay">
                    <div className="payment-modal">
                        <h2>Payment Details</h2>
                        <div className="input-group">
                            <label>Total Amount: <strong>LKR {calculateTotal()}</strong></label>
                        </div>
                        <div className="input-group">
                            <label>Amount Given (LKR)</label>
                            <input
                                type="number"
                                value={amountGiven}
                                onChange={(e) => setAmountGiven(e.target.value)}
                                placeholder="Enter amount..."
                                autoFocus
                            />
                        </div>
                        {amountGiven && (
                            <div className="input-group">
                                <label>Balance: <strong>LKR {(parseFloat(amountGiven) - calculateTotal()).toFixed(2)}</strong></label>
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button className="btn btn-secondary" onClick={() => setIsPaymentModalOpen(false)} style={{ flex: 1 }}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleConfirmPayment} style={{ flex: 1 }}>Generate Receipt</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Receipt Modal */}
            {isReceiptOpen && finalOrderData && (
                <div className="overlay">
                    <div className="receipt-modal">
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="no-print">
                            <button onClick={handleCloseReceipt} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <div className="receipt-container" id="receipt-content">
                            <div className="receipt-header">
                                <h2>Wash Tub Laundry</h2>
                                <p>478/A, Pannipitiya Rd, Pelawatta</p>
                                <p>Tel: +94 11 452 8476</p>
                                <br />
                                <p>{finalOrderData.date}</p>
                                <p>Customer: {finalOrderData.customer.firstName} {finalOrderData.customer.lastName}</p>
                            </div>

                            <div className="receipt-items">
                                {finalOrderData.items.map((item, idx) => (
                                    <div className="receipt-item" key={idx}>
                                        <span>{item.name} (x{item.quantity})</span>
                                        <span>{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="receipt-summary">
                                <span>Total Amount:</span>
                                <span>LKR {finalOrderData.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="receipt-summary">
                                <span>Cash:</span>
                                <span>LKR {finalOrderData.amountGiven.toFixed(2)}</span>
                            </div>
                            <div className="receipt-summary">
                                <span>Balance:</span>
                                <span>LKR {finalOrderData.balance.toFixed(2)}</span>
                            </div>

                            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                <p>Thank You!</p>
                                <p>Please come again.</p>
                            </div>
                        </div>

                        <div className="receipt-actions">
                            <button className="btn btn-primary" onClick={handlePrintReceipt} style={{ width: '100%' }}>
                                <Printer size={18} style={{ marginRight: '8px' }} /> Print Receipt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PointOfSale;
