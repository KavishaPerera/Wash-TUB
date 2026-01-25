import { Link } from 'react-router-dom';
import './CTA.css';

const CTA = () => {
    return (
        <section className="cta section">
            <div className="container">
                <div className="cta-content glass">
                    <div className="cta-background">
                        <div className="cta-gradient"></div>
                    </div>

                    <div className="cta-text">
                        <h2 className="cta-title">
                            Ready to Transform Your
                            <br />
                            <span className="gradient-text">Laundry Experience?</span>
                        </h2>
                        <p className="cta-description">
                            Manage your laundry orders, track services, and enjoy hassle-free cleaning with our smart laundry management system.
                        </p>
                    </div>

                    <div className="cta-actions">
                        <Link to="/signup" className="btn btn-primary btn-small">
                            Get Started
                        </Link>
                        <Link to="/services" className="btn btn-secondary btn-small">
                            Services
                        </Link>
                    </div>

                    <div className="cta-features">
                        <div className="cta-feature">
                            <div className="feature-icon">✓</div>
                            <span>Online Schedule</span>
                        </div>
                        <div className="cta-feature">
                            <div className="feature-icon">✓</div>
                            <span>Online Payment</span>
                        </div>
                        <div className="cta-feature">
                            <div className="feature-icon">✓</div>
                            <span>Fast Delivery</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
