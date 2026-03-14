import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const NotificationContext = createContext({ unreadCount: 0, refreshUnreadCount: () => {} });

export const NotificationProvider = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUnreadCount(0);
            return;
        }
        try {
            const res = await fetch(`${API}/notifications/unread-count`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setUnreadCount(Number(data.count) || 0);
            } else {
                setUnreadCount(0);
            }
        } catch {
            // silently ignore — badge simply won't show
        }
    }, []);

    useEffect(() => {
        fetchUnreadCount();
        // Poll every 30 seconds to keep badge in sync
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

    return (
        <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount: fetchUnreadCount }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
