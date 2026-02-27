import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DeliverySidebar from '../components/DeliverySidebar';
import { Truck, MapPin, Package, Clock, RefreshCw, Calendar } from 'lucide-react';
import './DeliveryDashboard.css';

const API = 'http://localhost:5000/api';
const TODAY = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

// ─── Sort Helpers ────────────────────────────────────────────────
const parseSlotMinutes = (slot) => {
    if (!slot) return 9999;
    const match = slot.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return 9999;
    let [, h, m, meridiem] = match;
    h = parseInt(h); m = parseInt(m);
    if (meridiem.toUpperCase() === 'PM' && h !== 12) h += 12;
    if (meridiem.toUpperCase() === 'AM' && h === 12) h = 0;
    return h * 60 + m;
};

const pickupKey = (order) => {
    if (!order.pickup_date) return Infinity;
    const datePart = order.pickup_date.slice(0, 10).replace(/-/g, '');
    const slotPart = String(parseSlotMinutes(order.pickup_time)).padStart(4, '0');
    return Number(`${datePart}${slotPart}`);
};

const isToday = (dateStr) => dateStr && dateStr.slice(0, 10) === TODAY;

const SORT_OPTIONS = [
    { value: 'today',     label: '📅 Today First' },
    { value: 'date_asc',  label: 'Pickup Date ↑' },
    { value: 'date_desc', label: 'Pickup Date ↓' },
    { value: 'newest',    label: 'Newest First' },
    { value: 'oldest',    label: 'Oldest First' },
];

const sortOrders = (orders, mode) => {
    const arr = [...orders];
    if (mode === 'today') {
        return arr.sort((a, b) => {
            const aT = isToday(a.pickup_date) ? 0 : 1;
            const bT = isToday(b.pickup_date) ? 0 : 1;
            if (aT !== bT) return aT - bT;
            return pickupKey(a) - pickupKey(b);
        });
    }
    if (mode === 'date_asc')  return arr.sort((a, b) => pickupKey(a) - pickupKey(b));
    if (mode === 'date_desc') {
        return arr.sort((a, b) => {
            const aK = pickupKey(a), bK = pickupKey(b);
            if (aK === Infinity && bK === Infinity) return 0;
            if (aK === Infinity) return 1;
            if (bK === Infinity) return -1;
            return bK - aK;
        });
    }
    if (mode === 'newest') return arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (mode === 'oldest') return arr.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    return arr;
};
// ─────────────────────────────────────────────────────────────────

const STATUS_LABELS = {
    pending:            'New Order',
    confirmed:          'Confirmed',
    pickup_scheduled:   'Pickup Scheduled',
    picked_up:          'Picked Up',
    out_for_processing: 'Out for Processing',
    processing:         'In Process',
    ready:              'Ready',
    out_for_delivery:   'Out for Delivery',
    delivery_scheduled: 'Delivery Scheduled',
    delivered:          'Delivered',
    cancelled:          'Cancelled',
};

const statusColor = (status) => {
    const map = {
        pending:            '#94a3b8',
        confirmed:          '#64748b',
        pickup_scheduled:   '#f59e0b',
        picked_up:          '#3b82f6',
        out_for_processing: '#8b5cf6',
        processing:         '#6366f1',
        ready:              '#14b8a6',
        out_for_delivery:   '#0ea5e9',
        delivery_scheduled: '#06b6d4',
        delivered:          '#10b981',
        cancelled:          '#ef4444',
    };
    return map[status] || '#94a3b8';
};

