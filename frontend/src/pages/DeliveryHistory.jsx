import { useState, useEffect } from 'react';
import DeliverySidebar from '../components/DeliverySidebar';
import { MapPin, Clock, CheckCircle, Calendar, Package, Phone, Truck, RefreshCw } from 'lucide-react';
import './DeliveryDashboard.css';
import './ActiveDeliveries.css';

const API = 'http://localhost:5000/api';

const STATUS_LABELS = {
    pending:            'New Order',
    confirmed:          'Confirmed',
    pickup_scheduled:   'Pickup Scheduled',
    picked_up:          'Picked Up',
    out_for_processing: 'Out for Processing',
    processing:         'In Process',
    ready:              'Ready',
    finished:           'Finished',
    out_for_delivery:   'Out for Delivery',
    delivery_scheduled: 'Delivery Scheduled',
    delivered:          'Delivered',
    cancelled:          'Cancelled',
};

const statusColor = (status) => {
    const map = {
        out_for_processing: '#8b5cf6',
        finished:           '#22c55e',
        delivered:          '#10b981',
        cancelled:          '#ef4444',
    };
    return map[status] || '#10b981';
};

const fmtDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const fmtTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const DeliveryHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState('');
    const [activeTab, setActiveTab] = useState('delivery');

    const token = localStorage.getItem('token');

    const fetchHistory = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API}/orders/delivery-history`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to load history');
            const data = await res.json();
            setHistory(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchHistory(); }, []);

    // Split by tab
    const deliveryHistory = history.filter(o => o.delivery_option === 'delivery');
    const pickupHistory   = history.filter(o => o.delivery_option === 'pickup');
    const filtered = activeTab === 'delivery' ? deliveryHistory : pickupHistory;

    return (
        <div className="dashboard">
            <DeliverySidebar activePage="history" />

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <h1>Delivery History</h1>
                        <p>Past completed tasks</p>
                    </div>
                    <button className="btn-primary" onClick={fetchHistory} disabled={loading}>
                        <RefreshCw size={16} style={{ marginRight: '0.5rem' }} />
                        Refresh
                    </button>
                </header>

                {/* Tabs */}
                <div className="ad-tabs">
                    <button
                        className={`ad-tab ${activeTab === 'delivery' ? 'ad-tab-active' : ''}`}
                        onClick={() => setActiveTab('delivery')}
                    >
                        <Truck size={16} />
                        Pickup &amp; Delivery
                        <span className="ad-tab-badge">{deliveryHistory.length}</span>
                    </button>
                    <button
                        className={`ad-tab ${activeTab === 'pickup' ? 'ad-tab-active' : ''}`}
                        onClick={() => setActiveTab('pickup')}
                    >
                        <Package size={16} />
                        Pickup Only
                        <span className="ad-tab-badge">{pickupHistory.length}</span>
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="ad-center">
                        <div className="ad-spinner" />
                        <p>Loading history...</p>
                    </div>
                ) : error ? (
                    <div className="ad-center ad-error">
                        <p>{error}</p>
                        <button className="btn-primary" onClick={fetchHistory}>Retry</button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="ad-center">
                        <CheckCircle size={56} color="#cbd5e1" />
                        <h3>No History Yet</h3>
                        <p style={{ color: '#64748b' }}>
                            {activeTab === 'delivery'
                                ? 'Completed pickup & delivery orders will appear here.'
                                : 'Pickup only orders dropped at laundry will appear here.'}
                        </p>
                    </div>
                ) : (
                    <div className="delivery-grid">
                        {filtered.map(order => (
                            <div key={order.id} className="delivery-card ad-card">
                                {/* Card Header */}
                                <div className="delivery-header">
                                    <span className="delivery-id">{order.order_number}</span>
                                    <span
                                        className="delivery-status"
                                        style={{
                                            background: statusColor(order.status) + '20',
                                            color: statusColor(order.status),
                                        }}
                                    >
                                        {STATUS_LABELS[order.status] || order.status}
                                    </span>
                                </div>

                                {/* Customer Info */}
                                <div className="customer-details">
                                    <h3>{order.first_name} {order.last_name}</h3>
                                    {order.address && (
                                        <p><MapPin size={13} /> {order.address}{order.city ? `, ${order.city}` : ''}</p>
                                    )}
                                    {(order.customer_phone || order.phone) && (
                                        <p style={{ marginTop: '0.3rem' }}>
                                            <Phone size={13} /> {order.customer_phone || order.phone}
                                        </p>
                                    )}
                                    <p style={{ marginTop: '0.3rem' }}>
                                        <Package size={13} /> {order.items?.length || 0} item(s)
                                        {order.items?.length > 0 && (
                                            <span style={{ color: '#94a3b8', marginLeft: '0.4rem', fontSize: '0.82rem' }}>
                                                — {order.items.map(i => `${i.item_name}${i.quantity > 1 ? ` x${i.quantity}` : ''}`).join(', ')}
                                            </span>
                                        )}
                                    </p>
                                </div>

                                {/* Type badge */}
                                <div>
                                    <span className={`delivery-type type-${order.delivery_option}`}>
                                        {order.delivery_option === 'delivery' ? 'Pickup & Delivery' : 'Pickup Only'}
                                    </span>
                                </div>

                                {/* Pickup date & completed time */}
                                <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    {order.pickup_date && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                            <Calendar size={12} />
                                            Pickup: {fmtDate(order.pickup_date)}
                                            {order.pickup_time && ` · ${order.pickup_time}`}
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <Clock size={12} />
                                        Completed: {fmtDate(order.updated_at)} · {fmtTime(order.updated_at)}
                                    </div>
                                </div>

                                {/* Done badge */}
                                <div className="card-actions" style={{ marginTop: '0.75rem' }}>
                                    <div className="ad-done-badge">
                                        <CheckCircle size={16} />
                                        {STATUS_LABELS[order.status]}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default DeliveryHistory;

