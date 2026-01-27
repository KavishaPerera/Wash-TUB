import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
    // Navigations 
    const navigate = useNavigate();
    const [userName] = useState('Amandi');

    // Recent Orders Data
    const recentOrders = [
        { id: 'ORD-1234', service: 'Wash & Fold', date: 'Jan 20, 2026', status: 'Processing', amount: 'Rs.450' },
        { id: 'ORD-1233', service: 'Dry Cleaning', date: 'Jan 18, 2026', status: 'Completed', amount: 'Rs.850' },
        { id: 'ORD-1232', service: 'Iron & Press', date: 'Jan 15, 2026', status: 'Delivered', amount: 'Rs.300' },
        { id: 'ORD-1231', service: 'Wash & Fold', date: 'Jan 12, 2026', status: 'Completed', amount: 'Rs.500' },
    ];

    const getStatusClass = (status) => {
        return `status-${status.toLowerCase()}`;
    };

    const handleLogout = () => {
        // Handle logout logic
        navigate('/signin');
    };

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h2 className="logo">WashTub</h2>
                </div>

                <nav className="sidebar-nav">
                    <a href="#overview" className="nav-item active">
                        {/* <span className="nav-icon">📊</span> */}
                        <span>Overview</span>
                    </a>
                    <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/my-orders'); }}>
                        {/* <span className="nav-icon">📦</span> */}
                        <span>My Orders</span>
                    </a>
                    <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/new-order'); }}>
                        {/* <span className="nav-icon">➕</span> */}
                        <span>New Order</span>
                    </a>

                    <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/notifications'); }}>
                        {/* <span className="nav-icon">⚙️</span> */}
                        <span>Notifications</span>
                    </a>
                </nav>

                <button className="logout-btn" onClick={handleLogout}>
                    {/* <span className="nav-icon">🚪</span> */}
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Header */}
                <header className="dashboard-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h1>Welcome back!</h1>
                            <p>Manage your laundry orders and profile</p>
                        </div>
                        <div className="header-right">
                            <div className="notification-bell">
                                <span className="bell-icon">🔔</span>
                                <span className="notification-badge">3</span>
                            </div>
                            <button className="btn btn-primary" onClick={() => navigate('/new-order')}>
                                + New Order
                            </button>
                        </div>
                    </div>
                </header>

                {/* Stats Cards */}
                <section className="stats-section">
                    <div className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Total Orders</p>
                            <h3 className="stat-value">24</h3>
                            {/* <span className="stat-change positive">+3 this month</span> */}
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Active Orders</p>
                            <h3 className="stat-value">3</h3>
                            {/*<span className="stat-change">In progress</span>*/}
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Completed</p>
                            <h3 className="stat-value">21</h3>
                            {/*<span className="stat-change positive">87.5% success</span>*/}
                        </div>
                    </div>
                </section>

                {/* Recent Orders */}
                <section className="orders-section">
                    <div className="section-header">
                        <h2>Recent Orders</h2>
                        <a href="#all-orders" className="view-all">View All →</a>
                    </div>

                    <div className="orders-grid">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <span className="order-id">{order.id}</span>
                                    <span className={`order-status ${getStatusClass(order.status)}`}>{order.status}</span>
                                </div>
                                <div className="order-details">
                                    <h3>{order.service}</h3>
                                    <p>📅 {order.date}</p>
                                    <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                        💰 {order.amount}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                    <span className={`order-type type-${order.status === 'Processing' ? 'pickup' : 'delivery'}`}>
                                        {order.status === 'Processing' ? 'Pickup' : 'Delivery'}
                                    </span>
                                </div>
                                <div className="card-actions">
                                    <button className="btn-card-outline">Details</button>
                                    <button className="btn-card-primary">
                                        {order.status === 'Processing' ? 'Track Order' : 'View Receipt'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="quick-actions-section">
                    <div className="section-header">
                        <h2>Quick Actions</h2>
                    </div>
                    <div className="quick-actions-grid">
                        <div className="action-card">
                            <h3>Schedule Pickup</h3>
                            <p>Book a convenient time for pickup</p>
                            <button className="btn btn-secondary btn-small">Schedule</button>
                        </div>
                        <div className="action-card">
                            <h3>Payment Methods</h3>
                            <p>Manage your payment options</p>
                            <button className="btn btn-secondary btn-small">Manage</button>
                        </div>
                        <div className="action-card">
                            <h3>Addresses</h3>
                            <p>Update delivery locations</p>
                            <button className="btn btn-secondary btn-small">Update</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default CustomerDashboard;
