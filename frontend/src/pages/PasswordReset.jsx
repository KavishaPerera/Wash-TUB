import { Link, useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const PasswordReset = () => {
    const navigate = useNavigate();

    const handleContinue = () => {
        navigate('/signin');
    };

    return (
        <div className="password-page">
            <div className="password-container">
                <div className="password-card">
                    <div className="password-icon success-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>

                    <h2>Password Reset</h2>
                    <p className="subtitle">Your password has been successfully reset.</p>

                    <button className="btn-reset" onClick={handleContinue}>
                        Continue
                    </button>

                    <Link to="/signin" className="back-link">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PasswordReset;
