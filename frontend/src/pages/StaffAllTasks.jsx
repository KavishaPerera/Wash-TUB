import { useState } from 'react';
import StaffSidebar from '../components/StaffSidebar';
import { Calendar, Package, X, User, DollarSign, Clock } from 'lucide-react';
import './StaffDashboard.css';
import './StaffAllTasks.css';

const StaffAllTasks = () => {
    const [filter, setFilter] = useState('All');
    const [selectedTask, setSelectedTask] = useState(null);

    // Mock Tasks Data — each with item breakdown & prices
    const tasks = [
        {
            id: 'ORD-001', service: 'Wash & Dry', details: '5kg Mixed Clothes', date: 'Today, 10:00 AM', status: 'Pending', customer: 'Nimal Perera',
            items: [
                { name: 'T-Shirts', qty: 5, unitPrice: 150, total: 750 },
                { name: 'Trousers', qty: 3, unitPrice: 200, total: 600 },
                { name: 'Bed Sheet', qty: 1, unitPrice: 350, total: 350 },
            ],
        },
        {
            id: 'ORD-005', service: 'Pressing', details: 'Silk Saree & Blazer', date: 'Today, 2:00 PM', status: 'Urgent', customer: 'Mohommad Ismail',
            items: [
                { name: 'Silk Saree', qty: 1, unitPrice: 500, total: 500 },
                { name: 'Blazer', qty: 1, unitPrice: 350, total: 350 },
            ],
        },
        {
            id: 'ORD-002', service: 'Dry Cleaning', details: '2 Mens Suits', date: 'Today, 11:30 AM', status: 'In Progress', customer: 'Jane Fernando',
            items: [
                { name: 'Business Suit', qty: 2, unitPrice: 1200, total: 2400 },
            ],
        },
        {
            id: 'ORD-004', service: 'Ironing', details: '15 Shirts', date: 'Tomorrow', status: 'Pending', customer: 'Mohommad Ismail',
            items: [
                { name: 'Shirt', qty: 15, unitPrice: 80, total: 1200 },
            ],
        },
        {
            id: 'ORD-003', service: 'Wash & Dry', details: '3kg Bedding', date: 'Yesterday', status: 'Completed', customer: 'Mewan Gunathilaka',
            items: [
                { name: 'Duvet', qty: 1, unitPrice: 800, total: 800 },
                { name: 'Pillow Covers', qty: 4, unitPrice: 120, total: 480 },
            ],
        },
        {
            id: 'ORD-006', service: 'Dry Cleaning', details: 'Living Room Set', date: 'Today, 4:00 PM', status: 'Pending', customer: 'Samantha Abeyrathna',
            items: [
                { name: 'Sofa Cover', qty: 1, unitPrice: 1500, total: 1500 },
                { name: 'Curtains', qty: 2, unitPrice: 600, total: 1200 },
            ],
        },
    ];

    const filters = ['All', 'Pending', 'In Progress', 'Urgent', 'Completed'];

    const filteredTasks = filter === 'All'
        ? tasks
        : tasks.filter(t => t.status === filter);

    const grandTotal = (task) =>
        task.items.reduce((sum, i) => sum + i.total, 0);

    return (
        <div className="dashboard">
            <StaffSidebar activePage="tasks" />

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <div>
                            <h1>All Tasks</h1>
                            <p>Manage and track all laundry service requests</p>
                        </div>
                    </div>
                </header>

                <div className="tasks-grid-container">
                    {/* Filter Bar */}
                    <div className="tasks-filter-bar">
                        {filters.map(f => (
                            <button
                                key={f}
                                className={`filter-btn ${filter === f ? 'active' : ''}`}
                                onClick={() => setFilter(f)}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Tasks Grid */}
                    <div className="tasks-cards-grid">
                        {filteredTasks.map((task) => (
                            <div className="task-card" key={task.id}>
                                {/* Header — only order ID, no priority */}
                                <div className="task-header">
                                    <span className="task-id">{task.id}</span>
                                </div>

                                <div className="task-body">
                                    <h3 className="task-service">{task.service}</h3>

                                    <div className="task-detail-row">
                                        <Package size={16} />
                                        <span>{task.details}</span>
                                    </div>
                                    <div className="task-detail-row">
                                        <Calendar size={16} />
                                        <span>{task.date}</span>
                                    </div>
                                </div>

                                <div className="task-footer">
                                    <span className={`task-status-pill status-${task.status.toLowerCase().replace(' ', '-')}`}>
                                        {task.status}
                                    </span>
                                    <button
                                        className="btn-view-task"
                                        onClick={() => setSelectedTask(task)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* ── Order Details Modal ───────────────────────────────────────── */}
            {selectedTask && (
                <div className="task-modal-overlay" onClick={() => setSelectedTask(null)}>
                    <div className="task-modal" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="task-modal-header">
                            <div>
                                <h2 className="task-modal-title">{selectedTask.id}</h2>
                                <span className={`task-status-pill status-${selectedTask.status.toLowerCase().replace(' ', '-')}`}>
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
                                <span>{selectedTask.customer}</span>
                            </div>
                            <div className="task-modal-meta-item">
                                <Package size={15} />
                                <span>{selectedTask.service}</span>
                            </div>
                            <div className="task-modal-meta-item">
                                <Clock size={15} />
                                <span>{selectedTask.date}</span>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="task-modal-items">
                            <h3 className="task-modal-section-title">Items & Pricing</h3>
                            <table className="task-items-table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Qty</th>
                                        <th>Unit Price</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedTask.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{item.name}</td>
                                            <td>{item.qty}</td>
                                            <td>LKR {item.unitPrice.toLocaleString()}</td>
                                            <td>LKR {item.total.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Grand Total */}
                        <div className="task-modal-total">
                            <div className="task-modal-total-row">
                                <span>Grand Total</span>
                                <span className="task-modal-total-amount">
                                    LKR {grandTotal(selectedTask).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffAllTasks;
