import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Friendly label mapping for backend status values
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

const ACTIVE_STATUSES = ['pending', 'confirmed', 'pickup_scheduled', 'picked_up', 'processing', 'ready', 'out_for_delivery'];

const CustomerDashboard = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Read name from stored user info
        try {
            const stored = localStorage.getItem('user');
            if (stored) {
                const u = JSON.parse(stored);
                setUserName(u.first_name || u.name || '');
            }
        } catch (_) { }

        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API}/orders/my-orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to fetch orders');
            const data = await res.json();
            setOrders(data);
        } catch (err) {
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

    // ── Computed stats from real data ────────────────────────────────────
    const totalOrders = orders.length;
    const activeOrders = orders.filter(o => ACTIVE_STATUSES.includes(o.status)).length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;
    const recentOrders = orders.slice(0, 4); // already sorted newest-first by backend

    const fmtDate = (iso) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const statusClass = (status) => `status-${status?.replace(/_/g, '-')}`;

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h2 className="logo">WashTub</h2>
                </div>
                <nav className="sidebar-nav">
                    <a href="#overview" className="nav-item active">
                        <span>Overview</span>
                    </a>
                    <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/my-orders'); }}>
                        <span>My Orders</span>
                    </a>
                    <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/pricing'); }}>
                        <span>New Order</span>
                    </a>
                    <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/notifications'); }}>
                        <span>Notifications</span>
                    </a>
                </nav>
                <button className="logout-btn" onClick={handleLogout}>
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Header */}
                <header className="dashboard-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h1>Welcome back{userName ? `, ${userName}` : ''}!</h1>
                            <p>Manage your laundry orders and profile</p>
                        </div>
                        <div className="header-right">
                            <div className="notification-bell">
                                <span className="bell-icon">🔔</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Stats Cards */}
                <section className="stats-section">
                    <div className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Total Orders</p>
                            <h3 className="stat-value">{loading ? '—' : totalOrders}</h3>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Active Orders</p>
                            <h3 className="stat-value">{loading ? '—' : activeOrders}</h3>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Completed</p>
                            <h3 className="stat-value">{loading ? '—' : completedOrders}</h3>
                        </div>
                    </div>
                </section>

                {/* Recent Orders */}
                <section className="orders-section">
                    <div className="section-header">
                        <h2>Recent Orders</h2>
                        <button
                            className="view-all"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 600 }}
                            onClick={() => navigate('/my-orders')}
                        >
                            View All →
                        </button>
                    </div>

                    {loading && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                            Loading orders…
                        </div>
                    )}

                    {error && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
                            {error}
                            <button
                                onClick={fetchOrders}
                                style={{ marginLeft: '1rem', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {!loading && !error && recentOrders.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                            <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>You haven't placed any orders yet.</p>
                            <button className="btn btn-primary" onClick={() => navigate('/pricing')}>
                                Place Your First Order
                            </button>
                        </div>
                    )}

                    {!loading && !error && recentOrders.length > 0 && (
                        <div className="orders-grid">
                            {recentOrders.map((order) => (
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
                                        <p>📅 {fmtDate(order.created_at)}</p>
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
                                            className="btn-card-primary"
                                            onClick={() => navigate(`/my-orders`)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default CustomerDashboard;
