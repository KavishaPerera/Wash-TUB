import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';
import './AdminDashboard.css';
import Swal from 'sweetalert2';

const Payment = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [payments] = useState([
        { id: 'PAY-001', orderId: 'ORD-001', customer: 'Amandi Perera', amount: 'Rs. 1,500', method: 'card', status: 'completed', date: 'Jan 15, 2026' },
        { id: 'PAY-002', orderId: 'ORD-003', customer: 'Nilantha Pieris', amount: 'Rs. 800', method: 'cash', status: 'pending', date: 'Jan 16, 2026' },
        { id: 'PAY-003', orderId: 'ORD-004', customer: 'Bandu Perera', amount: 'Rs. 3,500', method: 'bank', status: 'completed', date: 'Jan 14, 2026' },
        { id: 'PAY-004', orderId: 'ORD-005', customer: 'Supun Mendis', amount: 'Rs. 3,000', method: 'card', status: 'failed', date: 'Jan 10, 2026' },
        { id: 'PAY-005', orderId: 'ORD-006', customer: 'Ruwan Jayasena', amount: 'Rs. 1,200', method: 'cash', status: 'refunded', date: 'Jan 12, 2026' },
    ]);

    const handleLogout = () => {
        navigate('/signin');
    };

    const filteredPayments = payments.filter(payment => {
        const matchesSearch = payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.customer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadgeClass = (status) => {
        const classes = {
            pending: 'status-pending',
            completed: 'status-completed',
            failed: 'status-failed',
            refunded: 'status-refunded'
        };
        return classes[status] || '';
    };

    const getMethodBadgeClass = (method) => {
        const classes = {
            card: 'method-card',
            cash: 'method-cash',
            bank: 'method-bank'
        };
        return classes[method] || '';
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
                    <Link to="/service-management" className="nav-item">
                        <span>Service Management</span>
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
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h1>Payments</h1>
                            <p>Monitor transactions and revenue</p>
                        </div>
                    </div>
                </header>

                <div className="dashboard-content">
                    {/* Stats Cards */}
                    <section className="stats-section admin-stats">
                        <div className="stat-card">
                            <div className="stat-info">
                                <p className="stat-label">Total Transactions</p>
                                <h3 className="stat-value">{payments.length}</h3>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-info">
                                <p className="stat-label">Total Revenue</p>
                                <h3 className="stat-value" style={{ color: '#34c759' }}>Rs. 10,000</h3>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-info">
                                <p className="stat-label">Pending Payments</p>
                                <h3 className="stat-value" style={{ color: '#ff9500' }}>{payments.filter(p => p.status === 'pending').length}</h3>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-info">
                                <p className="stat-label">Failed/Refunded</p>
                                <h3 className="stat-value" style={{ color: '#ff3b30' }}>{payments.filter(p => p.status === 'failed' || p.status === 'refunded').length}</h3>
                            </div>
                        </div>
                    </section>

                    {/* Filters */}
                    <section className="filters-section">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search by Payment ID or Customer..."
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
                                className={`filter-tab ${filterStatus === 'failed' ? 'active' : ''}`}
                                onClick={() => setFilterStatus('failed')}
                            >
                                Failed
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
                    <section className="dashboard-table-section">
                        <div className="table-container">
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Payment ID</th>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Amount</th>
                                        <th>Method</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPayments.map(payment => (
                                        <tr key={payment.id}>
                                            <td className="payment-id" style={{ fontWeight: '600', color: 'var(--color-primary-light)' }}>{payment.id}</td>
                                            <td className="order-id">{payment.orderId}</td>
                                            <td>{payment.customer}</td>
                                            <td className="payment-amount" style={{ fontWeight: '700', color: '#34c759' }}>{payment.amount}</td>
                                            <td>
                                                <span className={`method-badge ${getMethodBadgeClass(payment.method)}`}>
                                                    {payment.method.toUpperCase()}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${getStatusBadgeClass(payment.status)}`}>
                                                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                                </span>
                                            </td>
                                            <td>{payment.date}</td>
                                            <td className="actions-cell">
                                                <button
                                                    className="btn-action btn-view"
                                                    onClick={() => Swal.fire({ icon: 'info', title: 'Payment Details', text: `Viewing details for payment ${payment.id}`, confirmButtonColor: '#0ea5e9' })}
                                                >
                                                    View
                                                </button>
                                                {payment.status === 'completed' && (
                                                    <button
                                                        className="btn-action btn-refund"
                                                        onClick={() => Swal.fire({ icon: 'warning', title: 'Initiate Refund?', text: `Are you sure you want to refund payment ${payment.id}?`, showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b', confirmButtonText: 'Yes, Refund', cancelButtonText: 'Cancel' })}
                                                    >
                                                        Refund
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredPayments.length === 0 && (
                                <div className="no-data">
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
