import { Link } from 'react-router-dom';
import './Services.css';

// Import images from the images folder
import washAndDryImg from '../../images/wash and dry.jpg';
import ironingImg from '../../images/ironing.jpg';
import dryCleaningImg from '../../images/Dry Cleaning_.jpg';
import pressingImg from '../../images/pressing.jpg';
import oneDayImg from '../../images/one day.jpg';
import pickupDeliveryImg from '../../images/Pickup and delivery.jpg';

const services = [
    {
        id: 1,
        title: 'Wash & Dry',
        image: washAndDryImg
    },
    {
        id: 2,
        title: 'Ironing',
        image: ironingImg
    },
    {
        id: 3,
        title: 'Dry Cleaning',
        image: dryCleaningImg
    },
    {
        id: 4,
        title: 'Pressing',
        image: pressingImg
    },
    {
        id: 5,
        title: 'One Day Service',
        image: oneDayImg
    },
    {
        id: 6,
        title: 'Pickup & Delivery',
        image: pickupDeliveryImg
    }
];

const Services = () => {
    return (
        <div className="services-page">
            <div className="services-container">
                <div className="services-top-nav">
                    <Link to="/" className="back-home-link">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </Link>
                    <button className="btn-price-list">
                        Check Price List
                    </button>
                </div>

                <div className="services-header">
                    <h1>Our Services</h1>
                    <p>Professional laundry solutions tailored to your needs</p>
                </div>

                <div className="services-grid">
                    {services.map((service) => (
                        <div key={service.id} className="service-card">
                            <img
                                src={service.image}
                                alt={service.title}
                                className="service-image"
                            />
                            <div className="service-title">{service.title}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;

