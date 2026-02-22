import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css'; // Use shared dashboard styles
import './Notifications.css'; // Additional notification-specific styles

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'received',
            orderId: 'ORD-1234',
            title: 'Order Received',
            message: 'Your order has been received and is awaiting pickup.',
            time: '2 hours ago',
            read: false,
            icon: '📥'
        },
        {
            id: 2,
            type: 'processing',
            orderId: 'ORD-1234',
            title: 'Order Processing',
            message: 'Your laundry is now being processed. Estimated completion: 24 hours.',
            time: '1 hour ago',
            read: false,
            icon: '🔄'
        },
        {
            id: 3,
            type: 'completed',
            orderId: 'ORD-1233',
            title: 'Order Completed',
            message: 'Your laundry has been cleaned and is ready for delivery!',
            time: '5 hours ago',
            read: true,
            icon: '✅'
        },
        {
            id: 4,
            type: 'delivered',
            orderId: 'ORD-1232',
            title: 'Order Delivered',
            message: 'Your order has been successfully delivered. Thank you for choosing WashTub!',
            time: '1 day ago',
            read: true,
            icon: '🚚'
        },
        {
            id: 5,
            type: 'received',
            orderId: 'ORD-1231',
            title: 'Order Received',
            message: 'Your order has been received and is awaiting pickup.',
            time: '2 days ago',
            read: true,
            icon: '📥'
        },
        {
            id: 6,
            type: 'processing',
            orderId: 'ORD-1231',
            title: 'Order Processing',
            message: 'Your laundry is now being processed.',
            time: '2 days ago',
            read: true,
            icon: '🔄'
        },
        {
            id: 7,
            type: 'completed',
            orderId: 'ORD-1231',
            title: 'Order Completed',
            message: 'Your laundry has been cleaned and is ready for delivery!',
            time: '1 day ago',
            read: true,
            icon: '✅'
        },
        {
            id: 8,
            type: 'delivered',
            orderId: 'ORD-1231',
            title: 'Order Delivered',
            message: 'Your order has been successfully delivered.',
            time: '1 day ago',
            read: true,
            icon: '🚚'
        }
    ]);

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
    };

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); sessionStorage.removeItem('token'); sessionStorage.removeItem('user'); navigate('/signin'); };

    const getTypeClass = (type) => {
        const typeClasses = {
            received: 'notif-received',
            processing: 'notif-processing',
            completed: 'notif-completed',
            delivered: 'notif-delivered'
        };
        return typeClasses[type] || '';
    };

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
                    <Link to="/new-order" className="nav-item">
                        <span>New Order</span>
                    </Link>
                    <a href="#" className="nav-item active">
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

                {/* Notification Stats */}
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

                {/* Notifications List */}
                <section className="notifications-list">
                    {notifications.length > 0 ? (
                        notifications.map(notification => (
                            <div
                                key={notification.id}
                                className={`notification-card ${getTypeClass(notification.type)} ${!notification.read ? 'unread' : ''}`}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <div className="notif-icon">
                                    {notification.icon}
                                </div>
                                <div className="notif-content">
                                    <div className="notif-header-row">
                                        <h3 className="notif-title">{notification.title}</h3>
                                        <span className="notif-order-id">{notification.orderId}</span>
                                    </div>
                                    <p className="notif-message">{notification.message}</p>
                                    <span className="notif-time">{notification.time}</span>
                                </div>
                                <div className="notif-actions">
                                    {!notification.read && (
                                        <span className="unread-dot"></span>
                                    )}
                                    <button
                                        className="btn-delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteNotification(notification.id);
                                        }}
                                        title="Delete notification"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-notifications">
                            <span className="no-notif-icon">🔔</span>
                            <h3>No notifications</h3>
                            <p>You're all caught up! New notifications will appear here.</p>
                        </div>
                    )}
                </section>

                {/* Legend */}
                <section className="notification-legend">
                    <h4>Notification Types</h4>
                    <div className="legend-items">
                        <div className="legend-item">
                            <span className="legend-icon">📥</span>
                            <span>Order Received</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-icon">🔄</span>
                            <span>Processing</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-icon">✅</span>
                            <span>Completed</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-icon">🚚</span>
                            <span>Delivered</span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Notifications;
