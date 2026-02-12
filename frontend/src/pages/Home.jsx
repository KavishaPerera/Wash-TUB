import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Clock, Shield, Award, Users, CheckCircle, Sparkles, Truck, Star } from 'lucide-react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-page">
            <Navbar />

            {/* Hero Section */}
            <section className="home-hero">
                <div className="home-hero-content">
                    <h1>
                        Clean Smarter with
                        <br />
                        <span className="gradient-text">WashTub!</span>
                    </h1>
                    <p>
                        Experience the future of laundry management with WashTub.
                        Schedule pickups, track orders, and enjoy fresh, clean clothes
                        delivered right to your doorstep.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/signup" className="btn btn-primary">
                            Get Started Free
                        </Link>
                        <Link to="/pricing" className="btn btn-secondary">
                            View Pricing
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="home-section features-section">
                <div className="home-container">
                    <h2 className="section-heading">Why Choose WashTub?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Clock size={32} />
                            </div>
                            <h3>Quick Pickup</h3>
                            <p>Fast and convenient pickup at your preferred time</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Sparkles size={32} />
                            </div>
                            <h3>Premium Care</h3>
                            <p>Eco-friendly products for the best garment care</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Truck size={32} />
                            </div>
                            <h3>Fast Delivery</h3>
                            <p>Get your clothes back fresh within 24-48 hours</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Shield size={32} />
                            </div>
                            <h3>Safe & Secure</h3>
                            <p>Your garments handled with utmost care</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="home-section how-it-works">
                <div className="home-container">
                    <h2 className="section-heading">How It Works</h2>
                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3>Schedule Pickup</h3>
                            <p>Book a pickup through our easy-to-use app or website</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h3>We Collect</h3>
                            <p>Our team picks up your laundry at your convenience</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3>Expert Care</h3>
                            <p>Your clothes are professionally cleaned with premium products</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">4</div>
                            <h3>Delivery</h3>
                            <p>Fresh, clean clothes delivered right to your doorstep</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
