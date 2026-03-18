import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CreditCard, ShoppingCart, Trash2, Plus, Minus, Search, Printer, X, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import CustomizeModal from '../components/CustomizeModal';
import './PointOfSale.css';

const API_BASE = 'http://localhost:5000/api';
const PREFERRED_CATEGORIES = ['Wash & Dry', 'Ironing', 'Dry Cleaning', 'Pressing'];

const getCategoryName = (description) => (description || '').trim() || 'Other';

const PointOfSale = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('all');
    const [cart, setCart] = useState([]);
    const [customerDetails, setCustomerDetails] = useState({
        firstName: '',
        lastName: '',
        phone: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    // Service items from API
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [fetchError, setFetchError] = useState('');

    // Modal state
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Payment Logic State
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [amountGiven, setAmountGiven] = useState('');
    const [finalOrderData, setFinalOrderData] = useState(null);

    // Manual discount state
    const [discountType, setDiscountType] = useState('percentage');
    const [discountValue, setDiscountValue] = useState('');
    const [discountReason, setDiscountReason] = useState('');

    // API submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Get auth token
    const getToken = () => {
        return localStorage.getItem('token') || sessionStorage.getItem('token');
    };

    // Fetch services from API on mount (same logic as Pricing page)
    const fetchServices = useCallback(async () => {
        setLoadingServices(true);
        setFetchError('');
        try {
            const res = await fetch(`${API_BASE}/services`);
            const data = await res.json();

            if (res.ok && data.success) {
                setServices(Array.isArray(data.services) ? data.services : []);
            } else {
                setFetchError(data.message || 'Failed to load services.');
            }
        } catch {
            setFetchError('Unable to connect to the server.');
        } finally {
            setLoadingServices(false);
        }
    }, []);

    useEffect(() => { fetchServices(); }, [fetchServices]);

    // Build dynamic categories from service descriptions (same as Pricing page)
    const categories = useMemo(() => {
        const available = new Set(services.map(s => getCategoryName(s.description)));

        const ordered = [
            ...PREFERRED_CATEGORIES.filter(c => available.has(c)),
            ...Array.from(available).filter(c => !PREFERRED_CATEGORIES.includes(c)).sort((a, b) => a.localeCompare(b))
        ];

        return [
            { id: 'all', name: 'All Items' },
            ...ordered.map(c => ({ id: c, name: c }))
        ];
    }, [services]);

    // Map services to pricing items (same as Pricing page)
    const pricingItems = useMemo(() => {
        return services
            .filter(s => typeof s.price === 'number')
            .map(s => ({
                id: s.id,
                serviceId: s.id,
                name: s.name,
                price: s.price,
                category: getCategoryName(s.description),
                unitType: s.unitType,
            }));
    }, [services]);

    // Group items by name, show one card per unique item (same as Pricing page)
    const uniqueItems = useMemo(() => {
        const grouped = new Map();

        const itemsToGroup = activeCategory === 'all'
            ? pricingItems
            : pricingItems.filter(item => item.category === activeCategory);

        itemsToGroup.forEach(item => {
            if (!grouped.has(item.name)) {
                grouped.set(item.name, item);
            } else {
                const existing = grouped.get(item.name);
                if (item.price < existing.price) {
                    grouped.set(item.name, item);
                }
            }
        });

        let results = Array.from(grouped.values());
        if (searchTerm.trim()) {
            const query = searchTerm.trim().toLowerCase();
            results = results.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query)
            );
        }

        return results;
    }, [pricingItems, activeCategory, searchTerm]);

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    const handleAddToBasket = (customizedItem) => {
        const newItem = {
            ...customizedItem,
            cartId: `${customizedItem.id}-${customizedItem.method}-${Date.now()}`,
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

    const calculateSubtotal = () =>
        cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const calculateDiscount = () => {
        const subtotal = calculateSubtotal();
        const val = parseFloat(discountValue) || 0;
        if (val <= 0) return 0;
        if (discountType === 'percentage') return Math.min((subtotal * val) / 100, subtotal);
        return Math.min(val, subtotal);
    };

    const calculateTotal = () => calculateSubtotal() - calculateDiscount();

    const handleProcessPaymentClick = () => {
        if (cart.length === 0) {
            alert('Cart is empty!');
            return;
        }
        if (!customerDetails.firstName || !customerDetails.lastName || !customerDetails.phone) {
            alert('Please enter all customer details (First Name, Last Name, Phone).');
            return;
        }

        setSubmitError('');
        setIsPaymentModalOpen(true);
    };

    const handleConfirmPayment = async () => {
        const subtotal = calculateSubtotal();
        const discountAmt = calculateDiscount();
        const total = calculateTotal();
        const paid = parseFloat(amountGiven);

        if (isNaN(paid) || paid < total) {
            alert('Please enter a valid amount greater than or equal to the total.');
            return;
        }

        if (discountAmt > 0 && !discountReason) {
            const confirmed = window.confirm('No discount reason selected. Continue without a reason?');
            if (!confirmed) return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            const token = getToken();
            const orderItems = cart.map(item => ({
                serviceId: item.serviceId || null,
                name: item.name,
                method: item.method || null,
                unitType: item.unitType || 'ITEM',
                price: item.price,
                quantity: item.quantity,
                totalPrice: item.price * item.quantity,
            }));

            const res = await fetch(`${API_BASE}/orders/pos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    customer: customerDetails,
                    items: orderItems,
                    paymentMethod: 'cash',
                    amountGiven: paid,
                    discount: discountAmt,
                    discountReason: discountReason || null,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to create order');
            }

            // Order saved successfully
            const orderData = {
                orderNumber: data.orderNumber,
                customer: customerDetails,
                items: cart,
                subtotal,
                discountAmount: discountAmt,
                discountReason: discountReason || null,
                totalAmount: total,
                amountGiven: paid,
                balance: paid - total,
                date: new Date().toLocaleString(),
            };

            setFinalOrderData(orderData);
            setIsPaymentModalOpen(false);
            setIsReceiptOpen(true);

        } catch (error) {
            setSubmitError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseReceipt = () => {
        setIsReceiptOpen(false);
        setCart([]);
        setCustomerDetails({ firstName: '', lastName: '', phone: '' });
        setAmountGiven('');
        setFinalOrderData(null);
        setSubmitError('');
        setDiscountValue('');
        setDiscountReason('');
        setDiscountType('percentage');
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
                            placeholder="Search items... (e.g. T-shirt, Saree, Trouser)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button className="pos-search-clear" onClick={() => setSearchTerm('')}>&times;</button>
                        )}
                    </div>
                </div>

                {fetchError && (
                    <div className="pos-fetch-error">
                        <span>{fetchError}</span>
                        <button onClick={fetchServices}>Retry</button>
                    </div>
                )}

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
                    {loadingServices ? (
                        <div className="pos-item-card" style={{ gridColumn: '1 / -1' }}>
                            <div className="pos-item-info" style={{ justifyContent: 'center' }}>
                                <div className="pos-item-name">Loading services...</div>
                            </div>
                        </div>
                    ) : uniqueItems.length === 0 ? (
                        <div className="pos-item-card" style={{ gridColumn: '1 / -1' }}>
                            <div className="pos-item-info" style={{ justifyContent: 'center' }}>
                                <div className="pos-item-name">No services found.</div>
                            </div>
                        </div>
                    ) : (
                        uniqueItems.map((item) => (
                            <div key={item.id} className="pos-item-card" onClick={() => handleItemClick(item)}>
                                <div className="pos-item-info">
                                    <div className="pos-item-details">
                                        <div className="pos-item-name">{item.name}</div>
                                        <div className="pos-item-price">LKR {item.price.toFixed(2)}</div>
                                    </div>
                                    <button className="pos-btn-add">
                                        Add
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
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

                {/* Manual Discount Section */}
                {cart.length > 0 && (
                    <div className="pos-discount-section">
                        <div className="pos-discount-header">
                            <span>Manual Discount</span>
                            <div className="pos-discount-type-toggle">
                                <button
                                    className={discountType === 'percentage' ? 'active' : ''}
                                    onClick={() => { setDiscountType('percentage'); setDiscountValue(''); }}
                                    type="button"
                                >%</button>
                                <button
                                    className={discountType === 'fixed' ? 'active' : ''}
                                    onClick={() => { setDiscountType('fixed'); setDiscountValue(''); }}
                                    type="button"
                                >LKR</button>
                            </div>
                        </div>
                        <input
                            type="number"
                            className="pos-discount-input"
                            placeholder={discountType === 'percentage' ? 'e.g. 10' : 'e.g. 200'}
                            value={discountValue}
                            onChange={e => setDiscountValue(e.target.value)}
                            min="0"
                            max={discountType === 'percentage' ? 100 : undefined}
                        />
                        <select
                            className="pos-discount-reason"
                            value={discountReason}
                            onChange={e => setDiscountReason(e.target.value)}
                        >
                            <option value="">-- Reason (optional) --</option>
                            <option value="Customer Loyalty">Customer Loyalty</option>
                            <option value="Complaint Resolution">Complaint Resolution</option>
                            <option value="Special Day Promotion">Special Day Promotion</option>
                            <option value="End-of-Day Offer">End-of-Day Offer</option>
                        </select>
                        {calculateDiscount() > 0 && (
                            <div className="pos-discount-preview">
                                Discount: -LKR {calculateDiscount().toFixed(2)}
                            </div>
                        )}
                    </div>
                )}

                <div className="order-panel-footer">
                    <div className="order-total">
                        <span>Total</span>
                        <span className="total-value">LKR {calculateTotal().toFixed(2)}</span>
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
                    allServices={pricingItems}
                    onClose={handleCloseModal}
                    onAddToBasket={handleAddToBasket}
                />
            )}

            {/* Payment Input Modal */}
            {isPaymentModalOpen && (
                <div className="overlay">
                    <div className="payment-modal">
                        <h2>Payment Details</h2>
                        {calculateDiscount() > 0 && (
                            <>
                                <div className="input-group">
                                    <label>Subtotal: <strong>LKR {calculateSubtotal().toFixed(2)}</strong></label>
                                </div>
                                <div className="input-group pos-discount-line">
                                    <label>Discount ({discountReason || 'Manual'}): <strong style={{ color: '#e53e3e' }}>-LKR {calculateDiscount().toFixed(2)}</strong></label>
                                </div>
                            </>
                        )}
                        <div className="input-group">
                            <label>Total Amount: <strong>LKR {calculateTotal().toFixed(2)}</strong></label>
                        </div>
                        <div className="input-group">
                            <label>Amount Given (LKR)</label>
                            <input
                                type="number"
                                value={amountGiven}
                                onChange={(e) => setAmountGiven(e.target.value)}
                                placeholder="Enter amount..."
                                autoFocus
                                disabled={isSubmitting}
                            />
                        </div>
                        {amountGiven && (
                            <div className="input-group">
                                <label>Balance: <strong>LKR {(parseFloat(amountGiven) - calculateTotal()).toFixed(2)}</strong></label>
                            </div>
                        )}
                        {submitError && (
                            <div className="pos-error-msg">
                                <AlertCircle size={16} />
                                <span>{submitError}</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button className="btn btn-secondary" onClick={() => { setIsPaymentModalOpen(false); setSubmitError(''); }} style={{ flex: 1 }} disabled={isSubmitting}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleConfirmPayment} style={{ flex: 1 }} disabled={isSubmitting}>
                                {isSubmitting ? <><Loader size={16} className="spin" /> Saving...</> : 'Confirm & Generate Receipt'}
                            </button>
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
                                {finalOrderData.orderNumber && (
                                    <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Order #: {finalOrderData.orderNumber}</p>
                                )}
                                <p>{finalOrderData.date}</p>
                                <p>Customer: {finalOrderData.customer.firstName} {finalOrderData.customer.lastName}</p>
                                <p>Phone: {finalOrderData.customer.phone}</p>
                            </div>

                            <div className="receipt-items">
                                {finalOrderData.items.map((item, idx) => (
                                    <div className="receipt-item" key={idx}>
                                        <span>{item.name} {item.method ? `(${item.method})` : ''} x{item.quantity}</span>
                                        <span>LKR {(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            {finalOrderData.discountAmount > 0 && (
                                <>
                                    <div className="receipt-summary">
                                        <span>Subtotal:</span>
                                        <span>LKR {finalOrderData.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="receipt-summary discount-line">
                                        <span>Discount ({finalOrderData.discountReason || 'Manual'}):</span>
                                        <span>-LKR {finalOrderData.discountAmount.toFixed(2)}</span>
                                    </div>
                                </>
                            )}
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

                            <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                                <CheckCircle size={16} style={{ color: '#38a169', marginBottom: '0.25rem' }} />
                                <p style={{ fontSize: '0.9rem', margin: '0.15rem 0' }}>Payment Received - Thank You!</p>
                                <p style={{ fontSize: '0.9rem', margin: '0.15rem 0' }}>Please come again.</p>
                            </div>
                        </div>

                        <div className="receipt-actions">
                            <button className="btn btn-primary" onClick={handlePrintReceipt} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                                <Printer size={14} style={{ marginRight: '5px' }} /> Print Receipt
                            </button>
                            <button className="btn btn-secondary" onClick={handleCloseReceipt} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                                New Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PointOfSale;
