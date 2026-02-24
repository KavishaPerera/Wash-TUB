import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Package, Clock, Check, User, Calendar, DollarSign, ArrowLeft } from 'lucide-react';
import StaffSidebar from '../components/StaffSidebar';
import { useStaffOrders } from '../context/StaffOrdersContext';
import './StaffDashboard.css';
import './StaffUpdateOrder.css';

const StaffUpdateOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // ── Shared context (single source of truth) ──────────────────────────
    const { orders, updateOrderStatus } = useStaffOrders();

    const [searchTerm, setSearchTerm] = useState('');

    // If navigated from the dashboard with a specific order, pre-select it
    const incomingOrder = location.state?.order;
    const [selectedOrderId, setSelectedOrderId] = useState(incomingOrder?.id || null);

    // Filter Logic (for split-panel view)
    const filteredOrders = useMemo(() => {
        return orders.filter(order =>
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [orders, searchTerm]);

    // Always derive selectedOrder from the shared context so it stays fresh
    const selectedOrder = orders.find(o => o.id === selectedOrderId);
    const workflowSteps = ['Pending', 'In Progress', 'Ready', 'Completed'];

    const handleStatusUpdate = (newStatus) => {
        if (!selectedOrderId) return;
        updateOrderStatus(selectedOrderId, newStatus); // ← writes to context
    };

    // ── DETAIL-ONLY VIEW (navigated from dashboard update button) ─────────
    if (incomingOrder && selectedOrder) {
        return (
            <div className="dashboard">
                <StaffSidebar activePage="overview" />

                <main className="dashboard-main">
                    <header className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
                        <div className="header-content">
                            <button
                                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: '#0284c7', fontWeight: 600, fontSize: '0.95rem', padding: 0 }}
                                onClick={() => navigate('/staff-dashboard')}
                            >
                                <ArrowLeft size={18} /> Back to Dashboard
                            </button>
                        </div>
                    </header>

                    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 1rem' }}>
                        {/* Order header card */}
                        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{selectedOrder.id}</h2>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem', color: '#64748b' }}>
                                        <User size={15} />
                                        <span>{selectedOrder.customer}</span>
                                    </div>
                                </div>
                                <span className={`large-status-badge status-${selectedOrder.status.toLowerCase().replace(' ', '-')}`}>
                                    {selectedOrder.status}
                                </span>
                            </div>
                        </div>

                        {/* Info grid card */}
                        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.25rem', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.82rem' }}>
                                    <Package size={14} /> Service Type
                                </div>
                                <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>{selectedOrder.service}</p>
                            </div>
                            <div>
                                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.82rem' }}>
                                    <Clock size={14} /> Items
                                </div>
                                <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>{selectedOrder.items}</p>
                            </div>
                            <div>
                                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.82rem' }}>
                                    <Calendar size={14} /> Date Received
                                </div>
                                <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>{selectedOrder.date}</p>
                            </div>
                            <div>
                                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.82rem' }}>
                                    <DollarSign size={14} /> Total Amount
                                </div>
                                <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>{selectedOrder.total}</p>
                            </div>
                        </div>

                        {/* Update Progress card */}
                        <div className="status-update-section" style={{ background: '#fff', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ margin: '0 0 1.75rem', fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>Update Progress</h3>
                            <div className="status-workflow">
                                {workflowSteps.map((step, index) => {
                                    const currentIndex = workflowSteps.indexOf(selectedOrder.status);
                                    const isCompleted = currentIndex >= index;
                                    const isActive = selectedOrder.status === step;
                                    return (
                                        <div
                                            key={step}
                                            className={`status-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                                            onClick={() => handleStatusUpdate(step)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className="step-circle">
                                                {isCompleted ? <Check size={16} /> : <span>{index + 1}</span>}
                                            </div>
                                            <span className="step-label">{step}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // ── SPLIT-PANEL VIEW (accessed directly via sidebar) ──────────────────
    return (
        <div className="dashboard">
            <StaffSidebar activePage="overview" />

            <main className="dashboard-main" style={{ height: '100vh', overflow: 'hidden' }}>
                <header className="dashboard-header" style={{ marginBottom: '1rem' }}>
                    <div className="header-content">
                        <div>
                            <h1>Start Processing</h1>
                            <p>Select an order to update its status</p>
                        </div>
                    </div>
                </header>

                <div className="update-order-container">
                    {/* LEFT PANEL: LIST */}
                    <div className="orders-list-panel">
                        <div className="orders-list-header">
                            <div className="search-wrapper">
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search by ID or Customer..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="orders-list">
                            {filteredOrders.map(order => (
                                <div
                                    key={order.id}
                                    className={`order-list-item ${selectedOrderId === order.id ? 'active' : ''}`}
                                    onClick={() => setSelectedOrderId(order.id)}
                                >
                                    <div className="list-item-header">
                                        <span className="list-item-id">{order.id}</span>
                                        <span className="list-item-time">{order.date}</span>
                                    </div>
                                    <div className="list-item-customer">{order.customer}</div>
                                    <span className={`mini-status-badge status-${order.status.toLowerCase().replace(' ', '-')}`}>
                                        {order.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT PANEL: DETAILS */}
                    <div className="order-detail-panel">
                        {selectedOrder ? (
                            <>
                                <div className="detail-header">
                                    <div className="detail-title">
                                        <h2>{selectedOrder.id}</h2>
                                        <div className="customer-info">
                                            <User size={18} />
                                            <span>{selectedOrder.customer}</span>
                                        </div>
                                    </div>
                                    <span className={`large-status-badge status-${selectedOrder.status.toLowerCase().replace(' ', '-')}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>

                                <div className="info-grid">
                                    <div className="info-item">
                                        <div className="label-with-icon" style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.5rem', color: '#64748b' }}>
                                            <Package size={16} /> <span>Service Type</span>
                                        </div>
                                        <p>{selectedOrder.service}</p>
                                    </div>
                                    <div className="info-item">
                                        <div className="label-with-icon" style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.5rem', color: '#64748b' }}>
                                            <Clock size={16} /> <span>Items</span>
                                        </div>
                                        <p>{selectedOrder.items}</p>
                                    </div>
                                    <div className="info-item">
                                        <div className="label-with-icon" style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.5rem', color: '#64748b' }}>
                                            <Calendar size={16} /> <span>Date Received</span>
                                        </div>
                                        <p>{selectedOrder.date}</p>
                                    </div>
                                    <div className="info-item">
                                        <div className="label-with-icon" style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.5rem', color: '#64748b' }}>
                                            <DollarSign size={16} /> <span>Total Amount</span>
                                        </div>
                                        <p>{selectedOrder.total}</p>
                                    </div>
                                </div>

                                <div className="status-update-section">
                                    <h3>Update Progress</h3>
                                    <div className="status-workflow">
                                        {workflowSteps.map((step, index) => {
                                            const isCompleted = workflowSteps.indexOf(selectedOrder.status) >= index;
                                            const isActive = selectedOrder.status === step;
                                            return (
                                                <div
                                                    key={step}
                                                    className={`status-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                                                    onClick={() => handleStatusUpdate(step)}
                                                >
                                                    <div className="step-circle">
                                                        {isCompleted ? <Check size={16} /> : <span>{index + 1}</span>}
                                                    </div>
                                                    <span className="step-label">{step}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="empty-state">
                                <Package size={64} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                                <h3>Select an Order</h3>
                                <p>Choose an order from the list to view details and update status.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StaffUpdateOrder;
