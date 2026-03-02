import { useNavigate, useLocation } from 'react-router-dom';
import { Edit, RefreshCw, ClipboardList, Clock, CheckCircle, Check, User, X } from 'lucide-react';
import StaffSidebar from '../components/StaffSidebar';
import { useStaffOrders } from '../context/StaffOrdersContext';
import { useState, useEffect } from 'react';
import './StaffDashboard.css';

const workflowSteps = ['Pending', 'In Progress', 'Ready', 'Completed'];

const StaffDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orders, loading, lastUpdated, fetchOrders, updateOrderStatus } = useStaffOrders();
    const [refreshing, setRefreshing] = useState(false);
    const [modalOrder, setModalOrder] = useState(null);

    // Auto-open modal when navigated from All Tasks with an order
    useEffect(() => {
        if (location.state?.openOrder) {
            setModalOrder(location.state.openOrder);
            // Clear state so refresh doesn't re-open
            window.history.replaceState({}, '');
        }
    }, [location.state]);

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
                                        <th style={{ padding: '0.6rem 0.75rem' }}>Items</th>
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
                                                    onClick={() => setModalOrder(order)}
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

            {/* Update Status Modal */}
            {modalOrder && (() => {
                const live = orders.find(o => o.id === modalOrder.id) || modalOrder;
                return (
                    <div
                        onClick={() => setModalOrder(null)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
                    >
                        <div
                            onClick={e => e.stopPropagation()}
                            style={{ background: '#fff', borderRadius: '18px', padding: '1.75rem', width: '100%', maxWidth: '460px', boxShadow: '0 8px 40px rgba(0,0,0,0.18)', position: 'relative' }}
                        >
                            {/* Close */}
                            <button
                                onClick={() => setModalOrder(null)}
                                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0.2rem' }}
                            >
                                <X size={20} />
                            </button>

                            {/* Order header */}
                            <div style={{ marginBottom: '1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{live.id}</h2>
                                    <span className={`status-badge status-${live.status.toLowerCase().replace(/\s+/g, '-')}`}>{live.status}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem', color: '#64748b', fontSize: '0.88rem' }}>
                                    <User size={14} />
                                    <span>{live.customer}</span>
                                </div>
                            </div>

                            {/* Divider */}
                            <div style={{ borderTop: '1px solid #f1f5f9', marginBottom: '1.25rem' }} />

                            {/* Workflow */}
                            <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Update Progress</p>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.25rem' }}>
                                {workflowSteps.map((step, index) => {
                                    const currentIndex = workflowSteps.indexOf(live.status);
                                    const isCompleted = currentIndex >= index;
                                    const isActive = live.status === step;
                                    return (
                                        <div
                                            key={step}
                                            onClick={() => {
                                                updateOrderStatus(live.id, step);
                                                setModalOrder(prev => ({ ...prev, status: step }));
                                            }}
                                            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                                        >
                                            <div style={{
                                                width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem',
                                                background: isCompleted ? '#0284c7' : '#f1f5f9',
                                                color: isCompleted ? '#fff' : '#94a3b8',
                                                border: isActive ? '2.5px solid #0284c7' : '2px solid transparent',
                                                boxShadow: isActive ? '0 0 0 3px #0284c720' : 'none',
                                                transition: 'all 0.2s'
                                            }}>
                                                {isCompleted ? <Check size={16} /> : <span>{index + 1}</span>}
                                            </div>
                                            <span style={{ fontSize: '0.75rem', color: isActive ? '#0284c7' : '#64748b', fontWeight: isActive ? 700 : 400, textAlign: 'center' }}>{step}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default StaffDashboard;
