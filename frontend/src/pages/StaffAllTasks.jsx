import { useState } from 'react';
import StaffSidebar from '../components/StaffSidebar';
import { Calendar, Package, X, User, DollarSign, Clock, Phone, MapPin, RefreshCw, Inbox, CreditCard, ChevronRight } from 'lucide-react';
import { useStaffOrders } from '../context/StaffOrdersContext';
import { useNavigate } from 'react-router-dom';
import './StaffDashboard.css';
import './StaffAllTasks.css';

// ── Status helpers ──────────────────────────────────────────────────────────
// Map the normalised status label → CSS class suffix used in StaffAllTasks.css
const statusClass = (status) => {
    const map = {
        'Pending': 'pending',
        'Confirmed': 'confirmed',
        'Pickup Scheduled': 'pickup-scheduled',
        'Picked Up': 'picked-up',
        'In Progress': 'in-progress',
        'Processing': 'in-progress',
        'Ready': 'ready',
        'Out For Delivery': 'out-for-delivery',
        'Delivered': 'completed',
        'Completed': 'completed',
        'Cancelled': 'cancelled',
    };
    return map[status] ?? 'pending';
};

// Filters shown in the filter bar — "All" + key statuses
const FILTERS = ['All', 'Pending', 'Confirmed', 'In Progress', 'Ready', 'Delivered', 'Cancelled'];

