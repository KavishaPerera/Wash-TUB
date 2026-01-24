import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AllOrders.css';

const AllOrders = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [orders] = useState([
        { id: 'ORD-1234', customer: 'Amandi Perera', service: 'Wash & Fold', items: '5 items', date: 'Jan 24, 2026', status: 'processing', amount: 'Rs. 750' },
        { id: 'ORD-1235', customer: 'Bandu Perera', service: 'Dry Cleaning', items: '3 items', date: 'Jan 24, 2026', status: 'completed', amount: 'Rs. 1,200' },
        { id: 'ORD-1236', customer: 'Nimal Fernando', service: 'Iron & Press', items: '8 items', date: 'Jan 23, 2026', status: 'delivered', amount: 'Rs. 480' },
        { id: 'ORD-1237', customer: 'Supun Pinto', service: 'Premium Care', items: '2 items', date: 'Jan 23, 2026', status: 'pending', amount: 'Rs. 2,500' },
        { id: 'ORD-1238', customer: 'Kasun Silva', service: 'Wash & Fold', items: '10 items', date: 'Jan 22, 2026', status: 'completed', amount: 'Rs. 1,500' },
        { id: 'ORD-1239', customer: 'Nilantha Pieris', service: 'Dry Cleaning', items: '4 items', date: 'Jan 22, 2026', status: 'cancelled', amount: 'Rs. 1,800' },
        { id: 'ORD-1240', customer: 'Ruwan Jayasena', service: 'Premium Care', items: '1 item', date: 'Jan 21, 2026', status: 'delivered', amount: 'Rs. 800' },
        { id: 'ORD-1241', customer: 'Amandi Perera', service: 'Iron & Press', items: '6 items', date: 'Jan 21, 2026', status: 'processing', amount: 'Rs. 360' },
    ]);

    const handleLogout = () => {
        navigate('/signin');
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusClass = (status) => {
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
        <div className="all-orders-page">
            {/* Sidebar */}
            <aside className="all-orders-sidebar">
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
                    <Link to="/generate-report" className="nav-item">
                        <span>Generate Reports</span>
                    </Link>
                    <a href="#settings" className="nav-item">
                        <span>System Settings</span>
                    </a>
                </nav>

                <button className="logout-btn" onClick={handleLogout}>
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="all-orders-main">
                <header className="all-orders-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h1>All Orders</h1>
                            <p>Manage and track all customer orders</p>
                        </div>
                    </div>
                </header>

                <div className="all-orders-content">
                    {/* Stats Cards */}
                    <section className="stats-grid">
                        <div className="stat-card">
                            <span className="stat-value">{orders.length}</span>
                            <span className="stat-label">Total Orders</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{orders.filter(o => o.status === 'pending').length}</span>
                            <span className="stat-label">Pending</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{orders.filter(o => o.status === 'processing').length}</span>
                            <span className="stat-label">Processing</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{orders.filter(o => o.status === 'completed' || o.status === 'delivered').length}</span>
                            <span className="stat-label">Completed</span>
                        </div>
                    </section>

                    {/* Filters */}
                    <section className="filters-section">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search by order ID or customer name..."
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
                                className={`filter-tab ${filterStatus === 'delivered' ? 'active' : ''}`}
                                onClick={() => setFilterStatus('delivered')}
                            >
                                Delivered
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
                    <section className="orders-table-section">
                        <div className="table-container">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Service</th>
                                        <th>Items</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
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
                                            <td>{order.date}</td>
                                            <td className="order-amount">{order.amount}</td>
                                            <td>
                                                <span className={`status-badge ${getStatusClass(order.status)}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="actions-cell">
                                                <button
                                                    className="btn-action btn-view"
                                                    onClick={() => alert(`Viewing order ${order.id}`)}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    className="btn-action btn-edit"
                                                    onClick={() => alert(`Editing order ${order.id}`)}
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredOrders.length === 0 && (
                                <div className="no-orders">
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
