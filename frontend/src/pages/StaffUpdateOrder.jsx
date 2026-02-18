import { useState, useMemo } from 'react';
import { Search, Package, Clock, Check, User, Calendar, DollarSign } from 'lucide-react';
import StaffSidebar from '../components/StaffSidebar';
import './StaffDashboard.css';
import './StaffUpdateOrder.css';

const StaffUpdateOrder = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    // Mock Data
    const mockOrders = [
        { id: 'ORD-001', customer: 'Nimal perera', service: 'Wash & Dry', status: 'Pending', items: 'Curtain', date: 'Jan 24, 2026', total: 'LKR 1,500' },
        { id: 'ORD-002', customer: 'Jane fernando', service: 'Dry Cleaning', status: 'In Progress', items: '2 Suits', date: 'Jan 25, 2026', total: 'LKR 1,200' },
        { id: 'ORD-003', customer: 'Mewan Gunathilaka', service: 'Ironing', status: 'Completed', items: '10 Shirts', date: 'Jan 23, 2026', total: 'LKR 2,800' },
        { id: 'ORD-005', customer: 'Mohommad Ismail', service: 'Pressing', status: 'Urgent', items: 'Silk Dress', date: 'Today', total: 'LKR 350' },
        { id: 'ORD-006', customer: 'Samantha Abeyrathna', service: 'Dry Cleaning', status: 'Pending', items: 'Living Room Set', date: 'Yesterday', total: 'LKR 500' },
    ];

    const [orders, setOrders] = useState(mockOrders);

    // Filter Logic
    const filteredOrders = useMemo(() => {
        return orders.filter(order =>
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [orders, searchTerm]);

    const selectedOrder = orders.find(o => o.id === selectedOrderId);
    const workflowSteps = ['Pending', 'In Progress', 'Ready', 'Completed'];

    const handleStatusUpdate = (newStatus) => {
        if (!selectedOrder) return;

        const updatedOrders = orders.map(o =>
            o.id === selectedOrderId ? { ...o, status: newStatus } : o
        );
        setOrders(updatedOrders);
        alert(`Order ${selectedOrderId} updated to ${newStatus}`);
    };

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

                                            // Handle special 'Urgent' case visually as 'Pending' or separate? 
                                            // For simplicity, we stick to the main workflow steps.

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
