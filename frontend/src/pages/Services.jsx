import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
        image: washAndDryImg,
        description: 'Complete washing and drying for everyday clothes'
    },
    {
        id: 2,
        title: 'Ironing',
        image: ironingImg,
        description: 'Professional ironing for crisp, wrinkle-free garments'
    },
    {
        id: 3,
        title: 'Dry Cleaning',
        image: dryCleaningImg,
        description: 'Expert care for delicate and special fabrics'
    },
    {
        id: 4,
        title: 'Pressing',
        image: pressingImg,
        description: 'Steam pressing for a polished, neat finish'
    },

];

const Services = () => {
    return (
        <div className="services-page">
            <Navbar />

            {/* Hero Section */}
            <section className="services-hero">
                <div className="services-hero-content">
                    <h1>Our <span className="gradient-text">Services</span></h1>
                    <p>Professional laundry solutions tailored to your needs, delivering freshness to your doorstep</p>
                </div>
            </section>



            {/* Services Grid Section */}
            <section className="services-section services-list-section">
                <div className="services-container">
                    <h2 className="section-heading">What We Offer</h2>
                    <div className="services-grid">
                        {services.map((service) => (
                            <div key={service.id} className="service-card">
                                <div className="service-image-wrapper">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="service-image"
                                    />
                                </div>
                                <div className="service-info">
                                    <h3>{service.title}</h3>
                                    <p>{service.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="services-cta">
                <div className="services-container">
                    <div className="cta-content">
                        <h2>Ready to Schedule a Service?</h2>
                        <p>Check our competitive pricing or start your order now</p>
                        <div className="cta-buttons">
                            <Link to="/pricing" className="btn btn-primary">Check Price List</Link>
                            <Link to="/signup" className="btn btn-secondary">Get Started</Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Services;
