import { useState, useEffect } from 'react';
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

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const adminName = (() => {
        try { const u = JSON.parse(localStorage.getItem('user') || '{}'); return u.first_name || 'Admin'; }
        catch { return 'Admin'; }
    })();

    const handleLogout = () => {
        localStorage.removeItem('token'); localStorage.removeItem('user');
        sessionStorage.removeItem('token'); sessionStorage.removeItem('user');
        navigate('/signin');
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${API}/orders`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetchOrders();
    }, []);

    // ── Computed stats ────────────────────────────────────────────────────
    const totalOrders = orders.length;
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const activeCount = orders.filter(o => ['confirmed', 'pickup_scheduled', 'picked_up', 'processing', 'ready', 'out_for_delivery'].includes(o.status)).length;
    const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + parseFloat(o.total || 0), 0);

    const fmtDate = (iso) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const recentOrders = orders.slice(0, 8);

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header"><h2 className="logo">WashTub</h2></div>
                <nav className="sidebar-nav">
                    <Link to="/admin-dashboard" className="nav-item active"><span>Overview</span></Link>
                    <Link to="/user-management" className="nav-item"><span>User Management</span></Link>
                    <Link to="/service-management" className="nav-item"><span>Service Management</span></Link>
                    <Link to="/all-orders" className="nav-item"><span>All Order Updates</span></Link>
                    <Link to="/payment" className="nav-item"><span>Payment Updates</span></Link>
                    <Link to="/generate-report" className="nav-item"><span>Generate Reports</span></Link>
                    <Link to="/system-settings" className="nav-item"><span>System Settings</span></Link>
                </nav>
                <button className="logout-btn" onClick={handleLogout}><span>Logout</span></button>
            </aside>

            {/* Main */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <div>
                            <h1>Welcome, {adminName}!</h1>
                            <p>System overview and management</p>
                        </div>
                    </div>
                </header>

                <div className="dashboard-content">
                    {/* Stats */}
                    <section className="stats-section admin-stats">
                        <div className="stat-card">
                            <div className="stat-info">
                                <p className="stat-label">Total Orders</p>
                                <h3 className="stat-value">{loading ? '—' : totalOrders}</h3>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-info">
                                <p className="stat-label">Pending</p>
                                <h3 className="stat-value">{loading ? '—' : pendingCount}</h3>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-info">
                                <p className="stat-label">Active Orders</p>
                                <h3 className="stat-value">{loading ? '—' : activeCount}</h3>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-info">
                                <p className="stat-label">Total Revenue</p>
                                <h3 className="stat-value">{loading ? '—' : `LKR ${totalRevenue.toFixed(0)}`}</h3>
                            </div>
                        </div>
                    </section>

                    {/* Recent Orders Table */}
                    <section className="dashboard-table-section" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
                        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Recent Orders</h2>
                            <Link to="/all-orders" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
                                View All →
                            </Link>
                        </div>

                        {loading && <p style={{ color: '#94a3b8' }}>Loading orders…</p>}

                        {!loading && orders.length === 0 && (
                            <p style={{ color: '#94a3b8' }}>No orders have been placed yet.</p>
                        )}

                        {!loading && orders.length > 0 && (
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map(order => (
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
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    {/* Admin Actions */}
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
                                <button className="btn btn-secondary btn-small" onClick={() => navigate('/service-management')}>Manage</button>
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
