import { useNavigate } from 'react-router-dom';
import { Edit, RefreshCw } from 'lucide-react';
import StaffSidebar from '../components/StaffSidebar';
import { useStaffOrders } from '../context/StaffOrdersContext';
import { useState } from 'react';
import './StaffDashboard.css';

const StaffDashboard = () => {
    const navigate = useNavigate();
    const { orders, loading, lastUpdated, fetchOrders } = useStaffOrders();
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchOrders();
        setRefreshing(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/signin');
    };

    // ── Computed stats from real data ────────────────────────────────────
    const totalOrders = orders.length;
    const inProgressCount = orders.filter(o =>
        ['in progress', 'processing', 'picked up', 'confirmed', 'pickup scheduled'].some(s =>
            o.status.toLowerCase().includes(s)
        )
    ).length;
    const completedToday = orders.filter(o => {
        if (!['delivered', 'ready'].includes(o.status.toLowerCase())) return false;
        const d = o._raw?.updated_at || o._raw?.created_at;
        if (!d) return false;
        const today = new Date().toDateString();
        return new Date(d).toDateString() === today;
    }).length;

    const staffName = (() => {
        try {
            const u = JSON.parse(localStorage.getItem('user') || '{}');
            return u.first_name || 'Staff Member';
        } catch { return 'Staff Member'; }
    })();

    return (
        <div className="dashboard">
            <StaffSidebar activePage="overview" />

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <div>
                            <h1>Welcome, {staffName}!</h1>
                            <p>
                                {lastUpdated
                                    ? `Last synced: ${lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                                    : 'Manage assigned orders and tasks'}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                className="btn btn-secondary"
                                onClick={handleRefresh}
                                disabled={refreshing || loading}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                                <RefreshCw size={15} className={refreshing ? 'spin-anim' : ''} />
                                {refreshing ? 'Refreshing…' : 'Refresh'}
                            </button>
                            <button className="btn btn-primary" onClick={() => navigate('/staff/tasks')}>
                                View All Tasks
                            </button>
                        </div>
                    </div>
                </header>

                {/* Stats Cards */}
                <section className="stats-section">
                    <div className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Total Orders</p>
                            <h3 className="stat-value">{loading ? '—' : totalOrders}</h3>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">In Progress</p>
                            <h3 className="stat-value">{loading ? '—' : inProgressCount}</h3>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Completed Today</p>
                            <h3 className="stat-value">{loading ? '—' : completedToday}</h3>
                        </div>
                    </div>
                </section>

                {/* Recent Orders Table */}
                <section className="orders-section">
                    <div className="section-header">
                        <h2>Recent Orders</h2>
                    </div>

                    {loading && (
                        <p style={{ color: '#94a3b8', padding: '1rem 0' }}>Loading orders…</p>
                    )}

                    {!loading && orders.length === 0 && (
                        <p style={{ color: '#94a3b8', padding: '1rem 0' }}>No orders yet.</p>
                    )}

                    {!loading && orders.length > 0 && (
                        <div className="orders-table-container">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Service Type</th>
                                        <th>Status</th>
                                        <th>Update</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.slice(0, 8).map(order => (
                                        <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>{order.customer}</td>
                                            <td>{order.service}</td>
                                            <td>
                                                <span className={`status-badge status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn-action"
                                                    onClick={() => navigate('/staff/update-order', { state: { order } })}
                                                    title="Update Order Status"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default StaffDashboard;
