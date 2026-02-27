import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DeliverySidebar from '../components/DeliverySidebar';
import { Truck, MapPin, Package, Clock, RefreshCw } from 'lucide-react';
import './DeliveryDashboard.css';

const API = 'http://localhost:5000/api';

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

    // Show latest 6 orders on overview
    const recentOrders = orders.slice(0, 6);

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
                        <Link to="/active-deliveries" className="view-all">View All →</Link>
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
                                        {order.pickup_time && (
                                            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                                <Clock size={14} /> Time Slot: {order.pickup_time}
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
