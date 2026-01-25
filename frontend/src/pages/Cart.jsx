import { useLocation, Link } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Cart.css';

const Cart = () => {
    const location = useLocation();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        if (location.state?.basket) {
            setCartItems(location.state.basket);
        }
    }, [location.state]);

    const removeItem = (index) => {
        const newItems = cartItems.filter((_, i) => i !== index);
        setCartItems(newItems);
    };

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.totalPrice || item.price), 0);
    const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-header">
                    <Link to="/pricing" className="back-link">
                        <ArrowLeft size={20} />
                        Back to Price List
                    </Link>
                    <h1>Your Basket</h1>
                </div>

                {cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <ShoppingCart size={64} />
                        <h2>Your basket is empty</h2>
                        <p>Add items from the Price List to get started</p>
                        <Link to="/pricing" className="btn-shop">
                            Browse Items
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="cart-items">
                            <div className="cart-items-header">
                                <span className="col-item">Item</span>
                                <span className="col-method">Method</span>
                                <span className="col-qty">Qty</span>
                                <span className="col-price">Price</span>
                                <span className="col-action"></span>
                            </div>
                            {cartItems.map((item, index) => (
                                <div key={index} className="cart-item">
                                    <div className="col-item">
                                        <span className="item-name">{item.name}</span>
                                    </div>
                                    <div className="col-method">
                                        <span className="item-method">{item.method || 'Wash & Dry'}</span>
                                    </div>
                                    <div className="col-qty">
                                        <span className="item-qty">{item.quantity || 1}</span>
                                    </div>
                                    <div className="col-price">
                                        <span className="item-price">LKR {(item.totalPrice || item.price).toFixed(2)}</span>
                                    </div>
                                    <div className="col-action">
                                        <button className="btn-remove" onClick={() => removeItem(index)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <div className="summary-row">
                                <span>Total Items:</span>
                                <span>{totalItems}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total Amount:</span>
                                <span>LKR {totalAmount.toFixed(2)}</span>
                            </div>
                            <button className="btn-checkout">
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;
