import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import './CustomerDashboard.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STATUS_LABEL = {
    pending: 'Order Placed',
    confirmed: 'Confirmed',
    pickup_scheduled: 'Pickup Scheduled',
    picked_up: 'Picked Up',
    out_for_processing: 'Out for Processing',
    processing: 'Processing',
    ready: 'Ready',
    finished: 'Finished',
    out_for_delivery: 'Out for Delivery',
    delivery_scheduled: 'Delivery Scheduled',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

// Map backend statuses to filter tabs
const FILTER_MAP = {
    all: null,
    active: ['pending', 'confirmed', 'pickup_scheduled', 'picked_up', 'out_for_processing', 'processing', 'ready', 'completed', 'out_for_delivery', 'delivery_scheduled'],
    delivered: ['delivered'],
    cancelled: ['cancelled'],
};

const MyOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');

    // Selected order for detail modal
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API}/orders/my-orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setOrders(data);
        } catch {
            setError('Could not load orders. Please refresh.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/signin');
    };

    const filteredOrders = (() => {
        const allowed = FILTER_MAP[activeFilter];
        if (!allowed) return orders;
        return orders.filter(o => allowed.includes(o.status));
    })();

    const fmtDate = (iso) => {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const statusClass = (s) => `status-${s?.replace(/_/g, '-')}`;

    const downloadReceipt = (order) => {
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const pageW = doc.internal.pageSize.getWidth();
        const margin = 48;
        const contentW = pageW - margin * 2;
        let y = 0;

        // ── Header band ──────────────────────────────────────────────
        doc.setFillColor(14, 165, 233);
        doc.rect(0, 0, pageW, 80, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.text('WashTub Laundry', margin, 32);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text('Official Payment Receipt', margin, 52);
        doc.text('www.washtub.lk  |  +94 11 790 6108', margin, 66);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text('RECEIPT', pageW - margin, 38, { align: 'right' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`, pageW - margin, 54, { align: 'right' });
        if (order.order_number) {
            doc.text(`Order #: ${order.order_number}`, pageW - margin, 68, { align: 'right' });
        }

        y = 100;

        // ── Status badge ──────────────────────────────────────────────
        doc.setFillColor(220, 252, 231);
        doc.roundedRect(margin, y, contentW, 32, 6, 6, 'F');
        doc.setTextColor(21, 128, 61);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Payment successful - Your order is now being processed', margin + 14, y + 21);

        y += 48;

        // ── Customer details ──────────────────────────────────────────
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Customer Details', margin, y);
        y += 4;
        doc.setDrawColor(14, 165, 233);
        doc.setLineWidth(1.5);
        doc.line(margin, y, margin + 120, y);
        y += 14;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);

        const pm = order.payment_method || '';
        const pmLabel = pm === 'visa' ? 'Visa Card' : pm === 'mastercard' ? 'Master Card' : pm === 'amex' ? 'American Express' : pm === 'cash' ? 'Cash' : pm.replace(/_/g, ' ');

        const details = [
            ['Name',            order.full_name  || '—'],
            ['Phone',           order.phone      || '—'],
            [order.delivery_option === 'delivery' ? 'Delivery Address' : 'Pickup Type',
                                order.address    || '—'],
            ['Pickup Date',     order.pickup_date ? fmtDate(order.pickup_date) : '—'],
            ['Pickup Time',     order.pickup_time || '—'],
            ['Payment Method',  pmLabel],
        ];

        details.forEach(([label, value]) => {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(100, 116, 139);
            doc.text(label + ':', margin, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(30, 41, 59);
            doc.text(value, margin + 130, y);
            y += 16;
        });

        y += 10;

        // ── Order items table ─────────────────────────────────────────
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text('Order Items', margin, y);
        y += 4;
        doc.setDrawColor(14, 165, 233);
        doc.setLineWidth(1.5);
        doc.line(margin, y, margin + 90, y);
        y += 12;

        doc.setFillColor(241, 245, 249);
        doc.rect(margin, y, contentW, 22, 'F');
        doc.setTextColor(71, 85, 105);
        doc.setFontSize(9.5);
        const col = {
            item:   margin + 6,
            method: margin + 200,
            qty:    margin + 300,
            price:  margin + 360,
            total:  margin + contentW - 6,
        };
        y += 15;
        doc.text('Item / Service', col.item,   y);
        doc.text('Method',         col.method, y);
        doc.text('Qty',            col.qty,    y);
        doc.text('Unit Price',     col.price,  y);
        doc.text('Total',          col.total,  y, { align: 'right' });
        y += 6;

        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.5);
        doc.line(margin, y, margin + contentW, y);
        y += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(30, 41, 59);

        const items = order.items || [];
        if (items.length === 0) {
            doc.setTextColor(148, 163, 184);
            doc.text('No item details available.', margin + 6, y + 10);
            y += 24;
        } else {
            items.forEach((item, idx) => {
                if (idx % 2 === 0) {
                    doc.setFillColor(248, 250, 252);
                    doc.rect(margin, y - 4, contentW, 18, 'F');
                }
                doc.setTextColor(30, 41, 59);
                const itemLabel = item.item_name + (item.unit_type ? ` (${item.unit_type})` : '');
                doc.text(itemLabel,                                    col.item,   y + 8);
                doc.text(item.method || '—',                           col.method, y + 8);
                doc.text(String(item.quantity ?? 1),                   col.qty,    y + 8);
                doc.text(`LKR ${Number(item.price).toFixed(2)}`,       col.price,  y + 8);
                doc.text(`LKR ${Number(item.subtotal).toFixed(2)}`,    col.total,  y + 8, { align: 'right' });
                y += 18;
            });
        }

        y += 4;
        doc.setDrawColor(203, 213, 225);
        doc.line(margin, y, margin + contentW, y);
        y += 14;

        // ── Totals ────────────────────────────────────────────────────
        const drawTotalRow = (label, value, bold = false, color = [30, 41, 59]) => {
            if (bold) {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(11);
            } else {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
            }
            doc.setTextColor(...color);
            doc.text(label, pageW - margin - 150, y);
            doc.text(value, pageW - margin, y, { align: 'right' });
            y += 18;
        };

        drawTotalRow('Subtotal',     `LKR ${Number(order.subtotal).toFixed(2)}`);
        drawTotalRow('Delivery Fee', `LKR ${Number(order.delivery_fee || 0).toFixed(2)}`);
        if (parseFloat(order.discount || 0) > 0) {
            drawTotalRow('Promo Discount', `- LKR ${Number(order.discount).toFixed(2)}`, false, [22, 163, 74]);
        }
        y += 2;
        doc.setDrawColor(14, 165, 233);
        doc.setLineWidth(1);
        doc.line(pageW - margin - 160, y, pageW - margin, y);
        y += 10;
        drawTotalRow('Total Paid', `LKR ${Number(order.total).toFixed(2)}`, true, [14, 165, 233]);

        y += 20;

        // ── Footer ────────────────────────────────────────────────────
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y, contentW, 50, 'F');
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text('Thank you for choosing WashTub Laundry!', pageW / 2, y + 18, { align: 'center' });
        doc.text('For queries, contact us at support@washtub.lk or call +94 11 790 6108', pageW / 2, y + 32, { align: 'center' });

        const filename = order.order_number ? `Receipt-${order.order_number}.pdf` : 'WashTub-Receipt.pdf';
        doc.save(filename);
    };

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h2 className="logo">WashTub</h2>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/customer-dashboard" className="nav-item">
                        <span>Overview</span>
                    </Link>
                    <a href="#" className="nav-item active">
                        <span>My Orders</span>
                    </a>
                    <Link to="/pricing" className="nav-item">
                        <span>New Order</span>
                    </Link>
                    <Link to="/notifications" className="nav-item">
                        <span>Notifications</span>
                    </Link>
                    <Link to="/profile" className="nav-item">
                        <span>Profile</span>
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
                            <h1>My Orders</h1>
                            <p>View and track all your laundry orders</p>
                        </div>
                    </div>
                </header>

                {/* Filter Tabs */}
                <div className="filter-tabs">
                    {[
                        { key: 'all', label: 'All Orders' },
                        { key: 'active', label: 'Active' },
                        { key: 'delivered', label: 'Delivered' },
                        { key: 'cancelled', label: 'Cancelled' },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            className={`filter-tab ${activeFilter === key ? 'active' : ''}`}
                            onClick={() => setActiveFilter(key)}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Orders Grid */}
                <section className="orders-section">
                    {loading && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                            Loading orders…
                        </div>
                    )}

                    {error && (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
                            <button onClick={fetchOrders} className="btn btn-primary btn-small">Retry</button>
                        </div>
                    )}

                    {!loading && !error && filteredOrders.length === 0 && (
                        <div className="no-orders">
                            <span className="no-orders-icon">📦</span>
                            <h3>No orders found</h3>
                            <p>
                                {activeFilter === 'all'
                                    ? "You haven't placed any orders yet."
                                    : `You don't have any ${activeFilter} orders.`}
                            </p>
                            {activeFilter === 'all' && (
                                <button className="btn btn-primary" onClick={() => navigate('/pricing')}>
                                    Place Your First Order
                                </button>
                            )}
                        </div>
                    )}

                    {!loading && !error && filteredOrders.length > 0 && (
                        <div className="orders-grid">
                            {filteredOrders.map((order) => (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">
                                        <span className="order-id">{order.order_number}</span>
                                        <span className={`order-status ${statusClass(order.status)}`}>
                                            {STATUS_LABEL[order.status] || order.status}
                                        </span>
                                    </div>

                                    <div className="order-details">
                                        <h3>
                                            {order.items && order.items.length > 0
                                                ? order.items.map(i => i.item_name).join(', ')
                                                : 'Laundry Order'}
                                        </h3>
                                        <p>📦 {order.items?.length ?? 0} item{order.items?.length !== 1 ? 's' : ''}</p>
                                        <p>📅 {fmtDate(order.created_at)}</p>
                                        {order.pickup_date && (
                                            <p>🗓 Pickup: {fmtDate(order.pickup_date)} {order.pickup_time && `at ${order.pickup_time}`}</p>
                                        )}
                                        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                            💰 LKR {parseFloat(order.total).toFixed(2)}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                        <span className={`order-type type-${order.delivery_option}`}>
                                            {order.delivery_option === 'delivery' ? 'Home Delivery' : 'Self Pickup'}
                                        </span>
                                    </div>

                                    <div className="card-actions">
                                        <button
                                            className="btn-card-outline"
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            Details
                                        </button>
                                        {order.payment_status === 'paid' && (
                                            <button
                                                className="btn-card-outline"
                                                onClick={() => downloadReceipt(order)}
                                                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                                            >
                                                <Download size={14} />
                                                Download Receipt
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* ── Order Detail Modal ─────────────────────────────────────── */}
            {selectedOrder && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '580px', boxShadow: '0 24px 64px rgba(0,0,0,0.18)', overflow: 'hidden', animation: 'modalSlideUp 0.25s ease both' }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h2 style={{ margin: '0 0 0.4rem', fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                                    {selectedOrder.order_number}
                                </h2>
                                <span className={`order-status ${statusClass(selectedOrder.status)}`}>
                                    {STATUS_LABEL[selectedOrder.status] || selectedOrder.status}
                                </span>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', width: 36, height: 36, cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>✕</button>
                        </div>

                        {/* Meta */}
                        <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.88rem', color: '#475569' }}>
                            <span>📅 Placed: {fmtDate(selectedOrder.created_at)}</span>
                            <span>🚚 {selectedOrder.delivery_option === 'delivery' ? 'Home Delivery' : 'Self Pickup'}</span>
                            <span>💳 {selectedOrder.payment_method?.replace(/_/g, ' ')}</span>
                            {selectedOrder.pickup_date && <span>🗓 Pickup: {fmtDate(selectedOrder.pickup_date)} {selectedOrder.pickup_time || ''}</span>}
                        </div>

                        {/* Items Table */}
                        <div style={{ padding: '1.25rem 1.5rem' }}>
                            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>Items</p>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                        <th style={{ textAlign: 'left', padding: '0.4rem 0.6rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Item</th>
                                        <th style={{ textAlign: 'left', padding: '0.4rem 0.6rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Qty</th>
                                        <th style={{ textAlign: 'left', padding: '0.4rem 0.6rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Price</th>
                                        <th style={{ textAlign: 'left', padding: '0.4rem 0.6rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase' }}>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(selectedOrder.items || []).map((item, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                            <td style={{ padding: '0.65rem 0.6rem', color: '#1e293b', fontWeight: 500 }}>{item.item_name}</td>
                                            <td style={{ padding: '0.65rem 0.6rem', color: '#475569' }}>{item.quantity}</td>
                                            <td style={{ padding: '0.65rem 0.6rem', color: '#475569' }}>LKR {parseFloat(item.price).toFixed(2)}</td>
                                            <td style={{ padding: '0.65rem 0.6rem', color: '#1e293b', fontWeight: 600 }}>LKR {parseFloat(item.subtotal).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div style={{ padding: '1rem 1.5rem 1.5rem', borderTop: '2px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: '#64748b', fontSize: '0.9rem' }}>
                                <span>Subtotal</span><span>LKR {parseFloat(selectedOrder.subtotal).toFixed(2)}</span>
                            </div>
                            {parseFloat(selectedOrder.delivery_fee) > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: '#64748b', fontSize: '0.9rem' }}>
                                    <span>Delivery Fee</span><span>LKR {parseFloat(selectedOrder.delivery_fee).toFixed(2)}</span>
                                </div>
                            )}
                            {parseFloat(selectedOrder.discount || 0) > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                                    <span style={{ color: '#16a34a' }}>Discount{selectedOrder.discount_reason ? ` (${selectedOrder.discount_reason})` : ''}</span>
                                    <span style={{ color: '#16a34a' }}>- LKR {parseFloat(selectedOrder.discount).toFixed(2)}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: '1px solid #e2e8f0' }}>
                                <span>Total</span>
                                <span style={{ color: '#0284c7' }}>LKR {parseFloat(selectedOrder.total).toFixed(2)}</span>
                            </div>

                            {/* Download Receipt button — only for paid orders */}
                            {selectedOrder.payment_status === 'paid' && (
                                <button
                                    onClick={() => downloadReceipt(selectedOrder)}
                                    style={{ marginTop: '1rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.65rem 1rem', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    <Download size={16} />
                                    Download Receipt
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
