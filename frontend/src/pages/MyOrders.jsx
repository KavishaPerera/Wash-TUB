import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css'; // Use shared dashboard styles

const MyOrders = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('all');

    const orders = [
        { id: 'ORD-1234', service: 'Wash & Fold', date: 'Jan 20, 2026', status: 'Processing', amount: 'Rs.450', items: '5 kg' },
        { id: 'ORD-1233', service: 'Dry Cleaning', date: 'Jan 18, 2026', status: 'Completed', amount: 'Rs.850', items: '3 items' },
        { id: 'ORD-1232', service: 'Iron & Press', date: 'Jan 15, 2026', status: 'Delivered', amount: 'Rs.300', items: '8 items' },
        { id: 'ORD-1231', service: 'Wash & Fold', date: 'Jan 12, 2026', status: 'Completed', amount: 'Rs.500', items: '4 kg' },
        { id: 'ORD-1230', service: 'Premium Care', date: 'Jan 10, 2026', status: 'Delivered', amount: 'Rs.1200', items: '2 items' },
        { id: 'ORD-1229', service: 'Dry Cleaning', date: 'Jan 08, 2026', status: 'Completed', amount: 'Rs.650', items: '4 items' },
        { id: 'ORD-1228', service: 'Wash & Fold', date: 'Jan 05, 2026', status: 'Delivered', amount: 'Rs.380', items: '3 kg' },
        { id: 'ORD-1227', service: 'Iron & Press', date: 'Jan 02, 2026', status: 'Cancelled', amount: 'Rs.250', items: '6 items' },
    ];

    const filteredOrders = activeFilter === 'all'
        ? orders
        : orders.filter(order => order.status.toLowerCase() === activeFilter);

    const getStatusClass = (status) => {
        return `status-${status.toLowerCase()}`;
    };

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
                    <Link to="/customer-dashboard" className="nav-item">
                        <span>Overview</span>
                    </Link>
                    <a href="#" className="nav-item active">
                        <span>My Orders</span>
                    </a>
                    <Link to="/new-order" className="nav-item">
                        <span>New Order</span>
                    </Link>
                    <Link to="/notifications" className="nav-item">
                        <span>Notifications</span>
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

                {/* Orders Grid */}
                <section className="orders-section">
                    {filteredOrders.length === 0 ? (
                        <div className="no-orders">
                            <span className="no-orders-icon">📦</span>
                            <h3>No orders found</h3>
                            <p>You don't have any {activeFilter !== 'all' ? activeFilter : ''} orders yet.</p>
                            <button className="btn btn-primary" onClick={() => navigate('/new-order')}>
                                Place Your First Order
                            </button>
                        </div>
                    ) : (
                        <div className="orders-grid">
                            {filteredOrders.map((order) => (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">
                                        <span className="order-id">{order.id}</span>
                                        <span className={`order-status ${getStatusClass(order.status)}`}>{order.status}</span>
                                    </div>
                                    <div className="order-details">
                                        <h3>{order.service}</h3>
                                        <p>📦 {order.items}</p>
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
                    )}
                </section>

            </main>
        </div>
    );
};

export default MyOrders;
