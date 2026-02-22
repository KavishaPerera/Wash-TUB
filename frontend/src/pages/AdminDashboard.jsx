import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css'; // Reusing the same premium styling
import './AdminDashboard.css'; // Admin-specific overrides

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [adminName] = useState('Admin');

    const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); sessionStorage.removeItem('token'); sessionStorage.removeItem('user'); navigate('/signin'); };

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h2 className="logo">WashTub</h2>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/admin-dashboard" className="nav-item active">
                        <span>Overview</span>
                    </Link>
                    <Link to="/user-management" className="nav-item">
                        <span>User Management</span>
                    </Link>
                    <Link to="/service-management" className="nav-item">
                        <span>Service Management</span>
                    </Link>
                    <Link to="/all-orders" className="nav-item">
                        <span>All Orders</span>
                    </Link>
                    <Link to="/payment" className="nav-item">
                        <span>Payment</span>
                    </Link>
                    <Link to="/generate-report" className="nav-item">
                        <span>Generate Reports</span>
                    </Link>
                    <Link to="/system-settings" className="nav-item">
                        <span>System Settings</span>
                    </Link>
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

                <div className="dashboard-content">
                    {/* Stats Cards */}
                    <section className="stats-section admin-stats">
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
                    <section className="dashboard-table-section" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
                        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, color: 'var(--color-light)', fontSize: '1.5rem' }}>Recent System Activity</h2>
                            <Link to="/all-orders" style={{ color: 'var(--color-primary-light)', textDecoration: 'none' }}>View All →</Link>
                        </div>

                        <div className="table-container">
                            <table className="dashboard-table">
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
                            <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-light)' }}>Administrative Actions</h2>
                        </div>
                        <div className="quick-actions-grid">
                            <div className="action-card">
                                <h3>Add User</h3>
                                <p>Register new staff or delivery personnel</p>
                                <button className="btn btn-secondary btn-small" onClick={() => navigate('/user-management')}>Add User</button>
                            </div>
                            <div className="action-card">
                                <h3>Manage Services</h3>
                                <p>Update service prices and offerings</p>
                                <button className="btn btn-secondary btn-small" onClick={() => navigate('/system-settings')}>Manage</button>
                            </div>
                            <div className="action-card">
                                <h3>System Settings</h3>
                                <p>Configure global application settings</p>
                                <button className="btn btn-secondary btn-small" onClick={() => navigate('/system-settings')}>Settings</button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
