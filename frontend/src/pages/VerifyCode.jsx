import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './SignUp.css';

const VerifyCode = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef([]);

    const handleChange = (index, value) => {
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (error) setError('');

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
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
            <>
                <Navbar />
                <div className="auth-page">
                    <div className="auth-container animate-fadeInUp">
                        <div className="auth-card">
                            <div className="auth-brand">
                                <h2>Session Expired</h2>
                                <p>Please start the password reset process again.</p>
                            </div>
                            <div className="auth-footer">
                                <Link to="/forgot-password" className="auth-btn-submit" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    Go to Forgot Password
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="auth-page">
                <div className="auth-container animate-fadeInUp">
                    <div className="auth-card">
                        <div className="auth-brand">
                            <div className="auth-brand-icon">
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.9 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1-1.06a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                                </svg>
                            </div>
                            <h2>Verify Code</h2>
                            <p>Enter the 6-digit code sent to <strong>{email}</strong></p>
                        </div>

                        {error && (
                            <div className="auth-alert auth-alert-error">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                                <span>{error}</span>
                            </div>
                        )}

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

                            <button type="submit" className="auth-btn-submit" disabled={isLoading}>
                                {isLoading ? (
                                    <><span className="auth-spinner"></span> Verifying...</>
                                ) : (
                                    'Verify Code'
                                )}
                            </button>
                        </form>

                        <div className="auth-footer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                            <span>
                                Didn't receive a code?{' '}
                                <button className="auth-resend-btn" onClick={handleResend}>
                                    Resend
                                </button>
                            </span>
                            <Link to="/signin" className="auth-back-link">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 12H5M12 19l-7-7 7-7" />
                                </svg>
                                Back to Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerifyCode;
