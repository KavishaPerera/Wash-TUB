import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Payment.css';

const Payment = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [payments] = useState([
        { id: 'PAY-001', orderId: 'ORD-1234', customer: 'Amandi Perera', amount: 'Rs. 750', method: 'Card', date: 'Jan 24, 2026', status: 'completed' },
        { id: 'PAY-002', orderId: 'ORD-1235', customer: 'Bandu Perera', amount: 'Rs. 1,200', method: 'Cash', date: 'Jan 24, 2026', status: 'completed' },
        { id: 'PAY-003', orderId: 'ORD-1236', customer: 'Nimal Fernando', amount: 'Rs. 480', method: 'Card', date: 'Jan 23, 2026', status: 'completed' },
        { id: 'PAY-004', orderId: 'ORD-1237', customer: 'Supun Pinto', amount: 'Rs. 2,500', method: 'Bank Transfer', date: 'Jan 23, 2026', status: 'pending' },
        { id: 'PAY-005', orderId: 'ORD-1238', customer: 'Kasun Silva', amount: 'Rs. 1,500', method: 'Card', date: 'Jan 22, 2026', status: 'completed' },
        { id: 'PAY-006', orderId: 'ORD-1239', customer: 'Nilantha Pieris', amount: 'Rs. 1,800', method: 'Cash', date: 'Jan 22, 2026', status: 'refunded' },
        { id: 'PAY-007', orderId: 'ORD-1240', customer: 'Ruwan Jayasena', amount: 'Rs. 800', method: 'Card', date: 'Jan 21, 2026', status: 'completed' },
        { id: 'PAY-008', orderId: 'ORD-1241', customer: 'Amandi Perera', amount: 'Rs. 360', method: 'Cash', date: 'Jan 21, 2026', status: 'pending' },
    ]);

    const handleLogout = () => {
        navigate('/signin');
    };

    const filteredPayments = payments.filter(payment => {
        const matchesSearch = payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.orderId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusClass = (status) => {
        const classes = {
            pending: 'status-pending',
            completed: 'status-completed',
            refunded: 'status-refunded',
            failed: 'status-failed'
        };
        return classes[status] || '';
    };

    const getMethodClass = (method) => {
        const classes = {
            'Card': 'method-card',
            'Cash': 'method-cash',
            'Bank Transfer': 'method-bank'
        };
        return classes[method] || '';
    };

    // Calculate totals
    const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => {
        const amount = parseInt(p.amount.replace(/[^0-9]/g, ''));
        return sum + amount;
    }, 0);

    const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => {
        const amount = parseInt(p.amount.replace(/[^0-9]/g, ''));
        return sum + amount;
    }, 0);

    return (
        <div className="payment-page">
            {/* Sidebar */}
            <aside className="payment-sidebar">
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
                    <Link to="/all-orders" className="nav-item">
                        <span>All Orders</span>
                    </Link>
                    <a href="#" className="nav-item active">
                        <span>Payment</span>
                    </a>
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
            <main className="payment-main">
                <header className="payment-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h1>Payment Management</h1>
                            <p>Track and manage all payment transactions</p>
                        </div>
                    </div>
                </header>

                <div className="payment-content">
                    {/* Stats Cards */}
                    <section className="stats-grid">
                        <div className="stat-card">
                            <span className="stat-value">{payments.length}</span>
                            <span className="stat-label">Total Transactions</span>
                        </div>
                        <div className="stat-card stat-revenue">
                            <span className="stat-value">Rs. {totalRevenue.toLocaleString()}</span>
                            <span className="stat-label">Total Revenue</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{payments.filter(p => p.status === 'completed').length}</span>
                            <span className="stat-label">Completed</span>
                        </div>
                    </section>

                    {/* Filters */}
                    <section className="filters-section">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search by payment ID, order ID, or customer..."
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
                                className={`filter-tab ${filterStatus === 'completed' ? 'active' : ''}`}
                                onClick={() => setFilterStatus('completed')}
                            >
                                Completed
                            </button>
                            <button
                                className={`filter-tab ${filterStatus === 'pending' ? 'active' : ''}`}
                                onClick={() => setFilterStatus('pending')}
                            >
                                Pending
                            </button>
                            <button
                                className={`filter-tab ${filterStatus === 'refunded' ? 'active' : ''}`}
                                onClick={() => setFilterStatus('refunded')}
                            >
                                Refunded
                            </button>
                        </div>
                    </section>

                    {/* Payments Table */}
                    <section className="payments-table-section">
                        <div className="table-container">
                            <table className="payments-table">
                                <thead>
                                    <tr>
                                        <th>Payment ID</th>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Amount</th>
                                        <th>Method</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPayments.map(payment => (
                                        <tr key={payment.id}>
                                            <td className="payment-id">{payment.id}</td>
                                            <td className="order-id">{payment.orderId}</td>
                                            <td>{payment.customer}</td>
                                            <td className="payment-amount">{payment.amount}</td>
                                            <td>
                                                <span className={`method-badge ${getMethodClass(payment.method)}`}>
                                                    {payment.method}
                                                </span>
                                            </td>
                                            <td>{payment.date}</td>
                                            <td>
                                                <span className={`status-badge ${getStatusClass(payment.status)}`}>
                                                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredPayments.length === 0 && (
                                <div className="no-payments">
                                    <p>No payments found matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Payment;
