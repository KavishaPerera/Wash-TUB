import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';
import './Contact.css';

const Contact = () => {
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

            {/* Contact Info & Form Section */}
            <section className="contact-section">
                <div className="contact-container">
                    <div className="contact-grid">
                        {/* Contact Info */}
                        <div className="contact-info">
                            <h2 className="section-heading-left">Contact Information</h2>
                            <p className="info-description">
                                Have questions about our services or pricing? Reach out to us through any of the following channels.
                            </p>

                            <div className="info-cards">
                                <div className="info-card">
                                    <div className="info-icon">
                                        <Phone size={24} />
                                    </div>
                                    <div className="info-details">
                                        <h3>Phone</h3>
                                        <p>+94 11 234 5678</p>
                                        <p>+94 77 123 4567</p>
                                    </div>
                                </div>

                                <div className="info-card">
                                    <div className="info-icon">
                                        <Mail size={24} />
                                    </div>
                                    <div className="info-details">
                                        <h3>Email</h3>
                                        <p>support@washtub.lk</p>
                                        <p>info@washtub.lk</p>
                                    </div>
                                </div>

                                <div className="info-card">
                                    <div className="info-icon">
                                        <MapPin size={24} />
                                    </div>
                                    <div className="info-details">
                                        <h3>Main Office</h3>
                                        <p>123 Laundry Lane,</p>
                                        <p>Colombo 03, Sri Lanka</p>
                                    </div>
                                </div>

                                <div className="info-card">
                                    <div className="info-icon">
                                        <Clock size={24} />
                                    </div>
                                    <div className="info-details">
                                        <h3>Business Hours</h3>
                                        <p>Mon - Sun: 7:00 AM - 9:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="contact-form-container">
                            <form className="contact-form">
                                <h2>Send us a Message</h2>
                                <div className="form-group">
                                    <label>Your Name</label>
                                    <input type="text" placeholder="John Doe" />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" placeholder="john@example.com" />
                                </div>
                                <div className="form-group">
                                    <label>Subject</label>
                                    <input type="text" placeholder="How can we help?" />
                                </div>
                                <div className="form-group">
                                    <label>Message</label>
                                    <textarea rows="5" placeholder="Your message here..."></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary submit-btn">
                                    Send Message <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="contact-container">
                    <h2 className="section-heading">Frequently Asked Questions</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <div className="faq-icon"><MessageSquare size={24} /></div>
                            <h3>How do I schedule a pickup?</h3>
                            <p>Simply log in to your account, select "New Order", choose your preferred time slot, and we'll handle the rest.</p>
                        </div>
                        <div className="faq-item">
                            <div className="faq-icon"><MessageSquare size={24} /></div>
                            <h3>What is the turnaround time?</h3>
                            <p>Our standard turnaround time is 24-48 hours. Express same-day service is available for selected areas.</p>
                        </div>
                        <div className="faq-item">
                            <div className="faq-icon"><MessageSquare size={24} /></div>
                            <h3>Do you offer delivery?</h3>
                            <p>Yes, we offer free pickup and delivery for orders above LKR 2000 within our service areas.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
