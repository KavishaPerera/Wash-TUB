import { Link } from 'react-router-dom';
import './Services.css';

const services = [
    {
        id: 1,
        title: 'Wash & Dry',
        icon: '🧺',
        color: '#e3f2fd'
    },
    {
        id: 2,
        title: 'Ironing',
        icon: '👔',
        color: '#f3e5f5'
    },
    {
        id: 3,
        title: 'Dry Cleaning',
        icon: '✨',
        color: '#e8f5e9'
    },
    {
        id: 4,
        title: 'Pressing',
        icon: '🔥',
        color: '#fff3e0'
    },
    {
        id: 5,
        title: 'One Day Service',
        icon: '⏰',
        color: '#e1f5fe'
    },
    {
        id: 6,
        title: 'Pickup & Delivery',
        icon: '🚚',
        color: '#fce4ec'
    }
];

const Services = () => {
    return (
        <div className="services-page">
            <div className="services-container">
                <Link to="/" className="back-home-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Home
                </Link>

                <div className="services-header">
                    <h1>Our Services</h1>
                    <p>Professional laundry solutions tailored to your needs</p>
                </div>

                <div className="services-grid">
                    {services.map((service) => (
                        <div key={service.id} className="service-card">
                            <div
                                className="service-image-placeholder"
                                style={{ backgroundColor: service.color }}
                            >
                                <span className="service-icon">{service.icon}</span>
                            </div>
                            <div className="service-title">{service.title}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;
