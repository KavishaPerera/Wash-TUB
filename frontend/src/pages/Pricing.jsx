import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomizeModal from '../components/CustomizeModal';
import { useCart } from '../context/CartContext';
import './Pricing.css';

const API_URL = 'http://localhost:5000/api';
const PREFERRED_CATEGORIES = ['Wash & Dry', 'Ironing', 'Dry Cleaning', 'Pressing'];

const getCategoryName = (description) => (description || '').trim() || 'Other';

const Pricing = () => {
    const navigate = useNavigate();
    const { cartItems, itemCount, totalAmount, addToCart } = useCart();
    const [activeCategory, setActiveCategory] = useState('all');
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    const fetchServices = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_URL}/services`);
            const data = await res.json();

            if (res.ok && data.success) {
                setServices(Array.isArray(data.services) ? data.services : []);
            } else {
                setError(data.message || 'Failed to load services.');
            }
        } catch {
            setError('Unable to connect to the server.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchServices(); }, [fetchServices]);

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

    const pricingItems = useMemo(() => {
        return services
            .filter(s => typeof s.price === 'number')
            .map(s => ({
                id: s.id,
                name: s.name,
                price: s.price,
                category: getCategoryName(s.description),
                unitType: s.unitType,
            }));
    }, [services]);

    // Group items by name so we only show one card per item name
    const uniqueItems = useMemo(() => {
        const grouped = new Map();
        
        // If a specific category is selected, only consider items in that category
        const itemsToGroup = activeCategory === 'all' 
            ? pricingItems 
            : pricingItems.filter(item => item.category === activeCategory);

        itemsToGroup.forEach(item => {
            if (!grouped.has(item.name)) {
                grouped.set(item.name, item);
            } else {
                // If we already have this item, we might want to show the lowest price
                // or just keep the first one we found. Let's keep the lowest price.
                const existing = grouped.get(item.name);
                if (item.price < existing.price) {
                    grouped.set(item.name, item);
                }
            }
        });

        return Array.from(grouped.values());
    }, [pricingItems, activeCategory]);

    const handleAddClick = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    const handleAddToBasket = (customizedItem) => {
        addToCart(customizedItem);
        setToastMsg(`${customizedItem.name} added to basket`);
        setTimeout(() => setToastMsg(''), 2500);
    };

    return (
        <div className="pricing-page">
            <Navbar />

            {/* Hero Section */}
            <section className="pricing-hero">
                <div className="pricing-hero-content">
                    <h1>Detailed <span className="gradient-text">Pricing</span></h1>
                    <p>Transparent and affordable rates for all your laundry needs</p>
                </div>
            </section>

            {/* Main Content */}
            <section className="pricing-section">
                <div className="pricing-container">

                    {error && (
                        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 20px', borderRadius: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{error}</span>
                            <button onClick={fetchServices} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Retry</button>
                        </div>
                    )}

                    {/* Category Tabs */}
                    <div className="category-tabs">
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

                    {/* Items Grid */}
                    <div className="items-grid">
                        {loading ? (
                            <div className="item-card" style={{ gridColumn: '1 / -1' }}>
                                <div className="item-info" style={{ justifyContent: 'center' }}>
                                    <div className="item-name" style={{ margin: 0 }}>Loading services...</div>
                                </div>
                            </div>
                        ) : (
                            uniqueItems.map((item) => (
                                <div key={item.id} className="item-card">
                                    <div className="item-info">
                                        <div className="item-details">
                                            <div className="item-name">{item.name}</div>
                                            <div className="item-price">LKR {item.price.toFixed(2)}</div>
                                        </div>
                                        <button
                                            className="btn-add"
                                            onClick={() => handleAddClick(item)}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}

                        {!loading && !error && uniqueItems.length === 0 && (
                            <div className="item-card" style={{ gridColumn: '1 / -1' }}>
                                <div className="item-info" style={{ justifyContent: 'center' }}>
                                    <div className="item-name" style={{ margin: 0 }}>No services found.</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Floating Basket Footer */}
            {itemCount > 0 && (
                <div className="basket-footer">
                    <div className="basket-total">
                        Total : LKR {totalAmount.toFixed(2)}
                    </div>
                    <button className="btn-basket" onClick={() => navigate('/cart')}>
                        Your Basket ({itemCount})
                    </button>
                </div>
            )}

            {/* Toast Notification */}
            {toastMsg && (
                <div className="pricing-toast">{toastMsg}</div>
            )}

            <Footer />

            {showModal && selectedItem && (
                <CustomizeModal
                    item={selectedItem}
                    allServices={pricingItems}
                    onClose={handleCloseModal}
                    onAddToBasket={handleAddToBasket}
                />
            )}
        </div>
    );
};

export default Pricing;
