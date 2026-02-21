import { useState } from 'react';
import DeliverySidebar from '../components/DeliverySidebar';
import { MapPin, Clock, CheckCircle, Calendar } from 'lucide-react';
import './DeliveryDashboard.css'; // Reusing the dashboard styles

const DeliveryHistory = () => {
    // Mock Data for completed deliveries
    const [history] = useState([
        { id: 'ORD-1238', name: 'Bandu Perera', address: '789 Temple Ln', type: 'Pickup', status: 'Completed', date: 'Oct 24, 2023', time: '09:15 AM', earnings: 'Rs. 150' },
        { id: 'ORD-1235', name: 'Nilantha Pieris', address: '321 Galle Road', type: 'Delivery', status: 'Completed', date: 'Oct 23, 2023', time: '04:30 PM', earnings: 'Rs. 200' },
        { id: 'ORD-1230', name: 'Saman Kumara', address: '12 Kandy Road', type: 'Pickup', status: 'Completed', date: 'Oct 22, 2023', time: '11:00 AM', earnings: 'Rs. 150' },
        { id: 'ORD-1225', name: 'Nimali Silva', address: '45 Beach Road', type: 'Delivery', status: 'Completed', date: 'Oct 21, 2023', time: '02:15 PM', earnings: 'Rs. 250' },
    ]);

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <DeliverySidebar activePage="history" />

            {/* Main Content */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div className="header-content">
                        <h1>Delivery History</h1>
                        <p>View your past completed tasks and earnings</p>
                    </div>
                </header>

                <section className="orders-section" style={{ marginTop: '2rem' }}>
                    <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                        {/* Table Header */}
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1.2fr 100px 110px 90px', gap: '1rem', padding: '0.75rem 1.25rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <span>Order ID</span>
                            <span>Customer</span>
                            <span>Address</span>
                            <span>Type</span>
                            <span>Date &amp; Time</span>
                            <span style={{ textAlign: 'right' }}>Earnings</span>
                        </div>

                        {/* Rows */}
                        {history.map((item, index) => (
                            <div
                                key={item.id}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '120px 1fr 1.2fr 100px 110px 90px',
                                    gap: '1rem',
                                    padding: '0.85rem 1.25rem',
                                    alignItems: 'center',
                                    borderBottom: index < history.length - 1 ? '1px solid #f1f5f9' : 'none',
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                onMouseLeave={e => e.currentTarget.style.background = 'white'}
                            >
                                {/* Order ID */}
                                <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '0.88rem' }}>{item.id}</span>

                                {/* Customer */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CheckCircle size={14} color="#10b981" />
                                    <span style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '500' }}>{item.name}</span>
                                </div>

                                {/* Address */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.85rem' }}>
                                    <MapPin size={13} />
                                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.address}</span>
                                </div>

                                {/* Type Badge */}
                                <span className={`delivery-type type-${item.type.toLowerCase()}`} style={{ fontSize: '0.78rem' }}>{item.type}</span>

                                {/* Date & Time */}
                                <div style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.4' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <Calendar size={12} /> {item.date}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px' }}>
                                        <Clock size={12} /> {item.time}
                                    </div>
                                </div>

                                {/* Earnings */}
                                <span style={{ textAlign: 'right', fontWeight: '700', color: '#10b981', fontSize: '0.9rem' }}>{item.earnings}</span>
                            </div>
                        ))}

                        {history.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                <CheckCircle size={40} color="#cbd5e1" style={{ marginBottom: '0.75rem' }} />
                                <p>No delivery history found.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DeliveryHistory;
