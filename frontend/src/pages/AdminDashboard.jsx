import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css'; // Reusing the same premium styling

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [adminName] = useState('Admin');

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
                    <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/user-management'); }}>
                        <span>User Management</span>
                    </a>
                    <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/all-orders'); }}>
                        <span>All Orders</span>
                    </a>
                    <a href="#reports" className="nav-item">
                        <span>Reports</span>
                    </a>
                    <a href="#settings" className="nav-item">
                        <span>System Settings</span>
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
                            <h1>Welcome, {adminName}!</h1>
                            <p>System overview and management</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => navigate('/generate-report')}>
                            Generate Report
                        </button>
                    </div>
                </header>

                {/* Stats Cards */}
                <section className="stats-section">
                    <div className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Total Users</p>
                            <h3 className="stat-value">1,250</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Total Orders Today</p>
                            <h3 className="stat-value">45</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Total Revenue</p>
                            <h3 className="stat-value">Rs. 125,000</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Active Staff</p>
                            <h3 className="stat-value">8</h3>
                        </div>
                    </div>
                </section>

                {/* Recent Activity / All Orders */}
                <section className="orders-section">
                    <div className="section-header">
                        <h2>Recent System Activity</h2>
                        <a href="#all-activity" className="view-all">View All →</a>
                    </div>

                    <div className="orders-table-container">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>User</th>
                                    <th>Action / Order</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>SYS-001</td>
                                    <td>Bandu Perera</td>
                                    <td>New Order Placed</td>
                                    <td>Jan 21, 2026</td>
                                    <td><span className="status-badge status-processing">New</span></td>
                                </tr>
                                <tr>
                                    <td>SYS-002</td>
                                    <td>Nilantha Pieris</td>
                                    <td>Order #1234 Status Update</td>
                                    <td>Jan 21, 2026</td>
                                    <td><span className="status-badge status-completed">Updated</span></td>
                                </tr>
                                <tr>
                                    <td>SYS-003</td>
                                    <td>Supun Pinto</td>
                                    <td>New User Registration</td>
                                    <td>Jan 21, 2026</td>
                                    <td><span className="status-badge status-delivered">Success</span></td>
                                </tr>
                                <tr>
                                    <td>SYS-004</td>
                                    <td>Bandu Perera</td>
                                    <td>Daily Backup</td>
                                    <td>Jan 21, 2026</td>
                                    <td><span className="status-badge status-completed">Completed</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="quick-actions-section">
                    <div className="section-header">
                        <h2>Administrative Actions</h2>
                    </div>
                    <div className="quick-actions-grid">
                        <div className="action-card">
                            <h3>Add User</h3>
                            <p>Register new staff or delivery personnel</p>
                            <button className="btn btn-secondary btn-small">Add User</button>
                        </div>
                        <div className="action-card">
                            <h3>Manage Services</h3>
                            <p>Update service prices and offerings</p>
                            <button className="btn btn-secondary btn-small">Manage</button>
                        </div>
                        <div className="action-card">
                            <h3>System Settings</h3>
                            <p>Configure global application settings</p>
                            <button className="btn btn-secondary btn-small">Settings</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminDashboard;
