import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StaffOrdersContext = createContext(null);

const POLL_INTERVAL_MS = 30_000; // auto-refresh every 30 seconds

export const StaffOrdersProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const pollingRef = useRef(null);

    // ── Helper: get token ──────────────────────────────────────────────────
    const getToken = () => localStorage.getItem('token');

    // ── Fetch all orders (staff + owner roles can call GET /api/orders) ────
    const fetchOrders = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API}/orders`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            // Normalise to a consistent shape used by StaffDashboard / StaffUpdateOrder
            const normalised = data.map(o => ({
                id: o.order_number,     // display ID, e.g. WT-20260224-0001
                _dbId: o.id,               // numeric DB id, used for status updates
                customer: o.full_name,
                service: o.items?.map(i => i.item_name).join(', ') || 'Order',
                items: o.items?.map(i => i.item_name).join(', ') || '—',
                date: new Date(o.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                total: `LKR ${parseFloat(o.total).toFixed(2)}`,
                status: capitalise(o.status?.replace(/_/g, ' ') || 'Pending'),
                phone: o.phone || '—',
                address: o.address || '—',
                city: o.city || '—',
                postalCode: o.postal_code || '—',
                pickupDate: o.pickup_date ? new Date(o.pickup_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—',
                pickupTime: o.pickup_time || '—',
                deliveryOption: o.delivery_option || 'delivery',
                paymentMethod: o.payment_method || 'cash',
                specialInstructions: o.special_instructions || '',
                itemsDetail: o.items || [],
                _raw: o,
            }));
            setOrders(normalised);
            setLastUpdated(new Date());
        } catch (err) {
            console.error('StaffOrdersContext fetchOrders error:', err);
            setError('Failed to load orders');
        } finally {
            if (!silent) setLoading(false);
        }
    }, []);

    // ── Initial load + polling ─────────────────────────────────────────────
    useEffect(() => {
        fetchOrders();

        // Start polling — silent refresh (no loading spinner) every 30s
        pollingRef.current = setInterval(() => fetchOrders(true), POLL_INTERVAL_MS);

        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [fetchOrders]);

    // ── Update status: write to backend, then mirror in local state ────────
    const updateOrderStatus = async (displayId, newStatusLabel) => {
        // Convert display label→ backend enum, e.g. "In Progress" → "processing"
        const backendStatus = labelToEnum(newStatusLabel);

        // Optimistic UI update first
        setOrders(prev =>
            prev.map(o => o.id === displayId ? { ...o, status: newStatusLabel } : o)
        );

        // Find the numeric DB id
        const order = orders.find(o => o.id === displayId);
        if (!order?._dbId) return;

        try {
            const res = await fetch(`${API}/orders/${order._dbId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({ status: backendStatus }),
            });
            if (!res.ok) {
                // Roll back on failure
                setOrders(prev =>
                    prev.map(o => o.id === displayId ? { ...o, status: order.status } : o)
                );
                console.error('Status update failed:', await res.json());
            }
        } catch (err) {
            console.error('Status update network error:', err);
        }
    };

    return (
        <StaffOrdersContext.Provider value={{ orders, loading, error, lastUpdated, fetchOrders, updateOrderStatus }}>
            {children}
        </StaffOrdersContext.Provider>
    );
};

export const useStaffOrders = () => {
    const ctx = useContext(StaffOrdersContext);
    if (!ctx) throw new Error('useStaffOrders must be used inside <StaffOrdersProvider>');
    return ctx;
};

// ── Helpers ────────────────────────────────────────────────────────────────
function capitalise(str) {
    return str
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

const LABEL_TO_ENUM = {
    'Pending': 'pending',
    'Confirmed': 'confirmed',
    'Pickup Scheduled': 'pickup_scheduled',
    'Picked Up': 'picked_up',
    'In Progress': 'processing',
    'Processing': 'processing',
    'Ready': 'ready',
    'Out For Delivery': 'out_for_delivery',
    'Delivered': 'delivered',
    'Completed': 'delivered',   // stepper label alias
    'Cancelled': 'cancelled',
};

function labelToEnum(label) {
    return LABEL_TO_ENUM[label] ?? label.toLowerCase().replace(/ /g, '_');
}
