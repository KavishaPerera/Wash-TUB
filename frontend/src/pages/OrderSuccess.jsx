import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Check, Home, ClipboardList, ArrowLeft, Package } from 'lucide-react';
import './OrderSuccess.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const OrderSuccess = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    // Get values passed via navigate state (instant display)
    const orderNumber = location.state?.orderNumber || '';
    const total = location.state?.total || 0;

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API}/orders/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setOrder(data);
                }
            } catch (err) {
                console.error('Failed to fetch order:', err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchOrder();
    }, [id]);

    return (
        <div className="os-page">
            <div className="os-container">
                {/* Success Banner */}
                <div className="os-banner">
                    <div className="os-check-circle">
                        <Check size={44} strokeWidth={3} />
                    </div>
                    <h1 className="os-title">Order Placed Successfully!</h1>
                    <p className="os-subtitle">
                        Thank you for your order. We'll start processing it right away.
                    </p>
                </div>

                {/* Order Info Card */}
                <div className="os-card">
                    <div className="os-card-header">
                        <Package size={20} />
                        <span>Order Details</span>
                    </div>

                    <div className="os-info-grid">
                        <div className="os-info-item">
                            <span className="os-info-label">Order Number</span>
                            <span className="os-info-value highlight">
                                {order?.orderNumber || orderNumber || `#${id}`}
                            </span>
                        </div>
                        <div className="os-info-item">
                            <span className="os-info-label">Status</span>
                            <span className="os-status-badge">
                                {order?.status || 'Pending'}
                            </span>
                        </div>
                        <div className="os-info-item">
                            <span className="os-info-label">Total Amount</span>
                            <span className="os-info-value">
                                LKR {(order?.total || total || 0).toFixed(2)}
                            </span>
                        </div>
                        <div className="os-info-item">
                            <span className="os-info-label">Payment</span>
                            <span className="os-info-value">
                                {order?.payment_method || 'Cash on Delivery'}
                            </span>
                        </div>
                    </div>

                    {/* Order Items */}
                    {order?.items && order.items.length > 0 && (
                        <div className="os-items-section">
                            <h3 className="os-items-heading">Items Ordered</h3>
                            <div className="os-items-list">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="os-item-row">
                                        <div className="os-item-name">
                                            <span>{item.item_name}</span>
                                            {item.method && <small>{item.method}</small>}
                                        </div>
                                        <span className="os-item-qty">x{item.quantity}</span>
                                        <span className="os-item-price">
                                            LKR {parseFloat(item.subtotal).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pickup/Delivery Info */}
                    {order && (
                        <div className="os-delivery-info">
                            <div className="os-info-item">
                                <span className="os-info-label">Delivery Option</span>
                                <span className="os-info-value">
                                    {order.delivery_option === 'delivery' ? 'Home Delivery' : 'Self Pickup'}
                                </span>
                            </div>
                            {order.pickup_date && (
                                <div className="os-info-item">
                                    <span className="os-info-label">Pickup Date</span>
                                    <span className="os-info-value">
                                        {new Date(order.pickup_date).toLocaleDateString()} {order.pickup_time || ''}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="os-actions">
                    <button className="os-btn os-btn-primary" onClick={() => navigate('/customer-dashboard')}>
                        <Home size={18} />
                        Go to Dashboard
                    </button>
                    <button className="os-btn os-btn-secondary" onClick={() => navigate('/my-orders')}>
                        <ClipboardList size={18} />
                        View My Orders
                    </button>
                    <button className="os-btn os-btn-ghost" onClick={() => navigate('/pricing')}>
                        <ArrowLeft size={18} />
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
