import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StaffSidebar from '../components/StaffSidebar';
import './StaffDashboard.css';

const StaffDashboard = () => {
    const navigate = useNavigate();
    const [staffName] = useState('Staff Member');

    const handleLogout = () => {
        navigate('/signin');
    };

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



                {/* Quick Actions */}
                <section className="quick-actions-section">
                    <div className="section-header">
                        <h2>Quick Actions</h2>
                    </div>
                    <div className="quick-actions-grid">
                        <div className="action-card">
                            <h3>Update Order Status</h3>
                            <p>Mark orders as processed or ready</p>
                            <button className="btn btn-secondary btn-small">Update</button>
                        </div>
                        <div className="action-card">
                            <h3>View Schedule</h3>
                            <p>Check your work schedule</p>
                            <button className="btn btn-secondary btn-small">View</button>
                        </div>
                        <div className="action-card">
                            <h3>Report Issue</h3>
                            <p>Report any problems with orders</p>
                            <button className="btn btn-secondary btn-small">Report</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default StaffDashboard;
