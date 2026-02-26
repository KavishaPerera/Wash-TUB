import { useLocation, useNavigate } from 'react-router-dom';
import { ClipboardList, ShoppingBag, CheckCircle, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const orderNumber   = location.state?.orderNumber   || '';
    const total         = location.state?.total         || 0;
    const orderId       = location.state?.orderId       || '';
    const customerName  = location.state?.customerName  || '';
    const customerPhone = location.state?.customerPhone || '';
    const customerAddress = location.state?.customerAddress || '';
    const deliveryOption  = location.state?.deliveryOption  || 'delivery';
    const paymentMethod   = location.state?.paymentMethod   || 'cash';
    const pickupDate    = location.state?.pickupDate    || '';
    const pickupTime    = location.state?.pickupTime    || '';
    const items         = location.state?.items         || [];
    const subtotal      = location.state?.subtotal      || 0;
    const deliveryFee   = location.state?.deliveryFee   || 0;

    const downloadReceipt = () => {
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const pageW = doc.internal.pageSize.getWidth();
        const margin = 48;
        const contentW = pageW - margin * 2;
        let y = 0;

        // ── Header band ──────────────────────────────────────────────
        doc.setFillColor(14, 165, 233);          // sky-500
        doc.rect(0, 0, pageW, 80, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.text('WashTub Laundry', margin, 32);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text('Official Payment Receipt', margin, 52);
        doc.text('www.washtub.lk  |  +94 11 790 6108', margin, 66);

        // Receipt label (right side)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text('RECEIPT', pageW - margin, 38, { align: 'right' });
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`, pageW - margin, 54, { align: 'right' });
        if (orderNumber) {
            doc.text(`Order #: ${orderNumber}`, pageW - margin, 68, { align: 'right' });
        }

        y = 100;

        // ── Status badge ──────────────────────────────────────────────
        doc.setFillColor(220, 252, 231);   // green-100
        doc.roundedRect(margin, y, contentW, 32, 6, 6, 'F');
        doc.setTextColor(21, 128, 61);     // green-700
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Payment successful - Your order is now being processed', margin + 14, y + 21);

        y += 48;

        // ── Customer details ──────────────────────────────────────────
        doc.setTextColor(15, 23, 42);      // slate-900
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Customer Details', margin, y);
        y += 4;
        doc.setDrawColor(14, 165, 233);
        doc.setLineWidth(1.5);
        doc.line(margin, y, margin + 120, y);
        y += 14;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);

        const details = [
            ['Name',            customerName  || '—'],
            ['Phone',           customerPhone || '—'],
            [deliveryOption === 'delivery' ? 'Delivery Address' : 'Pickup Type',
                                customerAddress || '—'],
            ['Pickup Date',     pickupDate    || '—'],
            ['Pickup Time',     pickupTime    || '—'],
            ['Payment Method',  paymentMethod === 'cash' ? 'Cash on Delivery' : 'Card Payment'],
        ];

        details.forEach(([label, value]) => {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(100, 116, 139);   // slate-400
            doc.text(label + ':', margin, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(30, 41, 59);
            doc.text(value, margin + 130, y);
            y += 16;
        });

        y += 10;

        // ── Order items table ─────────────────────────────────────────
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text('Order Items', margin, y);
        y += 4;
        doc.setDrawColor(14, 165, 233);
        doc.setLineWidth(1.5);
        doc.line(margin, y, margin + 90, y);
        y += 12;

        // Table header
        doc.setFillColor(241, 245, 249);   // slate-100
        doc.rect(margin, y, contentW, 22, 'F');
        doc.setTextColor(71, 85, 105);
        doc.setFontSize(9.5);
        const col = {
            item:  margin + 6,
            method: margin + 200,
            qty:   margin + 300,
            price: margin + 360,
            total: margin + contentW - 6,
        };
        y += 15;
        doc.text('Item / Service',  col.item,   y);
        doc.text('Method',          col.method, y);
        doc.text('Qty',             col.qty,    y);
        doc.text('Unit Price',      col.price,  y);
        doc.text('Total',           col.total,  y, { align: 'right' });
        y += 6;

        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.5);
        doc.line(margin, y, margin + contentW, y);
        y += 8;

        // Table rows
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(30, 41, 59);

        if (items.length === 0) {
            doc.setTextColor(148, 163, 184);
            doc.text('No item details available.', margin + 6, y + 10);
            y += 24;
        } else {
            items.forEach((item, idx) => {
                if (idx % 2 === 0) {
                    doc.setFillColor(248, 250, 252);
                    doc.rect(margin, y - 4, contentW, 18, 'F');
                }
                doc.setTextColor(30, 41, 59);
                const itemLabel = item.name + (item.unitType ? ` (${item.unitType})` : '');
                doc.text(itemLabel,                       col.item,   y + 8);
                doc.text(item.method || '—',              col.method, y + 8);
                doc.text(String(item.quantity ?? 1),      col.qty,    y + 8);
                doc.text(`LKR ${Number(item.price).toFixed(2)}`,          col.price,  y + 8);
                doc.text(`LKR ${Number(item.totalPrice ?? (item.price * (item.quantity ?? 1))).toFixed(2)}`, col.total, y + 8, { align: 'right' });
                y += 18;
            });
        }

        y += 4;
        doc.setDrawColor(203, 213, 225);
        doc.line(margin, y, margin + contentW, y);
        y += 14;

        // ── Totals ────────────────────────────────────────────────────
        const drawTotalRow = (label, value, bold = false, color = [30, 41, 59]) => {
            if (bold) {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(11);
            } else {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
            }
            doc.setTextColor(...color);
            doc.text(label, pageW - margin - 150, y);
            doc.text(value, pageW - margin, y, { align: 'right' });
            y += 18;
        };

        drawTotalRow('Subtotal',     `LKR ${Number(subtotal).toFixed(2)}`);
        drawTotalRow('Delivery Fee', `LKR ${Number(deliveryFee).toFixed(2)}`);
        y += 2;
        doc.setDrawColor(14, 165, 233);
        doc.setLineWidth(1);
        doc.line(pageW - margin - 160, y, pageW - margin, y);
        y += 10;
        drawTotalRow('Total Paid',   `LKR ${Number(total).toFixed(2)}`, true, [14, 165, 233]);

        y += 20;

        // ── Footer ────────────────────────────────────────────────────
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y, contentW, 50, 'F');
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text('Thank you for choosing WashTub Laundry!', pageW / 2, y + 18, { align: 'center' });
        doc.text('For queries, contact us at support@washtub.lk or call +94 11 790 6108', pageW / 2, y + 32, { align: 'center' });
        
        const filename = orderNumber ? `Receipt-${orderNumber}.pdf` : 'WashTub-Receipt.pdf';
        doc.save(filename);
    };

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

                {/* Download Receipt */}
                <button
                    id="btn-ps-download-receipt"
                    className="ps-btn ps-btn-receipt"
                    onClick={downloadReceipt}
                >
                    <Download size={18} />
                    Download Receipt
                </button>

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
