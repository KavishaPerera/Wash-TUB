import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit } from 'lucide-react';
import StaffSidebar from '../components/StaffSidebar';
import { useStaffOrders } from '../context/StaffOrdersContext';
import './StaffDashboard.css';

const StaffDashboard = () => {
    const navigate = useNavigate();
    const [staffName] = useState('Staff Member');
    const { orders } = useStaffOrders(); // ← shared state

    const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); sessionStorage.removeItem('token'); sessionStorage.removeItem('user'); navigate('/signin'); };

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <StaffSidebar activePage="overview" />

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Header */}
                <header className="dashboard-header">
                    <div className="header-content">
                        <div>
                            <h1>Welcome, {staffName}!</h1>
                            <p>Manage assigned orders and tasks</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => navigate('/staff/tasks')}>
                            View All Tasks
                        </button>
                    </div>
                </header>

                {/* Stats Cards */}
                <section className="stats-section">
                    <div className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Assigned Orders</p>
                            <h3 className="stat-value">12</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">In Progress</p>
                            <h3 className="stat-value">5</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Completed Today</p>
                            <h3 className="stat-value">7</h3>
                        </div>
                    </div>
                </section>

                {/* Recent Assigned Orders */}
                <section className="orders-section">
                    <div className="section-header">
                        <h2>Recent Assigned Orders</h2>
                    </div>
                    <div className="orders-table-container">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Service Type</th>
                                    <th>Status</th>
                                    <th>Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.slice(0, 5).map(order => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.customer}</td>
                                        <td>{order.service}</td>
                                        <td>
                                            <span className={`status-badge status-${order.status.toLowerCase().replace(' ', '-')}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-action"
                                                onClick={() => navigate('/staff/update-order', { state: { order } })}
                                                title="Update Order Status"
                                            >
                                                <Edit size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>





            </main>
        </div>
    );
};

export default StaffDashboard;