const DeliveryDashboard = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [driverName, setDriverName] = useState('Driver');
    const [sortMode, setSortMode] = useState('today');

    const token = localStorage.getItem('token');

    // Get driver name from stored user info
    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.first_name) setDriverName(user.first_name);
        } catch (_) {}
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/orders/delivery-orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            setOrders(data);
        } catch (_) {
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    // Stats
    const pendingCount = orders.filter(o =>
        ['pending', 'confirmed', 'pickup_scheduled'].includes(o.status)
    ).length;
    const inProgressCount = orders.filter(o =>
        ['picked_up', 'out_for_processing', 'processing', 'ready', 'out_for_delivery', 'delivery_scheduled'].includes(o.status)
    ).length;

    // Sort then show top 6 on overview
    const recentOrders = sortOrders(orders, sortMode).slice(0, 6);

    return (
        <div className="dashboard">
            <DeliverySidebar activePage="overview" />

            <main className="dashboard-main">
                {/* Header */}
                <header className="dashboard-header">
                    <div className="header-content">
                        <h1>Welcome, {driverName}!</h1>
                    
                    </div>
                    <button className="btn-primary" onClick={fetchOrders} disabled={loading}>
                        <RefreshCw size={16} style={{ marginRight: '0.5rem' }} />
                        Refresh
                    </button>
                </header>

                {/* Stats Cards */}
                <section className="stats-section">
                    <div className="stat-card">
                        <div>
                            <p className="stat-label">Total Active</p>
                            <h3 className="stat-value">{loading ? '—' : orders.length}</h3>
                        </div>
                        <Truck size={22} color="#0ea5e9" style={{ opacity: 0.8, flexShrink: 0 }} />
                    </div>

                    <div className="stat-card">
                        <div>
                            <p className="stat-label">Pending Pickup</p>
                            <h3 className="stat-value">{loading ? '—' : pendingCount}</h3>
                        </div>
                        <Package size={22} color="#f59e0b" style={{ opacity: 0.8, flexShrink: 0 }} />
                    </div>

                    <div className="stat-card">
                        <div>
                            <p className="stat-label">In Progress</p>
                            <h3 className="stat-value">{loading ? '—' : inProgressCount}</h3>
                        </div>
                        <Clock size={22} color="#8b5cf6" style={{ opacity: 0.8, flexShrink: 0 }} />
                    </div>
                </section>

                {/* Active Tasks */}
                <section className="orders-section">
                    <div className="section-header">
                        <h2>Active Tasks</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <select
                                value={sortMode}
                                onChange={(e) => setSortMode(e.target.value)}
                                style={{
                                    fontSize: '0.8rem',
                                    padding: '0.35rem 0.7rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    background: 'white',
                                    color: '#1e293b',
                                    cursor: 'pointer',
                                }}
                            >
                                {SORT_OPTIONS.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                            <Link to="/active-deliveries" className="view-all">View All →</Link>
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                            Loading orders...
                        </div>
                    ) : recentOrders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px' }}>
                            <Package size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                            <h3 style={{ color: '#1e293b' }}>No Active Orders</h3>
                            <p style={{ color: '#64748b' }}>New customer orders will appear here.</p>
                        </div>
                    ) : (
                        <div className="delivery-grid">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="delivery-card">
                                    <div className="delivery-header">
                                        <span className="delivery-id">{order.order_number}</span>
                                        <span
                                            className="delivery-status"
                                            style={{
                                                background: statusColor(order.status) + '20',
                                                color: statusColor(order.status),
                                                fontSize: '0.78rem',
                                                fontWeight: 600,
                                                padding: '0.3rem 0.7rem',
                                                borderRadius: '999px',
                                            }}
                                        >
                                            {STATUS_LABELS[order.status] || order.status}
                                        </span>
                                    </div>

                                    <div className="customer-details">
                                        <h3>{order.first_name} {order.last_name}</h3>
                                        {order.address && (
                                            <p><MapPin size={14} /> {order.address}{order.city ? `, ${order.city}` : ''}</p>
                                        )}
                                        {order.pickup_date && (
                                            <p style={{
                                                marginTop: '0.4rem',
                                                fontSize: '0.85rem',
                                                color: isToday(order.pickup_date) ? '#10b981' : '#64748b',
                                                fontWeight: isToday(order.pickup_date) ? 600 : 400,
                                            }}>
                                                <Calendar size={14} />
                                                {isToday(order.pickup_date)
                                                    ? ' Today'
                                                    : ` ${new Date(order.pickup_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                                                }
                                            </p>
                                        )}
                                        {order.pickup_time && (
                                            <p style={{ marginTop: '0.25rem', fontSize: '0.85rem' }}>
                                                <Clock size={14} /> {order.pickup_time}
                                            </p>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                        <span className={`delivery-type type-${order.delivery_option}`}>
                                            {order.delivery_option === 'delivery' ? 'Pickup & Delivery' : 'Pickup Only'}
                                        </span>
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

export default DeliveryDashboard;
