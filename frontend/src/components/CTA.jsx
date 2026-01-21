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
                            Trusted laundry service for everyday freshness
                        </p>
                    </div>

                    <div className="cta-actions">
                        <button className="btn btn-primary btn-small">
                            Start Free Trial
                        </button>
                        <button className="btn btn-secondary btn-small">
                            Contact Sales
                        </button>
                    </div>

                    <div className="cta-features">
                        <div className="cta-feature">
                            <div className="feature-icon">✓</div>
                            <span>No credit card required</span>
                        </div>
                        <div className="cta-feature">
                            <div className="feature-icon">✓</div>
                            <span>Cancel anytime</span>
                        </div>
                        <div className="cta-feature">
                            <div className="feature-icon">✓</div>
                            <span>24/7 Support</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
