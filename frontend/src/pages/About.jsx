import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Users, Award, Clock, Shield, CheckCircle, Star } from 'lucide-react';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <Navbar />

            {/* Hero Section */}
            <section className="about-hero">
                <div className="about-hero-content">
                    <h1>About <span className="gradient-text">WashTub</span></h1>
                    <p>Sri Lanka's trusted laundry service, delivering freshness to your doorstep since 2002</p>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="about-section">
                <div className="about-container">
                    <div className="story-content">
                        <div className="story-text">
                            <h2>Our Story</h2>
                            <p>
                                WashTub was founded with a simple mission: to provide convenient,
                                high-quality laundry services that give people more time to focus on
                                what matters most to them.
                            </p>
                            <p>
                                What started as a small family business in Colombo has grown into
                                one of Sri Lanka's most trusted laundry service providers, serving
                                thousands of satisfied customers across the country.
                            </p>
                            <p>
                                We combine traditional care with modern technology to ensure your
                                clothes receive the best treatment possible, every single time.
                            </p>
                        </div>
                        <div className="story-image">
                            <div className="image-placeholder">
                                <span>🧺</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="about-container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-number">10,000+</span>
                            <span className="stat-label">Happy Customers</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">50,000+</span>
                            <span className="stat-label">Orders Completed</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">5+</span>
                            <span className="stat-label">Years Experience</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">99%</span>
                            <span className="stat-label">Satisfaction Rate</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="about-section why-choose-us">
                <div className="about-container">
                    <h2 className="section-heading">Why Choose WashTub?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Clock size={32} />
                            </div>
                            <h3>Quick Turnaround</h3>
                            <p>Get your clothes back fresh and clean within 24-48 hours</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Shield size={32} />
                            </div>
                            <h3>Safe & Secure</h3>
                            <p>Your garments are handled with utmost care and protection</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Award size={32} />
                            </div>
                            <h3>Premium Quality</h3>
                            <p>We use eco-friendly detergents and premium care products</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Users size={32} />
                            </div>
                            <h3>Expert Team</h3>
                            <p>Our trained professionals ensure the best results</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="about-section values-section">
                <div className="about-container">
                    <h2 className="section-heading">Our Values</h2>
                    <div className="values-list">
                        <div className="value-item">
                            <CheckCircle size={24} className="value-icon" />
                            <div>
                                <h4>Quality First</h4>
                                <p>We never compromise on the quality of our service</p>
                            </div>
                        </div>
                        <div className="value-item">
                            <CheckCircle size={24} className="value-icon" />
                            <div>
                                <h4>Customer Focused</h4>
                                <p>Your satisfaction is our top priority</p>
                            </div>
                        </div>
                        <div className="value-item">
                            <CheckCircle size={24} className="value-icon" />
                            <div>
                                <h4>Eco-Friendly</h4>
                                <p>We use environmentally responsible practices</p>
                            </div>
                        </div>
                        <div className="value-item">
                            <CheckCircle size={24} className="value-icon" />
                            <div>
                                <h4>Transparency</h4>
                                <p>Clear pricing with no hidden charges</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="about-section testimonials-section">
                <div className="about-container">
                    <h2 className="section-heading">What Our Customers Say</h2>
                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <div className="testimonial-stars">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f5a623" color="#f5a623" />)}
                            </div>
                            <p>"WashTub has made my life so much easier. The quality is amazing and the delivery is always on time!"</p>
                            <div className="testimonial-author">
                                <strong>Amandi Perera</strong>
                                <span>Colombo</span>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="testimonial-stars">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f5a623" color="#f5a623" />)}
                            </div>
                            <p>"I've tried many laundry services but WashTub is by far the best. Highly recommended!"</p>
                            <div className="testimonial-author">
                                <strong>Kasun Silva</strong>
                                <span>Kandy</span>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="testimonial-stars">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f5a623" color="#f5a623" />)}
                            </div>
                            <p>"Professional service, fair pricing, and my clothes always come back looking brand new."</p>
                            <div className="testimonial-author">
                                <strong>Nimal Fernando</strong>
                                <span>Galle</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="about-cta">
                <div className="about-container">
                    <div className="cta-content">
                        <h2>Ready to Experience the WashTub Difference?</h2>
                        <p>Join thousands of satisfied customers today</p>
                        <div className="cta-buttons">
                            <Link to="/signup" className="btn btn-primary">Get Started Free</Link>
                            <Link to="/pricing" className="btn btn-secondary">View Pricing</Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
