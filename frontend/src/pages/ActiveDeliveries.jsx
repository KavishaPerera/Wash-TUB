import { useState, useEffect } from 'react';
import DeliverySidebar from '../components/DeliverySidebar';
import { MapPin, Package, Phone, ChevronRight, RefreshCw, CheckCircle, Truck, X } from 'lucide-react';
import './DeliveryDashboard.css';
import './ActiveDeliveries.css';

const API = 'http://localhost:5000/api';

// ── Status configuration ──────────────────────────────────────────
const STATUS_LABELS = {
    pending:            'New Order',
    confirmed:          'Confirmed',
    pickup_scheduled:   'Pickup Scheduled',
    picked_up:          'Picked Up',
    out_for_processing: 'Out for Processing',
    processing:         'In Process',
    ready:              'Ready for Delivery',
    out_for_delivery:   'Out for Delivery',
    delivery_scheduled: 'Delivery Scheduled',
    delivered:          'Delivered',
    cancelled:          'Cancelled',
};

// Next allowed statuses per order type for delivery person
const NEXT_STATUSES = {
    delivery: {
        pending:            ['pickup_scheduled'],
        confirmed:          ['pickup_scheduled'],
        pickup_scheduled:   ['picked_up'],
        picked_up:          ['out_for_processing'],
        // 'out_for_processing' → 'ready' is done by staff, not delivery
        ready:              ['out_for_delivery'],
        out_for_delivery:   ['delivery_scheduled'],
        delivery_scheduled: ['delivered'],
    },
    pickup: {
        pending:            ['pickup_scheduled'],
        confirmed:          ['pickup_scheduled'],
        pickup_scheduled:   ['picked_up'],
        picked_up:          ['out_for_processing'],
        out_for_processing: ['delivered'],
    },
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

// ── Component ─────────────────────────────────────────────────────
const ActiveDeliveries = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('delivery'); // 'delivery' | 'pickup'
    const [modal, setModal] = useState(null); // { order }
    const [updating, setUpdating] = useState(false);
    const [toast, setToast] = useState('');

    const token = localStorage.getItem('token');

    const fetchOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API}/orders/delivery-orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to load orders');
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdating(true);
        try {
            const res = await fetch(`${API}/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error('Update failed');
            setToast(`Status updated to "${STATUS_LABELS[newStatus]}"`);
            setTimeout(() => setToast(''), 3000);
            setModal(null);
            await fetchOrders();
        } catch (err) {
            setToast('Failed to update status');
            setTimeout(() => setToast(''), 3000);
        } finally {
            setUpdating(false);
        }
    };

    // Filter by order type
    const filtered = orders.filter(o =>
        activeTab === 'delivery' ? o.delivery_option === 'delivery' : o.delivery_option === 'pickup'
    );

    const deliveryCount = orders.filter(o => o.delivery_option === 'delivery').length;
    const pickupCount   = orders.filter(o => o.delivery_option === 'pickup').length;

    return (
        <div className="dashboard">
            <DeliverySidebar activePage="active" />

            <main className="dashboard-main">
                {/* Header */}
                <header className="dashboard-header">
                    <div className="header-content">
                        <h1>Active Orders</h1>
            
                    </div>
                    <button className="btn-primary" onClick={fetchOrders} disabled={loading}>
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
                        <span className="ad-tab-badge">{deliveryCount}</span>
                    </button>
                    <button
                        className={`ad-tab ${activeTab === 'pickup' ? 'ad-tab-active' : ''}`}
                        onClick={() => setActiveTab('pickup')}
                    >
                        <Package size={16} />
                        Pickup Only
                        <span className="ad-tab-badge">{pickupCount}</span>
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="ad-center">
                        <div className="ad-spinner" />
                        <p>Loading orders...</p>
                    </div>
                ) : error ? (
                    <div className="ad-center ad-error">
                        <p>{error}</p>
                        <button className="btn-primary" onClick={fetchOrders}>Retry</button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="ad-center">
                        <Package size={56} color="#cbd5e1" />
                        <h3>No Active Orders</h3>
                        <p style={{ color: '#64748b' }}>No {activeTab === 'delivery' ? 'pickup & delivery' : 'pickup only'} orders at the moment.</p>
                    </div>
                ) : (
                    <div className="delivery-grid">
                        {filtered.map(order => {
                            const nextStatuses = (NEXT_STATUSES[order.delivery_option] || {})[order.status] || [];
                            const isDone = order.status === 'delivered' || order.status === 'cancelled';

                            return (
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
                                        </p>
                                    </div>

                                    {/* Type badge */}
                                    <div>
                                        <span className={`delivery-type type-${order.delivery_option}`}>
                                            {order.delivery_option === 'delivery' ? 'Pickup & Delivery' : 'Pickup Only'}
                                        </span>
                                    </div>

                                    {/* Action */}
                                    <div className="card-actions">
                                        {isDone ? (
                                            <div className="ad-done-badge">
                                                <CheckCircle size={16} />
                                                {STATUS_LABELS[order.status]}
                                            </div>
                                        ) : nextStatuses.length > 0 ? (
                                            <button
                                                className="btn-card-action btn-card-primary"
                                                style={{ flex: 1 }}
                                                onClick={() => setModal({ order, nextStatuses })}
                                            >
                                                Update Status <ChevronRight size={16} />
                                            </button>
                                        ) : (
                                            <span className="ad-no-action">
                                                {order.status === 'processing' ? '🧺 Being processed by staff' :
                                                 order.status === 'out_for_processing' ? '⏳ Dropped at laundry — awaiting processing' :
                                                 'Waiting...'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Status Update Modal */}
            {modal && (
                <div className="ad-modal-overlay" onClick={() => setModal(null)}>
                    <div className="ad-modal" onClick={e => e.stopPropagation()}>
                        <div className="ad-modal-header">
                            <h3>Update Order Status</h3>
                            <button className="ad-modal-close" onClick={() => setModal(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <p className="ad-modal-sub">
                            Order <strong>{modal.order.order_number}</strong> — {modal.order.first_name} {modal.order.last_name}
                        </p>
                        <p className="ad-modal-current">
                            Current: <span style={{ color: statusColor(modal.order.status), fontWeight: 600 }}>
                                {STATUS_LABELS[modal.order.status]}
                            </span>
                        </p>
                        <div className="ad-modal-options">
                            {modal.nextStatuses.map(s => (
                                <button
                                    key={s}
                                    className="ad-modal-option"
                                    style={{ borderColor: statusColor(s), color: statusColor(s) }}
                                    disabled={updating}
                                    onClick={() => handleStatusUpdate(modal.order.id, s)}
                                >
                                    <ChevronRight size={16} />
                                    {STATUS_LABELS[s]}
                                </button>
                            ))}
                        </div>
                        {updating && <p className="ad-modal-loading">Updating...</p>}
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className="ad-toast">{toast}</div>
            )}
        </div>
    );
};

export default ActiveDeliveries;
