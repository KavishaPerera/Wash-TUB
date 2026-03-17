import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import './CustomerDashboard.css';
import './Notifications.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TYPE_META = {
    order_received:     { icon: '📥', css: 'notif-received' },
    order_confirmed:    { icon: '✅', css: 'notif-received' },
    pickup_scheduled:   { icon: '📅', css: 'notif-processing' },
    picked_up:          { icon: '🧺', css: 'notif-processing' },
    processing:         { icon: '🔄', css: 'notif-processing' },
    order_ready:        { icon: '✅', css: 'notif-completed' },
    order_finished:     { icon: '✅', css: 'notif-completed' },
    out_for_delivery:   { icon: '🚚', css: 'notif-delivered' },
    delivery_scheduled: { icon: '📦', css: 'notif-delivered' },
    order_delivered:    { icon: '🏠', css: 'notif-delivered' },
    order_cancelled:    { icon: '❌', css: 'notif-cancelled' },
    promotion:          { icon: '🎁', css: 'notif-promo' },
};

const fmtTime = (isoString) => {
    if (!isoString) return '';
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
};

const Notifications = () => {
    const navigate = useNavigate();
    const { refreshUnreadCount } = useNotifications();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = () => localStorage.getItem('token');

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API}/notifications`, {
                headers: { Authorization: `Bearer ${token()}` },
            });
            if (!res.ok) throw new Error('Failed to load notifications');
            const data = await res.json();
            setNotifications(data);
        } catch (err) {
            setError('Could not load notifications. Please refresh.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const markAsRead = async (notificationId) => {
        // Optimistic update
        setNotifications(prev =>
            prev.map(n => n.notification_id === notificationId ? { ...n, is_read: 1 } : n)
        );
        try {
            await fetch(`${API}/notifications/${notificationId}/read`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token()}` },
            });
            refreshUnreadCount();
        } catch {
            // revert on failure
            setNotifications(prev =>
                prev.map(n => n.notification_id === notificationId ? { ...n, is_read: 0 } : n)
            );
        }
    };

    const markAllAsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
        try {
            await fetch(`${API}/notifications/read-all`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token()}` },
            });
            refreshUnreadCount();
        } catch {
            fetchNotifications();
        }
    };

    const deleteNotification = async (e, notificationId) => {
        e.stopPropagation();
        setNotifications(prev => prev.filter(n => n.notification_id !== notificationId));
        try {
            await fetch(`${API}/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token()}` },
            });
            refreshUnreadCount();
        } catch {
            fetchNotifications();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/signin');
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const getMeta = (type) => TYPE_META[type] || { icon: '🔔', css: '' };

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
                    <Link to="/my-orders" className="nav-item">
                        <span>My Orders</span>
                    </Link>
                    <Link to="/pricing" className="nav-item">
                        <span>New Order</span>
                    </Link>
                    <a href="#" className="nav-item active">
                        <span>Notifications</span>
                        {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
                    </a>
                    <Link to="/profile" className="nav-item">
                        <span>Profile</span>
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
                            <h1>Notifications</h1>
                            <p>Stay updated on your order status</p>
                        </div>
                        <div className="header-right">
                            {unreadCount > 0 && (
                                <button className="btn btn-secondary btn-small" onClick={markAllAsRead}>
                                    Mark All as Read
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Stats */}
                {!loading && !error && (
                    <div className="notif-stats">
                        <div className="stat-item">
                            <span className="stat-number">{notifications.length}</span>
                            <span className="stat-label">Total</span>
                        </div>
                        <div className="stat-item unread">
                            <span className="stat-number">{unreadCount}</span>
                            <span className="stat-label">Unread</span>
                        </div>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                        Loading notifications…
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
                        {error}
                        <button
                            onClick={fetchNotifications}
                            style={{ marginLeft: '1rem', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Notifications List */}
                {!loading && !error && (
                    <section className="notifications-list">
                        {notifications.length > 0 ? (
                            notifications.map(notification => {
                                const meta = getMeta(notification.type);
                                return (
                                    <div
                                        key={notification.notification_id}
                                        className={`notification-card ${meta.css} ${!notification.is_read ? 'unread' : ''}`}
                                        onClick={() => !notification.is_read && markAsRead(notification.notification_id)}
                                    >
                                        <div className="notif-icon">{meta.icon}</div>
                                        <div className="notif-content">
                                            <div className="notif-header-row">
                                                <h3 className="notif-title">{notification.title}</h3>
                                                {notification.order_id && (
                                                    <span className="notif-order-id">#{notification.order_id}</span>
                                                )}
                                            </div>
                                            <p className="notif-message">{notification.message}</p>
                                            <span className="notif-time">{fmtTime(notification.sent_at)}</span>
                                        </div>
                                        <div className="notif-actions">
                                            {!notification.is_read && <span className="unread-dot"></span>}
                                            <button
                                                className="btn-delete"
                                                onClick={(e) => deleteNotification(e, notification.notification_id)}
                                                title="Delete notification"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="no-notifications">
                                <span className="no-notif-icon">🔔</span>
                                <h3>No notifications</h3>
                                <p>You're all caught up! New notifications will appear here.</p>
                            </div>
                        )}
                    </section>
                )}

                {/* Legend */}
                <section className="notification-legend">
                    <h4>Notification Types</h4>
                    <div className="legend-items">
                        <div className="legend-item"><span className="legend-icon">📥</span><span>Order Received</span></div>
                        <div className="legend-item"><span className="legend-icon">🔄</span><span>Processing</span></div>
                        <div className="legend-item"><span className="legend-icon">✅</span><span>Finished</span></div>
                        <div className="legend-item"><span className="legend-icon">🚚</span><span>Out for Delivery</span></div>
                        <div className="legend-item"><span className="legend-icon">🏠</span><span>Delivered</span></div>
                        <div className="legend-item"><span className="legend-icon">🎁</span><span>Promotion</span></div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Notifications;
