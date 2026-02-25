import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';
import './AdminDashboard.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STATUS_LABEL = {
    pending: 'Pending', confirmed: 'Confirmed',
    pickup_scheduled: 'Pickup Scheduled', picked_up: 'Picked Up',
    processing: 'Processing', ready: 'Ready',
    out_for_delivery: 'Out for Delivery', delivered: 'Delivered',
    cancelled: 'Cancelled',
};

const ALL_STATUSES = Object.keys(STATUS_LABEL);

const AllOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null); // detail modal
    const [updating, setUpdating] = useState(null);   // id being updated

    const handleLogout = () => {
        localStorage.removeItem('token'); localStorage.removeItem('user');
        sessionStorage.removeItem('token'); sessionStorage.removeItem('user');
        navigate('/signin');
    };

    const fetchOrders = async () => {
        setLoading(true); setError(null);
        try {
            const res = await fetch(`${API}/orders`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            setOrders(await res.json());
        } catch (e) {
            setError('Failed to load orders. Please try again.');
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchOrders(); }, []);

    // ── Filter + Search ───────────────────────────────────────────────────
    const filteredOrders = useMemo(() => {
        return orders.filter(o => {
            const matchSearch = (
                (o.order_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (o.full_name || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
            const matchStatus = filterStatus === 'all' || o.status === filterStatus;
            return matchSearch && matchStatus;
        });
    }, [orders, searchTerm, filterStatus]);

    // ── Stats ─────────────────────────────────────────────────────────────
    const totalOrders = orders.length;
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const activeCount = orders.filter(o => ['confirmed', 'pickup_scheduled', 'picked_up', 'processing', 'ready', 'out_for_delivery'].includes(o.status)).length;
    const doneCount = orders.filter(o => o.status === 'delivered').length;

    // ── Status update ─────────────────────────────────────────────────────
    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdating(orderId);
        try {
            const res = await fetch(`${API}/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                // Update local state optimistically
                setOrders(prev =>
                    prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
                );
                if (selectedOrder?.id === orderId) {
                    setSelectedOrder(prev => ({ ...prev, status: newStatus }));
                }
            } else {
                alert('Failed to update status. Please try again.');
            }
        } catch { alert('Network error. Please try again.'); }
        finally { setUpdating(null); }
    };

    const fmtDate = (iso) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header"><h2 className="logo">WashTub</h2></div>
                <nav className="sidebar-nav">
                    <Link to="/admin-dashboard" className="nav-item"><span>Overview</span></Link>
                    <Link to="/user-management" className="nav-item"><span>User Management</span></Link>
                    <Link to="/service-management" className="nav-item"><span>Service Management</span></Link>
                    <a href="#" className="nav-item active"><span>All Orders</span></a>
                    <Link to="/payment" className="nav-item"><span>Payment</span></Link>
                    <Link to="/generate-report" className="nav-item"><span>Generate Reports</span></Link>
                    <Link to="/system-settings" className="nav-item"><span>System Settings</span></Link>
                </nav>
                <button className="logout-btn" onClick={handleLogout}><span>Logout</span></button>
            </aside>

            {/* Main */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h1>All Orders</h1>
                            <p>Track and manage all customer orders</p>
                        </div>
                        <button className="btn btn-primary btn-small" onClick={fetchOrders} disabled={loading}>
                            {loading ? 'Refreshing…' : '↻ Refresh'}
                        </button>
                    </div>
                </header>

                <div className="dashboard-content">
                    {/* Stats */}
                    <section className="stats-section admin-stats">
                        <div className="stat-card"><div className="stat-info"><p className="stat-label">Total Orders</p><h3 className="stat-value">{loading ? '—' : totalOrders}</h3></div></div>
                        <div className="stat-card"><div className="stat-info"><p className="stat-label">Pending</p><h3 className="stat-value">{loading ? '—' : pendingCount}</h3></div></div>
                        <div className="stat-card"><div className="stat-info"><p className="stat-label">Active</p><h3 className="stat-value">{loading ? '—' : activeCount}</h3></div></div>
                        <div className="stat-card"><div className="stat-info"><p className="stat-label">Delivered</p><h3 className="stat-value">{loading ? '—' : doneCount}</h3></div></div>
                    </section>

                    {/* Search + Filter */}
                    <section className="filters-section">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search by Order ID or Customer…"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-tabs">
                            <button className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>All</button>
                            {ALL_STATUSES.map(s => (
                                <button
                                    key={s}
                                    className={`filter-tab ${filterStatus === s ? 'active' : ''}`}
                                    onClick={() => setFilterStatus(s)}
                                >
                                    {STATUS_LABEL[s]}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Table */}
                    <section className="dashboard-table-section">
                        {loading && <p style={{ padding: '2rem', color: '#94a3b8' }}>Loading orders…</p>}
                        {error && (
                            <div style={{ padding: '2rem', color: '#ef4444' }}>
                                {error}
                                <button onClick={fetchOrders} style={{ marginLeft: '1rem', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                                    Retry
                                </button>
                            </div>
                        )}

                        {!loading && !error && (
                            <div className="table-container">
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
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
                                                <td style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                                    {order.order_number}
                                                </td>
                                                <td>{order.full_name}</td>
                                                <td>{order.items?.length ?? 0} item{order.items?.length !== 1 ? 's' : ''}</td>
                                                <td>LKR {parseFloat(order.total).toFixed(2)}</td>
                                                <td>
                                                    <span className={`status-badge status-${order.status?.replace(/_/g, '-')}`}>
                                                        {STATUS_LABEL[order.status] || order.status}
                                                    </span>
                                                </td>
                                                <td>{fmtDate(order.created_at)}</td>
                                                <td className="actions-cell">
                                                    <button
                                                        className="btn-action btn-view"
                                                        onClick={() => setSelectedOrder(order)}
                                                    >
                                                        View
                                                    </button>
                                                    <select
                                                        className="btn-action btn-edit"
                                                        style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '0.375rem 0.5rem' }}
                                                        value={order.status}
                                                        disabled={updating === order.id}
                                                        onChange={e => handleStatusUpdate(order.id, e.target.value)}
                                                    >
                                                        {ALL_STATUSES.map(s => (
                                                            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredOrders.length === 0 && (
                                            <tr>
                                                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                                    No orders found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {/* ── Order Detail Modal ───────────────────────────────────────── */}
            {selectedOrder && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        style={{ background: '#1e293b', borderRadius: '20px', width: '100%', maxWidth: '600px', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', overflow: 'hidden' }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h2 style={{ margin: '0 0 0.4rem', fontSize: '1.4rem', fontWeight: 800, color: '#f1f5f9' }}>
                                    {selectedOrder.order_number}
                                </h2>
                                <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
                                    Customer: <strong style={{ color: '#e2e8f0' }}>{selectedOrder.full_name}</strong>
                                </p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px', width: 36, height: 36, cursor: 'pointer', color: '#94a3b8', fontSize: '1.1rem' }}>✕</button>
                        </div>

                        {/* Meta */}
                        <div style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.88rem', color: '#94a3b8' }}>
                            <span>📅 {fmtDate(selectedOrder.created_at)}</span>
                            <span>🚚 {selectedOrder.delivery_option === 'delivery' ? 'Home Delivery' : 'Self Pickup'}</span>
                            <span>💳 {selectedOrder.payment_method?.replace(/_/g, ' ')}</span>
                            <span>📞 {selectedOrder.phone}</span>
                            {selectedOrder.address && <span>📍 {selectedOrder.address}, {selectedOrder.city}</span>}
                        </div>

                        {/* Items */}
                        <div style={{ padding: '1.25rem 1.5rem' }}>
                            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Items</p>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                        {['Item', 'Qty', 'Unit Price', 'Subtotal'].map(h => (
                                            <th key={h} style={{ textAlign: 'left', padding: '0.4rem 0.5rem', color: '#475569', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(selectedOrder.items || []).map((item, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                            <td style={{ padding: '0.6rem 0.5rem', color: '#e2e8f0', fontWeight: 500 }}>{item.item_name}</td>
                                            <td style={{ padding: '0.6rem 0.5rem', color: '#94a3b8' }}>{item.quantity}</td>
                                            <td style={{ padding: '0.6rem 0.5rem', color: '#94a3b8' }}>LKR {parseFloat(item.price).toFixed(2)}</td>
                                            <td style={{ padding: '0.6rem 0.5rem', color: '#e2e8f0', fontWeight: 600 }}>LKR {parseFloat(item.subtotal).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Total */}
                        <div style={{ padding: '1rem 1.5rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.05rem' }}>
                            <span style={{ color: '#e2e8f0' }}>Total</span>
                            <span style={{ color: '#38bdf8' }}>LKR {parseFloat(selectedOrder.total).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllOrders;
