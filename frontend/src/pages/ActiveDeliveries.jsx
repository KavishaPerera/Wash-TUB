import { useState } from 'react';
import DeliverySidebar from '../components/DeliverySidebar';
import { MapPin, Clock, Package, Navigation, Phone } from 'lucide-react';
import './DeliveryDashboard.css'; // Reusing the dashboard styles

const ActiveDeliveries = () => {
    // Mock Data for active deliveries
    const [activeDeliveries] = useState([
        { id: 'ORD-1240', name: 'Supun Pinto', address: '123 Main St, Apt 4', phone: '077-1234567', type: 'Pickup', status: 'Pending', time: '10:00 AM', items: 3 },
        { id: 'ORD-1239', name: 'Thilak Jayawardene', address: '456 Oak Ave', phone: '071-9876543', type: 'Delivery', status: 'Transit', time: '11:30 AM', items: 5 },
        { id: 'ORD-1244', name: 'Kamal Hassan', address: '55 Lotus Grove', phone: '075-5555555', type: 'Delivery', status: 'Pending', time: '02:00 PM', items: 2 },
    ]);

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <DeliverySidebar activePage="active" />

            {/* Main Content */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <h1>Active Deliveries</h1>
                        <p>Manage your current pickups and deliveries</p>
                    </div>
                </header>

                <section className="orders-section" style={{ marginTop: '2rem' }}>
                    <div className="delivery-grid">
                        {activeDeliveries.map((item) => (
                            <div key={item.id} className="delivery-card">
                                <div className="delivery-header">
                                    <span className="delivery-id">{item.id}</span>
                                    <span className={`delivery-status status-${item.status.toLowerCase()}`}>{item.status}</span>
                                </div>
                                <div className="customer-details">
                                    <h3>{item.name}</h3>
                                    <p><MapPin size={14} /> {item.address}</p>
                                    <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                        <Phone size={14} /> {item.phone}
                                    </p>
                                    <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                        <Clock size={14} /> Expected: {item.time}
                                    </p>
                                    <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                        <Package size={14} /> Items: {item.items}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                    <span className={`delivery-type type-${item.type.toLowerCase()}`}>{item.type}</span>
                                </div>
                                <div className="card-actions">
                                    <button className="btn-card-action"><Navigation size={16} style={{ marginRight: '0.25rem' }}/> Map</button>
                                    <button className="btn-card-action btn-card-primary">
                                        {item.status === 'Pending' ? 'Start Route' : 'Mark Completed'}
                                    </button>
                                </div>
                            </div>
                        ))}
                        {activeDeliveries.length === 0 && (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px' }}>
                                <Package size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                                <h3>No Active Deliveries</h3>
                                <p style={{ color: '#64748b' }}>You have completed all your tasks for now.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ActiveDeliveries;
