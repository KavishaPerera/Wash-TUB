import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeliverySidebar from '../components/DeliverySidebar';
import { Truck, MapPin, Package, Clock, DollarSign, Navigation } from 'lucide-react';
import './DeliveryDashboard.css';

const DeliveryDashboard = () => {
    const navigate = useNavigate();
    const [driverName] = useState('Driver');

    // Mock Data for "Card" view
    const deliveries = [
        { id: 'ORD-1240', name: 'Supun Pinto', address: '123 Main St, Apt 4', type: 'Pickup', status: 'Pending', time: '10:00 AM' },
        { id: 'ORD-1239', name: 'Thilak Jayawardene', address: '456 Oak Ave', type: 'Delivery', status: 'Transit', time: '11:30 AM' },
        { id: 'ORD-1238', name: 'Bandu Perera', address: '789 Temple Ln', type: 'Pickup', status: 'Completed', time: '09:15 AM' },
        { id: 'ORD-1235', name: 'Nilantha Pieris', address: '321 Galle Road', type: 'Delivery', status: 'Completed', time: 'Yesterday' },
        { id: 'ORD-1244', name: 'Kamal Hassan', address: '55 Lotus Grove', type: 'Delivery', status: 'Pending', time: '02:00 PM' },
    ];

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <DeliverySidebar activePage="overview" />

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Header */}
                <header className="dashboard-header">
                    <div className="header-content">
                        <h1>Welcome, {driverName}!</h1>
                        <p>You have 3 active tasks today</p>
                    </div>
                    <button className="btn-primary">
                        Go Online
                    </button>
                </header>

                {/* Stats Cards */}
                <section className="stats-section">
                    <div className="stat-card">
                        <div>
                            <p className="stat-label">Deliveries Today</p>
                            <h3 className="stat-value">8</h3>
                        </div>
                        <Truck size={32} color="#0ea5e9" style={{ opacity: 0.8 }} />
                    </div>

                    <div className="stat-card">
                        <div>
                            <p className="stat-label">Pending</p>
                            <h3 className="stat-value">3</h3>
                        </div>
                        <Package size={32} color="#f59e0b" style={{ opacity: 0.8 }} />
                    </div>

                    <div className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Total Earnings</p>
                            <h3 className="stat-value">Rs. 1,200</h3>
                        </div>
                        <DollarSign size={32} color="#10b981" style={{ opacity: 0.8 }} />
                    </div>
                </section>

                {/* Current Deliveries / Tasks - GRID VIEW */}
                <section className="orders-section">
                    <div className="section-header">
                        <h2>Active Tasks</h2>
                        <a href="#all-deliveries" className="view-all">View All →</a>
                    </div>

                    <div className="delivery-grid">
                        {deliveries.map((item) => (
                            <div key={item.id} className="delivery-card">
                                <div className="delivery-header">
                                    <span className="delivery-id">{item.id}</span>
                                    <span className={`delivery-status status-${item.status.toLowerCase()}`}>{item.status}</span>
                                </div>
                                <div className="customer-details">
                                    <h3>{item.name}</h3>
                                    <p><MapPin size={14} /> {item.address}</p>
                                    <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                        <Clock size={14} /> Expected: {item.time}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                    <span className={`delivery-type type-${item.type.toLowerCase()}`}>{item.type}</span>
                                </div>
                                <div className="card-actions">
                                    <button className="btn-card-action">Map</button>
                                    <button className="btn-card-action btn-card-primary">
                                        {item.type === 'Pickup' ? 'Start Pickup' : 'Start Delivery'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="quick-actions-section">
                    <div className="section-header">
                        <h2>Quick Actions</h2>
                    </div>
                    <div className="quick-actions-grid">
                        <div className="action-card">
                            <Navigation size={24} style={{ marginBottom: '0.5rem', color: '#0ea5e9' }} />
                            <h3>Route Optimizer</h3>
                            <button className="btn-small">Launch</button>
                        </div>
                        <div className="action-card">
                            <Truck size={24} style={{ marginBottom: '0.5rem', color: '#0ea5e9' }} />
                            <h3>Vehicle Check</h3>
                            <button className="btn-small">Start Check</button>
                        </div>
                        <div className="action-card">
                            <Package size={24} style={{ marginBottom: '0.5rem', color: '#0ea5e9' }} />
                            <h3>Scan Package</h3>
                            <button className="btn-small">Scan QR</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DeliveryDashboard;
