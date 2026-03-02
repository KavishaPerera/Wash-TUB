import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';
import './AdminDashboard.css';
import Swal from 'sweetalert2';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const normaliseMethod = (method) => {
    if (!method) return 'cash';
    const m = method.toLowerCase();
    if (m === 'visa' || m === 'mastercard' || m === 'amex') return 'card';
    if (m === 'bank' || m === 'bank_transfer') return 'bank';
    return 'cash';
};

const normaliseStatus = (paymentStatus) => {
    // DB uses 'paid'; UI shows 'completed'
    if (paymentStatus === 'paid') return 'completed';
    return paymentStatus || 'pending';
};

const Payment = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); sessionStorage.removeItem('token'); sessionStorage.removeItem('user'); navigate('/signin'); };

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API}/orders`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error('Failed to fetch orders');
                const orders = await res.json();

                const mapped = orders.map(order => ({
                    id: `PAY-${String(order.id).padStart(3, '0')}`,
                    orderId: order.order_number,
                    rawOrderId: order.id,
                    customer: `${order.first_name || ''} ${order.last_name || ''}`.trim() || order.full_name,
                    amount: `Rs. ${Number(order.total).toLocaleString('en-LK', { minimumFractionDigits: 2 })}`,
                    rawTotal: Number(order.total),
                    method: normaliseMethod(order.payment_method),
                    methodLabel: order.payment_method,
                    status: normaliseStatus(order.payment_status),
                    date: new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                }));

                setPayments(mapped);
            } catch (err) {
                console.error('Fetch payments error:', err);
                Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load payment data.', confirmButtonColor: '#0ea5e9' });
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

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

    const handleMarkPaid = async (payment) => {
        const confirm = await Swal.fire({
            title: 'Mark as Paid?',
            text: `Mark payment for order ${payment.orderId} as paid?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, mark as paid',
        });
        if (!confirm.isConfirmed) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API}/orders/${payment.rawOrderId}/payment-status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ paymentStatus: 'paid' }),
            });
            if (!res.ok) throw new Error('Failed to update payment status');
            setPayments(prev => prev.map(p => p.rawOrderId === payment.rawOrderId ? { ...p, status: 'completed' } : p));
            Swal.fire({ icon: 'success', title: 'Updated!', text: 'Payment marked as paid.', confirmButtonColor: '#0ea5e9', timer: 1800, showConfirmButton: false });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#0ea5e9' });
        }
    };

    const handleViewPayment = (payment) => {
        const statusColors = {
            completed: '#16a34a',
            pending: '#d97706',
            failed: '#dc2626',
            refunded: '#7c3aed'
        };
        const methodLabels = { card: 'Credit/Debit Card', cash: 'Cash', bank: 'Bank Transfer', visa: 'Visa', mastercard: 'Mastercard', amex: 'American Express' };
        const displayMethod = methodLabels[(payment.methodLabel || '').toLowerCase()] || methodLabels[payment.method] || payment.method;
        Swal.fire({
            title: `Payment Details`,
            html: `
                <div style="text-align:left; font-family: sans-serif; font-size: 0.95rem;">
                    <table style="width:100%; border-collapse:collapse;">
                        <tr style="border-bottom:1px solid #e2e8f0;">
                            <td style="padding:10px 8px; color:#64748b; font-weight:600;">Payment ID</td>
                            <td style="padding:10px 8px; font-weight:700; color:#0284c7;">${payment.id}</td>
                        </tr>
                        <tr style="border-bottom:1px solid #e2e8f0;">
                            <td style="padding:10px 8px; color:#64748b; font-weight:600;">Order ID</td>
                            <td style="padding:10px 8px; font-weight:600;">${payment.orderId}</td>
                        </tr>
                        <tr style="border-bottom:1px solid #e2e8f0;">
                            <td style="padding:10px 8px; color:#64748b; font-weight:600;">Customer</td>
                            <td style="padding:10px 8px;">${payment.customer}</td>
                        </tr>
                        <tr style="border-bottom:1px solid #e2e8f0;">
                            <td style="padding:10px 8px; color:#64748b; font-weight:600;">Amount</td>
                            <td style="padding:10px 8px; font-weight:700; font-size:1.1rem;">${payment.amount}</td>
                        </tr>
                        <tr style="border-bottom:1px solid #e2e8f0;">
                            <td style="padding:10px 8px; color:#64748b; font-weight:600;">Payment Method</td>
                            <td style="padding:10px 8px;">${displayMethod}</td>
                        </tr>
                        <tr style="border-bottom:1px solid #e2e8f0;">
                            <td style="padding:10px 8px; color:#64748b; font-weight:600;">Status</td>
                            <td style="padding:10px 8px;"><span style="background:${statusColors[payment.status]}22; color:${statusColors[payment.status]}; padding:4px 12px; border-radius:20px; font-weight:600; font-size:0.85rem;">${payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</span></td>
                        </tr>
                        <tr>
                            <td style="padding:10px 8px; color:#64748b; font-weight:600;">Date</td>
                            <td style="padding:10px 8px;">${payment.date}</td>
                        </tr>
                    </table>
                </div>
            `,
            confirmButtonColor: '#0ea5e9',
            confirmButtonText: 'Close',
            width: '480px',
        });
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
                                <h3 className="stat-value">{loading ? '...' : payments.length}</h3>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-info">
                                <p className="stat-label">Total Revenue</p>
                                <h3 className="stat-value" style={{ color: '#000000' }}>
                                    {loading ? '...' : `Rs. ${payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.rawTotal, 0).toLocaleString('en-LK', { minimumFractionDigits: 2 })}`}
                                </h3>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-info">
                                <p className="stat-label">Pending Payments</p>
                                <h3 className="stat-value" style={{ color: '#d97706' }}>
                                    {loading ? '...' : payments.filter(p => p.status === 'pending').length}
                                </h3>
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
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading payments...</td></tr>
                                    ) : filteredPayments.map(payment => (
                                        <tr key={payment.id}>
                                            <td className="payment-id" style={{ fontWeight: '600', color: '#000000' }}>{payment.id}</td>
                                            <td className="order-id">{payment.orderId}</td>
                                            <td>{payment.customer}</td>
                                            <td className="payment-amount" style={{ fontWeight: '700', color: '#000000' }}>{payment.amount}</td>
                                            <td>
                                                <span className={`method-badge ${getMethodBadgeClass(payment.method)}`}>
                                                    {(payment.methodLabel || payment.method).toUpperCase()}
                                                </span>
                                            </td>
                                            <td>{payment.date}</td>
                                            <td className="actions-cell">
                                                <button
                                                    className="btn-action btn-view"
                                                    onClick={() => handleViewPayment(payment)}
                                                >
                                                    View
                                                </button>
                                                {payment.status === 'pending' && (
                                                    <button
                                                        className="btn-action btn-confirm"
                                                        onClick={() => handleMarkPaid(payment)}
                                                        style={{ marginLeft: '6px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem' }}
                                                    >
                                                        Mark Paid
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {!loading && filteredPayments.length === 0 && (
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
