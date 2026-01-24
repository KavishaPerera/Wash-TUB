import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MyOrders.css';

const MyOrders = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('all');

    const orders = [
        { id: 'ORD-1234', service: 'Wash & Fold', date: 'Jan 20, 2026', status: 'processing', amount: 'Rs.450', items: '5 kg' },
        { id: 'ORD-1233', service: 'Dry Cleaning', date: 'Jan 18, 2026', status: 'completed', amount: 'Rs.850', items: '3 items' },
        { id: 'ORD-1232', service: 'Iron & Press', date: 'Jan 15, 2026', status: 'delivered', amount: 'Rs.300', items: '8 items' },
        { id: 'ORD-1231', service: 'Wash & Fold', date: 'Jan 12, 2026', status: 'completed', amount: 'Rs.500', items: '4 kg' },
        { id: 'ORD-1230', service: 'Premium Care', date: 'Jan 10, 2026', status: 'delivered', amount: 'Rs.1200', items: '2 items' },
        { id: 'ORD-1229', service: 'Dry Cleaning', date: 'Jan 08, 2026', status: 'completed', amount: 'Rs.650', items: '4 items' },
        { id: 'ORD-1228', service: 'Wash & Fold', date: 'Jan 05, 2026', status: 'delivered', amount: 'Rs.380', items: '3 kg' },
        { id: 'ORD-1227', service: 'Iron & Press', date: 'Jan 02, 2026', status: 'cancelled', amount: 'Rs.250', items: '6 items' },
    ];

    const filteredOrders = activeFilter === 'all'
        ? orders
        : orders.filter(order => order.status === activeFilter);

    const getStatusClass = (status) => {
        const statusClasses = {
            processing: 'status-processing',
            completed: 'status-completed',
            delivered: 'status-delivered',
            cancelled: 'status-cancelled'
        };
        return statusClasses[status] || '';
    };

    const handleLogout = () => {
        navigate('/signin');
    };

    return (
        <div className="my-orders-page">
            {/* Sidebar */}
            <aside className="orders-sidebar">
                <div className="sidebar-header">
                    <h2 className="logo">WashTub</h2>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/customer-dashboard" className="nav-item">
                        <span>Overview</span>
                    </Link>
                    <a href="#" className="nav-item active">
                        <span>My Orders</span>
                    </a>
                    <Link to="/new-order" className="nav-item">
                        <span>New Order</span>
                    </Link>
                    <a href="#profile" className="nav-item">
                        <span>Profile</span>
                    </a>
                    <a href="#notifications" className="nav-item">
                        <span>Notifications</span>
                    </a>
                </nav>

                <button className="logout-btn" onClick={handleLogout}>
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="orders-main">
                <header className="orders-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h1>My Orders</h1>
                            <p>View and track all your laundry orders</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => navigate('/new-order')}>
                            + New Order
                        </button>
                    </div>
                </header>

                {/* Filter Tabs */}
                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('all')}
                    >
                        All Orders
                    </button>
                    <button
                        className={`filter-tab ${activeFilter === 'processing' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('processing')}
                    >
                        Processing
                    </button>
                    <button
                        className={`filter-tab ${activeFilter === 'completed' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('completed')}
                    >
                        Completed
                    </button>
                    <button
                        className={`filter-tab ${activeFilter === 'delivered' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('delivered')}
                    >
                        Delivered
                    </button>
                    <button
                        className={`filter-tab ${activeFilter === 'cancelled' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('cancelled')}
                    >
                        Cancelled
                    </button>
                </div>

                {/* Orders List */}
                <section className="orders-list-section">
                    <div className="orders-table-container">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Service</th>
                                    <th>Items</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Amount</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => (
                                    <tr key={order.id}>
                                        <td className="order-id">{order.id}</td>
                                        <td>{order.service}</td>
                                        <td>{order.items}</td>
                                        <td>{order.date}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusClass(order.status)}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="order-amount">{order.amount}</td>
                                        <td>
                                            {order.status === 'processing' ? (
                                                <button className="btn-action btn-track">Track</button>
                                            ) : (
                                                <button className="btn-action btn-view">View</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredOrders.length === 0 && (
                        <div className="no-orders">
                            <span className="no-orders-icon">📦</span>
                            <h3>No orders found</h3>
                            <p>You don't have any {activeFilter !== 'all' ? activeFilter : ''} orders yet.</p>
                            <button className="btn btn-primary" onClick={() => navigate('/new-order')}>
                                Place Your First Order
                            </button>
                        </div>
                    )}
                </section>

                {/* Order Summary */}
                <section className="order-summary-section">
                    <div className="summary-cards">
                        <div className="summary-card">
                            <span className="summary-value">{orders.length}</span>
                            <span className="summary-label">Total Orders</span>
                        </div>
                        <div className="summary-card">
                            <span className="summary-value">{orders.filter(o => o.status === 'processing').length}</span>
                            <span className="summary-label">In Progress</span>
                        </div>
                        <div className="summary-card">
                            <span className="summary-value">{orders.filter(o => o.status === 'completed' || o.status === 'delivered').length}</span>
                            <span className="summary-label">Completed</span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default MyOrders;
