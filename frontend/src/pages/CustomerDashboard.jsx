import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
    // Navigations 
    const navigate = useNavigate();
    const [userName] = useState('Amandi');

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
                    <a href="#orders" className="nav-item">
                        {/* <span className="nav-icon">📦</span> */}
                        <span>My Orders</span>
                    </a>
                    <a href="#new-order" className="nav-item">
                        {/* <span className="nav-icon">➕</span> */}
                        <span>New Order</span>
                    </a>
                    <a href="#profile" className="nav-item">
                        {/* <span className="nav-icon">👤</span> */}
                        <span>Profile</span>
                    </a>
                    <a href="#notifications" className="nav-item">
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
                            <button className="btn btn-primary">
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

                    <div className="orders-table-container">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Service</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Amount</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>ORD-1234</td>
                                    <td>Wash & Fold</td>
                                    <td>Jan 20, 2026</td>
                                    <td><span className="status-badge status-processing">Processing</span></td>
                                    <td>Rs.450</td>
                                    <td><button className="btn-action">Track</button></td>
                                </tr>
                                <tr>
                                    <td>ORD-1233</td>
                                    <td>Dry Cleaning</td>
                                    <td>Jan 18, 2026</td>
                                    <td><span className="status-badge status-completed">Completed</span></td>
                                    <td>Rs.850</td>
                                    <td><button className="btn-action">View</button></td>
                                </tr>
                                <tr>
                                    <td>ORD-1232</td>
                                    <td>Iron & Press</td>
                                    <td>Jan 15, 2026</td>
                                    <td><span className="status-badge status-delivered">Delivered</span></td>
                                    <td>Rs.300</td>
                                    <td><button className="btn-action">View</button></td>
                                </tr>
                                <tr>
                                    <td>ORD-1231</td>
                                    <td>Wash & Fold</td>
                                    <td>Jan 12, 2026</td>
                                    <td><span className="status-badge status-completed">Completed</span></td>
                                    <td>Rs.500</td>
                                    <td><button className="btn-action">View</button></td>
                                </tr>
                            </tbody>
                        </table>
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
