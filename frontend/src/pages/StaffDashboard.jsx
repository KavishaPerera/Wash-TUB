import { useNavigate } from 'react-router-dom';
import { Edit, RefreshCw, ClipboardList, Clock, CheckCircle } from 'lucide-react';
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

    // â”€â”€ Computed stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        return new Date(d).toDateString() === new Date().toDateString();
    }).length;

    const staffName = (() => {
        try {
            const u = JSON.parse(localStorage.getItem('user') || '{}');
            return u.first_name || 'Staff Member';
        } catch { return 'Staff Member'; }
    })();

    const stats = [
        { label: 'Total Orders',    value: totalOrders,     icon: <ClipboardList size={16} color="#6366f1" />, color: '#6366f1' },
        { label: 'In Progress',     value: inProgressCount, icon: <Clock size={16} color="#f59e0b" />,        color: '#f59e0b' },
        { label: 'Completed Today', value: completedToday,  icon: <CheckCircle size={16} color="#10b981" />,  color: '#10b981' },
    ];

    return (
        <div className="dashboard">
            <StaffSidebar activePage="overview" />

            <main className="dashboard-main">
                {/* Compact header */}
                <header className="dashboard-header" style={{ marginBottom: '1.25rem' }}>
                    <div className="header-content">
                        <div>
                            <h1 style={{ fontSize: '1.25rem', marginBottom: '0.1rem' }}>Welcome, {staffName}!</h1>
                            <p style={{ fontSize: '0.8rem', margin: 0, color: '#94a3b8' }}>
                                {lastUpdated
                                    ? `Synced ${lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                                    : 'Manage assigned orders and tasks'}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.6rem' }}>
                            <button
                                className="btn btn-secondary"
                                onClick={handleRefresh}
                                disabled={refreshing || loading}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
                            >
                                <RefreshCw size={13} className={refreshing ? 'spin-anim' : ''} />
                                {refreshing ? 'Refreshingâ€¦' : 'Refresh'}
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/staff/tasks')}
                                style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
                            >
                                View All Tasks
                            </button>
                        </div>
                    </div>
                </header>

                {/* Inline stats bar */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                    {stats.map(({ label, value, icon, color }) => (
                        <div key={label} style={{ flex: 1, background: 'white', borderRadius: '10px', padding: '0.85rem 1.1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: '0.75rem', border: `1px solid ${color}22` }}>
                            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {icon}
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>{label}</p>
                                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                                    {loading ? 'â€”' : value}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Orders table */}
                <section className="orders-section" style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', overflow: 'hidden', padding: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 1.25rem', borderBottom: '1px solid #f1f5f9' }}>
                        <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>Recent Orders</h2>
                        <button
                            onClick={() => navigate('/staff/tasks')}
                            style={{ fontSize: '0.8rem', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                        >
                            View all â†’
                        </button>
                    </div>

                    {loading && (
                        <p style={{ color: '#94a3b8', padding: '1.25rem', margin: 0, fontSize: '0.88rem' }}>Loading ordersâ€¦</p>
                    )}
                    {!loading && orders.length === 0 && (
                        <p style={{ color: '#94a3b8', padding: '1.25rem', margin: 0, fontSize: '0.88rem' }}>No orders yet.</p>
                    )}
                    {!loading && orders.length > 0 && (
                        <div className="orders-table-container" style={{ padding: 0 }}>
                            <table className="orders-table" style={{ fontSize: '0.85rem' }}>
                                <thead>
                                    <tr>
                                        <th style={{ padding: '0.6rem 1.25rem' }}>Order ID</th>
                                        <th style={{ padding: '0.6rem 0.75rem' }}>Customer</th>
                                        <th style={{ padding: '0.6rem 0.75rem' }}>Service</th>
                                        <th style={{ padding: '0.6rem 0.75rem' }}>Status</th>
                                        <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.slice(0, 10).map(order => (
                                        <tr key={order.id}>
                                            <td style={{ padding: '0.55rem 1.25rem', fontWeight: 500, color: '#6366f1' }}>{order.id}</td>
                                            <td style={{ padding: '0.55rem 0.75rem' }}>{order.customer}</td>
                                            <td style={{ padding: '0.55rem 0.75rem', color: '#64748b' }}>{order.service}</td>
                                            <td style={{ padding: '0.55rem 0.75rem' }}>
                                                <span className={`status-badge status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.55rem 0.75rem', textAlign: 'center' }}>
                                                <button
                                                    className="btn-action"
                                                    onClick={() => navigate('/staff/update-order', { state: { order } })}
                                                    title="Update Order Status"
                                                    style={{ padding: '0.3rem 0.5rem' }}
                                                >
                                                    <Edit size={15} />
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
