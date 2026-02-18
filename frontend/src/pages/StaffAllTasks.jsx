import { useState } from 'react';
import StaffSidebar from '../components/StaffSidebar';
import { Calendar, Package, Clock, AlertCircle } from 'lucide-react';
import './StaffDashboard.css'; // Core layout
import './StaffAllTasks.css'; // Custom grid layout

const StaffAllTasks = () => {
    const [filter, setFilter] = useState('All');

    // Mock Tasks Data
    const tasks = [
        { id: 'ORD-001', service: 'Wash & Dry', details: '5kg Mixed Clothes', date: 'Today, 10:00 AM', status: 'Pending', priority: 'Medium' },
        { id: 'ORD-005', service: 'Pressing', details: 'Silk Saree & Blazer', date: 'Today, 2:00 PM', status: 'Urgent', priority: 'High' },
        { id: 'ORD-002', service: 'Dry Cleaning', details: '2 Mens Suits', date: 'Today, 11:30 AM', status: 'In Progress', priority: 'Medium' },
        { id: 'ORD-004', service: 'Ironing', details: '15 Shirts', date: 'Tomorrow', status: 'Pending', priority: 'Low' },
        { id: 'ORD-003', service: 'Wash & Dry', details: '3kg Bedding', date: 'Yesterday', status: 'Completed', priority: 'Low' },
        { id: 'ORD-006', service: 'Dry Cleaning', details: 'Living Room Set', date: 'Today, 4:00 PM', status: 'Pending', priority: 'Medium' },
    ];

    const filters = ['All', 'Pending', 'In Progress', 'Urgent', 'Completed'];

    const filteredTasks = filter === 'All'
        ? tasks
        : tasks.filter(t => t.status === filter);

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
                                <div className="task-header">
                                    <span className="task-id">{task.id}</span>
                                    <span className={`task-priority priority-${task.priority.toLowerCase()}`}>
                                        {task.priority} Priority
                                    </span>
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
                                    <button className="btn-view-task">View Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StaffAllTasks;
