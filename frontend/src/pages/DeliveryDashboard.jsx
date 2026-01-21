import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css'; // Reusing the same premium styling

const DeliveryDashboard = () => {
    const navigate = useNavigate();
    const [driverName] = useState('Alex Driver');

    const handleLogout = () => {
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
                        <span>Overview</span>
                    </a>
                    <a href="#active-deliveries" className="nav-item">
                        <span>Active Deliveries</span>
                    </a>
                    <a href="#history" className="nav-item">
                        <span>Delivery History</span>
                    </a>
                    <a href="#earnings" className="nav-item">
                        <span>Earnings</span>
                    </a>
                    <a href="#profile" className="nav-item">
                        <span>Profile</span>
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
                        <div>
                            <h1>Welcome, {driverName}!</h1>
                            <p>Manage your deliveries and route</p>
                        </div>
                        <button className="btn btn-primary">
                            Go Online
                        </button>
                    </div>
                </header>

                {/* Stats Cards */}
                <section className="stats-section">
                    <div className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Deliveries Today</p>
                            <h3 className="stat-value">8</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Pending</p>
                            <h3 className="stat-value">3</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Total Earnings</p>
                            <h3 className="stat-value">Rs. 1,200</h3>
                        </div>
                    </div>
                </section>

                {/* Current Deliveries / Tasks */}
                <section className="orders-section">
                    <div className="section-header">
                        <h2>Today's Deliveries</h2>
                        <a href="#all-deliveries" className="view-all">View All →</a>
                    </div>

                    <div className="orders-table-container">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Address</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>ORD-1240</td>
                                    <td>Alice Brown</td>
                                    <td>123 Main St, Apt 4</td>
                                    <td>Pickup</td>
                                    <td><span className="status-badge status-processing">Assigned</span></td>
                                    <td><button className="btn-action">Start</button></td>
                                </tr>
                                <tr>
                                    <td>ORD-1239</td>
                                    <td>David Green</td>
                                    <td>456 Oak Ave</td>
                                    <td>Delivery</td>
                                    <td><span className="status-badge status-processing">In Transit</span></td>
                                    <td><button className="btn-action">Complete</button></td>
                                </tr>
                                <tr>
                                    <td>ORD-1238</td>
                                    <td>Emily White</td>
                                    <td>789 Pine Ln</td>
                                    <td>Pickup</td>
                                    <td><span className="status-badge status-completed">Completed</span></td>
                                    <td><button className="btn-action">View</button></td>
                                </tr>
                                <tr>
                                    <td>ORD-1235</td>
                                    <td>Jane Smith</td>
                                    <td>321 Elm St</td>
                                    <td>Delivery</td>
                                    <td><span className="status-badge status-completed">Completed</span></td>
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
                            <h3>Update Status</h3>
                            <p>Update delivery status</p>
                            <button className="btn btn-secondary btn-small">Update</button>
                        </div>
                        <div className="action-card">
                            <h3>Route Map</h3>
                            <p>View optimal route</p>
                            <button className="btn btn-secondary btn-small">View Map</button>
                        </div>
                        <div className="action-card">
                            <h3>Contact Support</h3>
                            <p>Get help with issues</p>
                            <button className="btn btn-secondary btn-small">Contact</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DeliveryDashboard;
