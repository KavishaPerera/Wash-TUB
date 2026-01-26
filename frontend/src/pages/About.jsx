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
                            <img src="/images/about 1.jpg" alt="WashTub Laundry Services" className="about-img" />
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