const StaffAllTasks = () => {
    const navigate = useNavigate();
    const { orders, loading, error, lastUpdated, fetchOrders } = useStaffOrders();

    const [filter, setFilter] = useState('All');
    const [selectedTask, setSelectedTask] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // ── Filter orders by status ────────────────────────────────────────────
    const filteredTasks = filter === 'All'
        ? orders
        : orders.filter(o => {
            const s = o.status.toLowerCase();
            const f = filter.toLowerCase();
            return s === f || s.includes(f);
        });

    // ── Manual refresh ─────────────────────────────────────────────────────
    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchOrders();
        setRefreshing(false);
    };

    // ── Compute grand total from itemsDetail ───────────────────────────────
    const computeGrandTotal = (task) => {
        if (!task.itemsDetail?.length) {
            // Fallback: strip "LKR" from total string
            const num = parseFloat((task.total || '').replace(/[^0-9.]/g, ''));
            return isNaN(num) ? 0 : num;
        }
        return task.itemsDetail.reduce((sum, i) => sum + parseFloat(i.subtotal || i.price * i.quantity || 0), 0);
    };

    return (
        <div className="dashboard">
            <StaffSidebar activePage="tasks" />

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <div>
                            <h1>All Tasks</h1>
                            <p>
                                {lastUpdated
                                    ? `Last updated: ${lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                                    : 'Manage and track all laundry service requests'}
                            </p>
                        </div>
                        <button
                            className={`btn btn-primary refresh-btn ${refreshing ? 'refreshing' : ''}`}
                            onClick={handleRefresh}
                            disabled={refreshing || loading}
                            title="Refresh orders"
                        >
                            <RefreshCw size={16} className={refreshing ? 'spin-icon' : ''} />
                            {refreshing ? 'Refreshing…' : 'Refresh'}
                        </button>
                    </div>
                </header>

                <div className="tasks-grid-container">
                    {/* ── Filter Bar ─────────────────────────────────────── */}
                    <div className="tasks-filter-bar">
                        {FILTERS.map(f => (
                            <button
                                key={f}
                                className={`filter-btn ${filter === f ? 'active' : ''}`}
                                onClick={() => setFilter(f)}
                            >
                                {f}
                                {/* badge count */}
                                <span className="filter-count">
                                    {f === 'All'
                                        ? orders.length
                                        : orders.filter(o => o.status.toLowerCase().includes(f.toLowerCase())).length}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* ── Loading State ──────────────────────────────────── */}
                    {loading && (
                        <div className="tasks-loading">
                            <div className="loading-spinner" />
                            <p>Loading orders…</p>
                        </div>
                    )}

                    {/* ── Error State ────────────────────────────────────── */}
                    {!loading && error && (
                        <div className="tasks-empty">
                            <Inbox size={52} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <h3>Could not load orders</h3>
                            <p>{error}</p>
                            <button className="btn btn-primary" onClick={handleRefresh}>Try Again</button>
                        </div>
                    )}

                    {/* ── Empty State ────────────────────────────────────── */}
                    {!loading && !error && filteredTasks.length === 0 && (
                        <div className="tasks-empty">
                            <Inbox size={52} style={{ opacity: 0.15, marginBottom: '1rem' }} />
                            <h3>No {filter !== 'All' ? filter : ''} orders yet</h3>
                            <p>When customers place orders, they will appear here automatically.</p>
                        </div>
                    )}

                    {/* ── Tasks Grid ─────────────────────────────────────── */}
                    {!loading && !error && filteredTasks.length > 0 && (
                        <div className="tasks-cards-grid">
                            {filteredTasks.map((task) => (
                                <div className="task-card" key={task.id}>
                                    {/* Header — order ID + status */}
                                    <div className="task-header">
                                        <span className="task-id">{task.id}</span>
                                        <span className={`task-status-pill status-${statusClass(task.status)}`}>
                                            {task.status}
                                        </span>
                                    </div>

                                    <div className="task-body">
                                        {/* Customer name as title */}
                                        <h3 className="task-service">{task.customer}</h3>

                                        <div className="task-detail-row">
                                            <Package size={15} />
                                            <span>{task.service}</span>
                                        </div>
                                        <div className="task-detail-row">
                                            <Calendar size={15} />
                                            <span>{task.date}</span>
                                        </div>
                                        <div className="task-detail-row">
                                            <DollarSign size={15} />
                                            <span>{task.total}</span>
                                        </div>
                                    </div>

                                    <div className="task-footer">
                                        <button
                                            className="btn-update-task"
                                            onClick={() => navigate('/staff/update-order', { state: { order: task } })}
                                        >
                                            Update Status
                                        </button>
                                        <button
                                            className="btn-view-task"
                                            onClick={() => setSelectedTask(task)}
                                        >
                                            View Details <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* ── Order Details Modal ─────────────────────────────────────────── */}
            {selectedTask && (
                <div className="task-modal-overlay" onClick={() => setSelectedTask(null)}>
                    <div className="task-modal" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="task-modal-header">
                            <div>
                                <h2 className="task-modal-title">{selectedTask.id}</h2>
                                <span className={`task-status-pill status-${statusClass(selectedTask.status)}`}>
                                    {selectedTask.status}
                                </span>
                            </div>
                            <button className="task-modal-close" onClick={() => setSelectedTask(null)}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Order Meta */}
                        <div className="task-modal-meta">
                            <div className="task-modal-meta-item">
                                <User size={15} />
                                <span><strong>{selectedTask.customer}</strong></span>
                            </div>
                            <div className="task-modal-meta-item">
                                <Phone size={15} />
                                <span>{selectedTask.phone}</span>
                            </div>
                            {selectedTask.deliveryOption === 'delivery' && (
                                <div className="task-modal-meta-item">
                                    <MapPin size={15} />
                                    <span>{selectedTask.address}, {selectedTask.city} {selectedTask.postalCode}</span>
                                </div>
                            )}
                            <div className="task-modal-meta-item">
                                <Clock size={15} />
                                <span>Pickup: {selectedTask.pickupDate} · {selectedTask.pickupTime}</span>
                            </div>
                            <div className="task-modal-meta-item">
                                <CreditCard size={15} />
                                <span style={{ textTransform: 'capitalize' }}>{selectedTask.paymentMethod}</span>
                            </div>
                        </div>

                        {/* Special Instructions */}
                        {selectedTask.specialInstructions && (
                            <div style={{ padding: '0.75rem 1.5rem', background: '#fffbeb', borderBottom: '1px solid #fef3c7', fontSize: '0.875rem', color: '#92400e' }}>
                                <strong>Note:</strong> {selectedTask.specialInstructions}
                            </div>
                        )}

                        {/* Items Table */}
                        <div className="task-modal-items">
                            <h3 className="task-modal-section-title">Items &amp; Pricing</h3>
                            {selectedTask.itemsDetail?.length > 0 ? (
                                <table className="task-items-table">
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Method</th>
                                            <th>Qty</th>
                                            <th>Unit Price</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedTask.itemsDetail.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>{item.item_name || item.name}</td>
                                                <td>{item.method || '—'}</td>
                                                <td>{item.quantity}</td>
                                                <td>LKR {parseFloat(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                                <td>LKR {parseFloat(item.subtotal || item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{selectedTask.service}</p>
                            )}
                        </div>

                        {/* Grand Total */}
                        <div className="task-modal-total">
                            <div className="task-modal-total-row">
                                <span>Grand Total</span>
                                <span className="task-modal-total-amount">
                                    LKR {computeGrandTotal(selectedTask).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}
                                onClick={() => {
                                    setSelectedTask(null);
                                    navigate('/staff/update-order', { state: { order: selectedTask } });
                                }}
                            >
                                Update Order Status
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffAllTasks;
