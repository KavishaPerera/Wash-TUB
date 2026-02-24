import { createContext, useContext, useState } from 'react';

// ─── Initial mock orders (shared source of truth) ───────────────────────────
const INITIAL_ORDERS = [
    { id: 'ORD-001', customer: 'Nimal perera', service: 'Wash & Dry', status: 'Pending', items: 'Curtain', date: 'Jan 24, 2026', total: 'LKR 1,500' },
    { id: 'ORD-002', customer: 'Jane fernando', service: 'Dry Cleaning', status: 'In Progress', items: '2 Suits', date: 'Jan 25, 2026', total: 'LKR 1,200' },
    { id: 'ORD-003', customer: 'Mewan Gunathilaka', service: 'Ironing', status: 'Completed', items: '10 Shirts', date: 'Jan 23, 2026', total: 'LKR 2,800' },
    { id: 'ORD-004', customer: 'Mohommad Ismail', service: 'Pressing', status: 'Pending', items: 'Silk Dress', date: 'Today', total: 'LKR 350' },
    { id: 'ORD-005', customer: 'Samantha Abeyrathna', service: 'Dry Cleaning', status: 'Pending', items: 'Living Room Set', date: 'Yesterday', total: 'LKR 500' },
];

const StaffOrdersContext = createContext(null);

export const StaffOrdersProvider = ({ children }) => {
    const [orders, setOrders] = useState(INITIAL_ORDERS);

    /** Update the status of a single order by id */
    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prev =>
            prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
        );
    };

    return (
        <StaffOrdersContext.Provider value={{ orders, updateOrderStatus }}>
            {children}
        </StaffOrdersContext.Provider>
    );
};

export const useStaffOrders = () => {
    const ctx = useContext(StaffOrdersContext);
    if (!ctx) throw new Error('useStaffOrders must be used inside <StaffOrdersProvider>');
    return ctx;
};
