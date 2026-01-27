import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomizeModal from '../components/CustomizeModal';
import './Pricing.css';

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

const Pricing = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('all');
    const [basket, setBasket] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const filteredItems = activeCategory === 'all'
        ? pricingItems
        : pricingItems.filter(item => item.category === activeCategory);

    const handleAddClick = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    const handleAddToBasket = (customizedItem) => {
        setBasket([...basket, customizedItem]);
    };

    const totalAmount = basket.reduce((sum, item) => sum + (item.totalPrice || item.price), 0);

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
                        {filteredItems.map((item) => (
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
                        ))}
                    </div>
                </div>
            </section>

            {/* Floating Basket Footer */}
            {basket.length > 0 && (
                <div className="basket-footer">
                    <div className="basket-total">
                        Total : LKR {totalAmount.toFixed(2)}
                    </div>
                    <button className="btn-basket" onClick={() => navigate('/cart', { state: { basket } })}>
                        Your Basket ({basket.length})
                    </button>
                </div>
            )}

            <Footer />

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

export default Pricing;
