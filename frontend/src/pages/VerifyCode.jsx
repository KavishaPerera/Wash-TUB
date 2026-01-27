import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './ForgotPassword.css';

const VerifyCode = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef([]);

    const handleChange = (index, value) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Take only the last character
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace - move to previous input
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (/^\d+$/.test(pastedData)) {
            const newOtp = [...otp];
            pastedData.split('').forEach((char, i) => {
                if (i < 6) newOtp[i] = char;
            });
            setOtp(newOtp);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const code = otp.join('');
        if (code.length !== 6) {
            setError('Please enter the 6-digit code');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });

            const data = await response.json();

            if (data.success) {
                navigate('/set-new-password', { state: { email } });
            } else {
                setError(data.message || 'Invalid code');
            }
        } catch (err) {
            setError('Failed to connect to server');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            if (data.success) {
                alert('Verification code resent!');
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert('Failed to resend code');
        }
    };

    if (!email) {
        return (
            <div className="password-page">
                <div className="password-container">
                    <div className="password-card">
                        <h2>Error</h2>
                        <p>No email provided. Please start from the beginning.</p>
                        <Link to="/forgot-password" className="btn-reset" style={{ textAlign: 'center', textDecoration: 'none' }}>
                            Go to Forgot Password
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="password-page">
            <div className="password-container">
                <div className="password-card">
                    <div className="password-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                        </svg>
                    </div>

                    <h2>Verify Code</h2>
                    <p className="subtitle">Enter the 6-digit code sent to {email}</p>

                    {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="otp-container">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    className="otp-input"
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                />
                            ))}
                        </div>

                        <button type="submit" className="btn-reset" disabled={isLoading}>
                            {isLoading ? 'Verifying...' : 'Verify Code'}
                        </button>
                    </form>

                    <button className="resend-link" onClick={handleResend}>
                        Resend Code
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

export default VerifyCode;
