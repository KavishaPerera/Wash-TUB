import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero" id="home">
            <div className="hero-background"></div>

            <div className="container">
                <div className="hero-content">
                    <div className="hero-text animate-fadeInUp">
                        <h1 className="hero-title">
                            Clean Smarter with
                            <br />
                            <span className="gradient-text">WashTub!</span>
                        </h1>
                        <p className="hero-description">
                            Experience the future of laundry management with WashTub.
                            Schedule pickups, track orders, and enjoy fresh, clean clothes
                            delivered right to your doorstep.
                        </p>
                        {/*<div className="hero-buttons">
                            <Link to="/signup" className="btn btn-primary btn-xs">
                                Sign Up
                            </Link>
                            <button className="btn btn-secondary btn-xs">
                                Login
                            </button>
                        </div>*/}

                    </div>


                </div>
            </div>
        </section>
    );
};

export default Hero;
