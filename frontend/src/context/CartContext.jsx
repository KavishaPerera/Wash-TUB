import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'washtub_cart';

// Load cart from localStorage
const loadCart = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
    } catch { /* ignore parse errors */ }
    return [];
};

// Cart reducer
const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM': {
            // Check if same item + same method already in cart
            const existingIndex = state.findIndex(
                (i) => i.serviceId === action.payload.serviceId && i.method === action.payload.method
            );
            if (existingIndex >= 0) {
                // Increase quantity
                return state.map((item, idx) =>
                    idx === existingIndex
                        ? {
                            ...item,
                            quantity: item.quantity + action.payload.quantity,
                            totalPrice: (item.quantity + action.payload.quantity) * item.price,
                        }
                        : item
                );
            }
            return [...state, action.payload];
        }

        case 'REMOVE_ITEM':
            return state.filter((_, idx) => idx !== action.payload);

        case 'UPDATE_QUANTITY':
            return state.map((item, idx) =>
                idx === action.payload.index
                    ? {
                        ...item,
                        quantity: action.payload.quantity,
                        totalPrice: action.payload.quantity * item.price,
                    }
                    : item
            );

        case 'CLEAR_CART':
            return [];

        default:
            return state;
    }
};

// Provider component
export const CartProvider = ({ children }) => {
    const [cartItems, dispatch] = useReducer(cartReducer, [], loadCart);

    // Persist to localStorage on every change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    }, [cartItems]);

    // Computed values
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.totalPrice || item.price * item.quantity), 0);

    // Actions
    const addToCart = (item) => {
        dispatch({
            type: 'ADD_ITEM',
            payload: {
                serviceId: item.id || item.serviceId,
                name: item.name,
                category: item.category || item.methodName || '',
                method: item.method || item.methodName || item.category || '',
                unitType: item.unitType || 'ITEM',
                price: item.price,
                quantity: item.quantity || 1,
                totalPrice: (item.totalPrice || item.price * (item.quantity || 1)),
            },
        });
    };

    const removeFromCart = (index) => {
        dispatch({ type: 'REMOVE_ITEM', payload: index });
    };

    const updateQuantity = (index, quantity) => {
        if (quantity <= 0) {
            removeFromCart(index);
            return;
        }
        dispatch({ type: 'UPDATE_QUANTITY', payload: { index, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                itemCount,
                totalAmount,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Custom hook
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
