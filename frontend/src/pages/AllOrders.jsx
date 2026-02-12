import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';

const AllOrders = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [orders] = useState([
        { id: 'ORD-001', customer: 'Amandi Perera', service: 'Wash & Fold', items: 15, total: 'Rs. 1,500', status: 'processing', date: 'Jan 15, 2026' },
        { id: 'ORD-002', customer: 'Kasun Silva', service: 'Dry Cleaning', items: 3, total: 'Rs. 2,200', status: 'pending', date: 'Jan 16, 2026' },
        { id: 'ORD-003', customer: 'Nilantha Pieris', service: 'Ironing', items: 10, total: 'Rs. 800', status: 'completed', date: 'Jan 14, 2026' },
        { id: 'ORD-004', customer: 'Bandu Perera', service: 'Wash & Fold', items: 25, total: 'Rs. 3,500', status: 'delivered', date: 'Jan 12, 2026' },
        { id: 'ORD-005', customer: 'Supun Mendis', service: 'Dry Cleaning', items: 5, total: 'Rs. 3,000', status: 'cancelled', date: 'Jan 10, 2026' },
    ]);

    const handleLogout = () => {
        navigate('/signin');
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadgeClass = (status) => {
        const classes = {
            pending: 'status-pending',
            processing: 'status-processing',
            completed: 'status-completed',
            delivered: 'status-delivered',
            cancelled: 'status-cancelled'
        };
        return classes[status] || '';
    };

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h2 className="logo">WashTub</h2>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/admin-dashboard" className="nav-item">
                        <span>Overview</span>
                    </Link>
                    <Link to="/user-management" className="nav-item">
                        <span>User Management</span>
                    </Link>
                    <a href="#" className="nav-item active">
                        <span>All Orders</span>
                    </a>
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
                <header className="dashboard-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h1>All Orders</h1>
                            <p>Track and manage all customer orders</p>
                        </div>
                    </div>
                </header>

                <div className="dashboard-content">
                    {/* Stats Cards */}
                    <section className="stats-section">
                        <div className="stat-card">
                            <div className="stat-info">
                                <p className="stat-label">Total Orders</p>
                                <h3 className="stat-value">{orders.length}</h3>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-info">
                                <p className="stat-label">Pending</p>
                                <h3 className="stat-value">{orders.filter(o => o.status === 'pending').length}</h3>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-info">
                                <p className="stat-label">Processing</p>
                                <h3 className="stat-value">{orders.filter(o => o.status === 'processing').length}</h3>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-info">
                                <p className="stat-label">Completed</p>
                                <h3 className="stat-value">{orders.filter(o => o.status === 'completed' || o.status === 'delivered').length}</h3>
                            </div>
                        </div>
                    </section>

                    {/* Filters */}
                    <section className="filters-section">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search by Order ID or Customer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-tabs">
                            <button
                                className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
                                onClick={() => setFilterStatus('all')}
                            >
                                All
                            </button>
                            <button
                                className={`filter-tab ${filterStatus === 'pending' ? 'active' : ''}`}
                                onClick={() => setFilterStatus('pending')}
                            >
                                Pending
                            </button>
                            <button
                                className={`filter-tab ${filterStatus === 'processing' ? 'active' : ''}`}
                                onClick={() => setFilterStatus('processing')}
                            >
                                Processing
                            </button>
                            <button
                                className={`filter-tab ${filterStatus === 'completed' ? 'active' : ''}`}
                                onClick={() => setFilterStatus('completed')}
                            >
                                Completed
                            </button>
                            <button
                                className={`filter-tab ${filterStatus === 'cancelled' ? 'active' : ''}`}
                                onClick={() => setFilterStatus('cancelled')}
                            >
                                Cancelled
                            </button>
                        </div>
                    </section>

                    {/* Orders Table */}
                    <section className="dashboard-table-section">
                        <div className="table-container">
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Service</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map(order => (
                                        <tr key={order.id}>
                                            <td className="order-id">{order.id}</td>
                                            <td>{order.customer}</td>
                                            <td>{order.service}</td>
                                            <td>{order.items}</td>
                                            <td className="order-amount">{order.total}</td>
                                            <td>
                                                <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                            <td>{order.date}</td>
                                            <td className="actions-cell">
                                                <button
                                                    className="btn-action btn-view"
                                                    onClick={() => alert(`View details for ${order.id}`)}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    className="btn-action btn-edit"
                                                    onClick={() => alert(`Edit status for ${order.id}`)}
                                                >
                                                    Update
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredOrders.length === 0 && (
                                <div className="no-data">
                                    <p>No orders found matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default AllOrders;
