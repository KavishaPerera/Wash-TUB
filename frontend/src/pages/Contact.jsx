import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, MessageSquare, Clock } from 'lucide-react';
import './Contact.css';

const getFaqs = () => {
    const defaults = [
        { id: 1, question: 'How do I schedule a pickup?', answer: 'Simply log in to your account, select "New Order", choose your preferred time slot, and we\'ll handle the rest.' },
        { id: 2, question: 'What is the turnaround time?', answer: 'Our standard turnaround time is 24-48 hours. Express same-day service is available for selected areas.' },
        { id: 3, question: 'Do you offer delivery?', answer: 'Yes, we offer free pickup and delivery for orders above LKR 2000 within our service areas.' },
    ];
    try {
        const saved = localStorage.getItem('washtub_faqs');
        const parsed = saved ? JSON.parse(saved) : null;
        return parsed && parsed.length > 0 ? parsed : defaults;
    } catch { return defaults; }
};

const getBusinessInfo = () => {
    const defaults = {
        phone1: '+94 11 452 8476',
        phone2: '+94 77 643 9276',
        supportEmail: 'support@washtub.lk',
        infoEmail: 'info@washtub.lk',
        address: '478/A, Pannipitiya Rd, Pelawatta, Sri Lanka',
        businessHours: 'Mon - Sun: 7:00 AM - 9:00 PM',
    };
    try {
        const saved = localStorage.getItem('washtub_business_info');
        return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch { return defaults; }
};

const Contact = () => {
    const info = getBusinessInfo();
    const faqs = getFaqs();
    return (
        <div className="contact-page">
            <Navbar />

            {/* Hero Section */}
            <section className="contact-hero">
                <div className="contact-hero-content">
                    <h1>Get in <span className="gradient-text">Touch</span></h1>
                    <p>We're here to help with all your laundry needs</p>
                </div>
            </section>

            {/* Contact Info Section */}
            <section className="contact-section">
                <div className="contact-container">
                    <div className="contact-info">
                        <h2 className="section-heading-left">Contact Information</h2>
                        <p className="info-description">
                            Have questions about our services or pricing? Reach out to us through any of the following channels.
                        </p>

                        <div className="info-cards">
                            <div className="info-card">
                                <div className="info-icon">
                                    <Phone size={18} />
                                </div>
                                <div className="info-details">
                                    <h3>Phone</h3>
                                    <p>{info.phone1}</p>
                                    <p>{info.phone2}</p>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">
                                    <Mail size={18} />
                                </div>
                                <div className="info-details">
                                    <h3>Email</h3>
                                    <p>{info.supportEmail}</p>
                                    <p>{info.infoEmail}</p>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">
                                    <MapPin size={18} />
                                </div>
                                <div className="info-details">
                                    <h3>Main Office</h3>
                                    <p>{info.address}</p>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="info-icon">
                                    <Clock size={18} />
                                </div>
                                <div className="info-details">
                                    <h3>Business Hours</h3>
                                    <p>{info.businessHours}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="contact-container">
                    <h2 className="section-heading">Frequently Asked Questions</h2>
                    <div className="faq-grid">
                        {faqs.map(faq => (
                            <div key={faq.id} className="faq-item">
                                <div className="faq-icon"><MessageSquare size={18} /></div>
                                <h3>{faq.question}</h3>
                                <p>{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
