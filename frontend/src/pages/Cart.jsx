import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, itemCount, totalAmount, removeFromCart, updateQuantity } = useCart();

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-header">
                    <Link to="/pricing" className="back-link">
                        <ArrowLeft size={20} />
                        Back to Price List
                    </Link>
                    <h1>Your Basket</h1>
                    {cartItems.length > 0 && (
                        <span className="cart-badge">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                    )}
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
                                        <span className="item-method">{item.method || item.category || 'Wash & Dry'}</span>
                                    </div>
                                    <div className="col-qty">
                                        <div className="qty-controls">
                                            <button className="qty-btn" onClick={() => updateQuantity(index, item.quantity - 1)}>
                                                <Minus size={14} />
                                            </button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button className="qty-btn" onClick={() => updateQuantity(index, item.quantity + 1)}>
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-price">
                                        <span className="item-price">LKR {(item.totalPrice || item.price * item.quantity).toFixed(2)}</span>
                                        {item.quantity > 1 && (
                                            <span className="item-unit-price">LKR {item.price.toFixed(2)} each</span>
                                        )}
                                    </div>
                                    <div className="col-action">
                                        <button className="btn-remove" onClick={() => removeFromCart(index)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <div className="summary-row">
                                <span>Total Items:</span>
                                <span>{itemCount}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total Amount:</span>
                                <span>LKR {totalAmount.toFixed(2)}</span>
                            </div>
                            <button className="btn-checkout" onClick={() => navigate('/checkout')}>
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
