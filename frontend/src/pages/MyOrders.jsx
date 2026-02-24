import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STATUS_LABEL = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    pickup_scheduled: 'Pickup Scheduled',
    picked_up: 'Picked Up',
    processing: 'Processing',
    ready: 'Ready',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

// Map backend statuses to filter tabs
const FILTER_MAP = {
    all: null,
    active: ['pending', 'confirmed', 'pickup_scheduled', 'picked_up', 'processing', 'ready', 'out_for_delivery'],
    delivered: ['delivered'],
    cancelled: ['cancelled'],
};

const MyOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');

    // Selected order for detail modal
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API}/orders/my-orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setOrders(data);
        } catch {
            setError('Could not load orders. Please refresh.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/signin');
    };

    const filteredOrders = (() => {
        const allowed = FILTER_MAP[activeFilter];
        if (!allowed) return orders;
        return orders.filter(o => allowed.includes(o.status));
    })();

    const fmtDate = (iso) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const statusClass = (s) => `status-${s?.replace(/_/g, '-')}`;

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h2 className="logo">WashTub</h2>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/customer-dashboard" className="nav-item">
                        <span>Overview</span>
                    </Link>
                    <a href="#" className="nav-item active">
                        <span>My Orders</span>
                    </a>
                    <Link to="/pricing" className="nav-item">
                        <span>New Order</span>
                    </Link>
                    <Link to="/notifications" className="nav-item">
                        <span>Notifications</span>
                    </Link>
                </nav>
                <button className="logout-btn" onClick={handleLogout}>
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h1>My Orders</h1>
                            <p>View and track all your laundry orders</p>
                        </div>
                    </div>
                </header>

                {/* Filter Tabs */}
                <div className="filter-tabs">
                    {[
                        { key: 'all', label: 'All Orders' },
                        { key: 'active', label: 'Active' },
                        { key: 'delivered', label: 'Delivered' },
                        { key: 'cancelled', label: 'Cancelled' },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            className={`filter-tab ${activeFilter === key ? 'active' : ''}`}
                            onClick={() => setActiveFilter(key)}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Orders Grid */}
                <section className="orders-section">
                    {loading && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                            Loading orders…
                        </div>
                    )}

                    {error && (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
                            <button onClick={fetchOrders} className="btn btn-primary btn-small">Retry</button>
                        </div>
                    )}

                    {!loading && !error && filteredOrders.length === 0 && (
                        <div className="no-orders">
                            <span className="no-orders-icon">📦</span>
                            <h3>No orders found</h3>
                            <p>
                                {activeFilter === 'all'
                                    ? "You haven't placed any orders yet."
                                    : `You don't have any ${activeFilter} orders.`}
                            </p>
                            {activeFilter === 'all' && (
                                <button className="btn btn-primary" onClick={() => navigate('/pricing')}>
                                    Place Your First Order
                                </button>
                            )}
                        </div>
                    )}

                    {!loading && !error && filteredOrders.length > 0 && (
                        <div className="orders-grid">
                            {filteredOrders.map((order) => (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">
                                        <span className="order-id">{order.order_number}</span>
                                        <span className={`order-status ${statusClass(order.status)}`}>
                                            {STATUS_LABEL[order.status] || order.status}
                                        </span>
                                    </div>

                                    <div className="order-details">
                                        <h3>
                                            {order.items && order.items.length > 0
                                                ? order.items.map(i => i.item_name).join(', ')
                                                : 'Laundry Order'}
                                        </h3>
                                        <p>📦 {order.items?.length ?? 0} item{order.items?.length !== 1 ? 's' : ''}</p>
                                        <p>📅 {fmtDate(order.created_at)}</p>
                                        {order.pickup_date && (
                                            <p>🗓 Pickup: {fmtDate(order.pickup_date)} {order.pickup_time && `at ${order.pickup_time}`}</p>
                                        )}
                                        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                            💰 LKR {parseFloat(order.total).toFixed(2)}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                        <span className={`order-type type-${order.delivery_option}`}>
                                            {order.delivery_option === 'delivery' ? 'Home Delivery' : 'Self Pickup'}
                                        </span>
                                    </div>

                                    <div className="card-actions">
                                        <button
                                            className="btn-card-outline"
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* ── Order Detail Modal ─────────────────────────────────────── */}
            {selectedOrder && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '580px', boxShadow: '0 24px 64px rgba(0,0,0,0.18)', overflow: 'hidden', animation: 'modalSlideUp 0.25s ease both' }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h2 style={{ margin: '0 0 0.4rem', fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                                    {selectedOrder.order_number}
                                </h2>
                                <span className={`order-status ${statusClass(selectedOrder.status)}`}>
                                    {STATUS_LABEL[selectedOrder.status] || selectedOrder.status}
                                </span>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', width: 36, height: 36, cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>✕</button>
                        </div>

                        {/* Meta */}
                        <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.88rem', color: '#475569' }}>
                            <span>📅 Placed: {fmtDate(selectedOrder.created_at)}</span>
                            <span>🚚 {selectedOrder.delivery_option === 'delivery' ? 'Home Delivery' : 'Self Pickup'}</span>
                            <span>💳 {selectedOrder.payment_method?.replace(/_/g, ' ')}</span>
                            {selectedOrder.pickup_date && <span>🗓 Pickup: {fmtDate(selectedOrder.pickup_date)} {selectedOrder.pickup_time || ''}</span>}
                        </div>

                        {/* Items Table */}
                        <div style={{ padding: '1.25rem 1.5rem' }}>
                            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Items</p>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                        <th style={{ textAlign: 'left', padding: '0.4rem 0.6rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Item</th>
                                        <th style={{ textAlign: 'left', padding: '0.4rem 0.6rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Qty</th>
                                        <th style={{ textAlign: 'left', padding: '0.4rem 0.6rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Price</th>
                                        <th style={{ textAlign: 'left', padding: '0.4rem 0.6rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(selectedOrder.items || []).map((item, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                            <td style={{ padding: '0.65rem 0.6rem', color: '#1e293b', fontWeight: 500 }}>{item.item_name}</td>
                                            <td style={{ padding: '0.65rem 0.6rem', color: '#475569' }}>{item.quantity}</td>
                                            <td style={{ padding: '0.65rem 0.6rem', color: '#475569' }}>LKR {parseFloat(item.price).toFixed(2)}</td>
                                            <td style={{ padding: '0.65rem 0.6rem', color: '#1e293b', fontWeight: 600 }}>LKR {parseFloat(item.subtotal).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div style={{ padding: '1rem 1.5rem 1.5rem', borderTop: '2px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: '#64748b', fontSize: '0.9rem' }}>
                                <span>Subtotal</span><span>LKR {parseFloat(selectedOrder.subtotal).toFixed(2)}</span>
                            </div>
                            {parseFloat(selectedOrder.delivery_fee) > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: '#64748b', fontSize: '0.9rem' }}>
                                    <span>Delivery Fee</span><span>LKR {parseFloat(selectedOrder.delivery_fee).toFixed(2)}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: '1px solid #e2e8f0' }}>
                                <span>Total</span>
                                <span style={{ color: '#0284c7' }}>LKR {parseFloat(selectedOrder.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
