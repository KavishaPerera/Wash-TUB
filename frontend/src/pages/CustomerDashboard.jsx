import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Bell, RefreshCw } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import './CustomerDashboard.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Friendly label mapping for backend status values
const STATUS_LABEL = {
    pending: 'Order Placed',
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

const TYPE_META = {
    order_received:     { icon: '📥' },
    order_confirmed:    { icon: '✅' },
    pickup_scheduled:   { icon: '📅' },
    picked_up:          { icon: '🧺' },
    processing:         { icon: '🔄' },
    order_ready:        { icon: '✅' },
    order_finished:     { icon: '✅' },
    out_for_delivery:   { icon: '🚚' },
    delivery_scheduled: { icon: '📦' },
    order_delivered:    { icon: '🏠' },
    order_cancelled:    { icon: '❌' },
};

const fmtTime = (isoString) => {
    if (!isoString) return '';
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

const CustomerDashboard = () => {
    const navigate = useNavigate();
    const { unreadCount, refreshUnreadCount } = useNotifications();
    const bellRef = useRef(null);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState('');

    // Bell popup state
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupNotifs, setPopupNotifs] = useState([]);
    const [popupLoading, setPopupLoading] = useState(false);
    const [bellRect, setBellRect] = useState(null);

    // Close popup when clicking outside the bell or the portal popup
    useEffect(() => {
        const handleClickOutside = (e) => {
            const popup = document.getElementById('notif-portal-popup');
            const clickedInsideBell = bellRef.current && bellRef.current.contains(e.target);
            const clickedInsidePopup = popup && popup.contains(e.target);
            if (!clickedInsideBell && !clickedInsidePopup) {
                setPopupOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchPopupNotifs = useCallback(async () => {
        setPopupLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API}/notifications`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setPopupNotifs(data.slice(0, 8));
            }
        } catch { /* silently ignore */ }
        finally { setPopupLoading(false); }
    }, []);

    const togglePopup = () => {
        const next = !popupOpen;
        if (next && bellRef.current) {
            setBellRect(bellRef.current.getBoundingClientRect());
        }
        setPopupOpen(next);
        if (next) fetchPopupNotifs();
    };

    const markOneRead = async (notif) => {
        if (notif.is_read) return;
        setPopupNotifs(prev =>
            prev.map(n => n.notification_id === notif.notification_id ? { ...n, is_read: 1 } : n)
        );
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API}/notifications/${notif.notification_id}/read`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            refreshUnreadCount();
        } catch { /* ignore */ }
    };

    const markAllRead = async () => {
        setPopupNotifs(prev => prev.map(n => ({ ...n, is_read: 1 })));
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API}/notifications/read-all`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            refreshUnreadCount();
        } catch { /* ignore */ }
    };

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
        <>
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
                        {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
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
                            <button className="refresh-btn" onClick={fetchOrders} disabled={loading} title="Refresh">
                                <RefreshCw size={18} strokeWidth={2} className={loading ? 'spin' : ''} />
                            </button>
                            <div className="notification-bell" ref={bellRef} onClick={togglePopup}>
                                <Bell size={22} strokeWidth={2} color="#1e293b" />
                                {unreadCount > 0 && (
                                    <span className="notification-badge">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
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

        {/* Notification popup — rendered via portal at body level to avoid stacking-context clipping */}
        {popupOpen && bellRect && createPortal(
            <div
                id="notif-portal-popup"
                className="notif-popup"
                style={{
                    position: 'fixed',
                    top: bellRect.bottom + 10,
                    right: window.innerWidth - bellRect.right,
                }}
            >
                <div className="notif-popup-header">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <button className="notif-popup-read-all" onClick={markAllRead}>
                            Mark all read
                        </button>
                    )}
                </div>

                <div className="notif-popup-list">
                    {popupLoading ? (
                        <div className="notif-popup-empty">Loading…</div>
                    ) : popupNotifs.length === 0 ? (
                        <div className="notif-popup-empty">No notifications yet.</div>
                    ) : (
                        popupNotifs.map(n => (
                            <div
                                key={n.notification_id}
                                className={`notif-popup-item${!n.is_read ? ' unread' : ''}`}
                                onClick={() => markOneRead(n)}
                            >
                                <span className="notif-popup-icon">
                                    {(TYPE_META[n.type] || { icon: '🔔' }).icon}
                                </span>
                                <div className="notif-popup-body">
                                    <p className="notif-popup-title">{n.title}</p>
                                    <p className="notif-popup-msg">{n.message}</p>
                                    <span className="notif-popup-time">{fmtTime(n.sent_at)}</span>
                                </div>
                                {!n.is_read && <span className="notif-popup-dot" />}
                            </div>
                        ))
                    )}
                </div>

                <div className="notif-popup-footer">
                    <button onClick={() => { setPopupOpen(false); navigate('/notifications'); }}>
                        View all notifications
                    </button>
                </div>
            </div>,
            document.body
        )}
        </>
    );
};

export default CustomerDashboard;
