import { useLocation, useNavigate } from 'react-router-dom';
import { ClipboardList, ShoppingBag, CheckCircle } from 'lucide-react';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const orderNumber = location.state?.orderNumber || '';
    const total = location.state?.total || 0;
    const orderId = location.state?.orderId || '';

    return (
        <div className="ps-page">
            {/* Animated background blobs */}
            <div className="ps-blob ps-blob-1" />
            <div className="ps-blob ps-blob-2" />

            <div className="ps-card">
                {/* Icon */}
                <div className="ps-icon-wrap">
                    <CheckCircle className="ps-check-icon" strokeWidth={1.8} />
                    <div className="ps-icon-ring" />
                </div>

                {/* Heading */}
                <h1 className="ps-title">Payment Successful!</h1>
                <p className="ps-subtitle">
                    Your payment has been confirmed. Your order is now being processed.
                </p>

                {/* Order summary strip */}
                <div className="ps-summary">
                    {orderNumber && (
                        <div className="ps-summary-row">
                            <span className="ps-summary-label">Order Number</span>
                            <span className="ps-summary-value ps-highlight">{orderNumber}</span>
                        </div>
                    )}
                    {total > 0 && (
                        <div className="ps-summary-row">
                            <span className="ps-summary-label">Amount Paid</span>
                            <span className="ps-summary-value ps-amount">
                                LKR {Number(total).toFixed(2)}
                            </span>
                        </div>
                    )}
                    <div className="ps-summary-row">
                        <span className="ps-summary-label">Status</span>
                        <span className="ps-status-badge">Confirmed</span>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="ps-actions">
                    <button
                        id="btn-ps-my-orders"
                        className="ps-btn ps-btn-primary"
                        onClick={() => navigate('/my-orders')}
                    >
                        <ClipboardList size={18} />
                        My Orders
                    </button>
                    <button
                        id="btn-ps-shop-again"
                        className="ps-btn ps-btn-outline"
                        onClick={() => navigate('/pricing')}
                    >
                        <ShoppingBag size={18} />
                        Back to Shop
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
