import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';

const StaffDashboard = () => {
    const navigate = useNavigate();
    const [staffName] = useState('Staff Member');

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
                    <Link to="/staff-dashboard" className="nav-item active">
                        <span>Overview</span>
                    </Link>
                    <Link to="/staff/pos" className="nav-item">
                        <span>Point of Sale</span>
                    </Link>
                    <a href="#completed" className="nav-item">
                        <span>Completed</span>
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
                            <h1>Welcome, {staffName}!</h1>
                            <p>Manage assigned orders and tasks</p>
                        </div>
                        <button className="btn btn-primary">
                            View All Tasks
                        </button>
                    </div>
                </header>

                {/* Stats Cards */}
                <section className="stats-section">
                    <div className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Assigned Orders</p>
                            <h3 className="stat-value">12</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">In Progress</p>
                            <h3 className="stat-value">5</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Completed Today</p>
                            <h3 className="stat-value">7</h3>
                        </div>
                    </div>
                </section>

                {/* Assigned Orders */}
                <section className="orders-section">
                    <div className="section-header">
                        <h2>Assigned Orders</h2>
                        <a href="#all-orders" className="view-all">View All →</a>
                    </div>

                    <div className="orders-table-container">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Service</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>ORD-1234</td>
                                    <td>Oshani Kavindya</td>
                                    <td>Wash & Fold</td>
                                    <td>Jan 21, 2026</td>
                                    <td><span className="status-badge status-processing">Processing</span></td>
                                    <td><button className="btn-action">Update</button></td>
                                </tr>
                                <tr>
                                    <td>ORD-1235</td>
                                    <td>Tilara sansiluni</td>
                                    <td>Dry Cleaning</td>
                                    <td>Jan 21, 2026</td>
                                    <td><span className="status-badge status-processing">Processing</span></td>
                                    <td><button className="btn-action">Update</button></td>
                                </tr>
                                <tr>
                                    <td>ORD-1236</td>
                                    <td>Tharindu Jayasinghe</td>
                                    <td>Iron & Press</td>
                                    <td>Jan 20, 2026</td>
                                    <td><span className="status-badge status-completed">Completed</span></td>
                                    <td><button className="btn-action">View</button></td>
                                </tr>
                                <tr>
                                    <td>ORD-1237</td>
                                    <td>Isahara Samarasinghe</td>
                                    <td>Wash & Fold</td>
                                    <td>Jan 20, 2026</td>
                                    <td><span className="status-badge status-delivered">Ready</span></td>
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
                            <h3>Update Order Status</h3>
                            <p>Mark orders as processed or ready</p>
                            <button className="btn btn-secondary btn-small">Update</button>
                        </div>
                        <div className="action-card">
                            <h3>View Schedule</h3>
                            <p>Check your work schedule</p>
                            <button className="btn btn-secondary btn-small">View</button>
                        </div>
                        <div className="action-card">
                            <h3>Report Issue</h3>
                            <p>Report any problems with orders</p>
                            <button className="btn btn-secondary btn-small">Report</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default StaffDashboard;
