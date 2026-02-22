import { useState } from 'react';
import {
    WashingMachine,
    Shirt,
    ChevronLeft,
    ChevronRight,
    Plus,
    Minus,
    X,
    ShoppingBasket
} from 'lucide-react';
import './CustomizeModal.css';

// Custom Pressing Icon (garment press machine)
const PressingIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="14" width="16" height="4" rx="1" />
        <path d="M6 14V12a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
        <path d="M4 10h16" />
        <rect x="6" y="6" width="12" height="4" rx="1" />
    </svg>
);

// Custom Dry Cleaning Icon (cleaning machine)
const DryCleaningIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="6" y="6" width="12" height="3" rx="1" />
        <circle cx="12" cy="14" r="3" />
    </svg>
);

const methods = [
    { id: 1, name: 'Wash & Dry', Icon: WashingMachine },
    { id: 2, name: 'Pressing', Icon: PressingIcon },
    { id: 3, name: 'Dry Cleaning', Icon: DryCleaningIcon },
    { id: 4, name: 'Ironing', Icon: Shirt }
];

const CustomizeModal = ({ item, allServices = [], onClose, onAddToBasket }) => {
    // Find all services with the same name
    const availableServices = allServices.filter(s => s.name === item.name);
    
    // If availableServices is empty (e.g. allServices not passed), just use the item itself
    const servicesToUse = availableServices.length > 0 ? availableServices : [item];

    // Map services to methods
    const availableMethods = servicesToUse.map(s => {
        const matchedMethod = methods.find(m => m.name === s.category);
        return {
            ...s,
            methodName: s.category || 'Other',
            Icon: matchedMethod ? matchedMethod.Icon : Shirt
        };
    });

    const [selectedMethodIndex, setSelectedMethodIndex] = useState(() => {
        const index = availableMethods.findIndex(m => m.methodName === item.category);
        return index >= 0 ? index : 0;
    });

    const [quantity, setQuantity] = useState(1);

    const handlePrevMethod = () => {
        setSelectedMethodIndex((prev) => (prev === 0 ? availableMethods.length - 1 : prev - 1));
    };

    const handleNextMethod = () => {
        setSelectedMethodIndex((prev) => (prev === availableMethods.length - 1 ? 0 : prev + 1));
    };

    const handleDecrease = () => {
        if (quantity > 0) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };

    const currentMethod = availableMethods[selectedMethodIndex];
    const currentPrice = currentMethod.price;

    const handleAddToBasket = () => {
        if (quantity > 0) {
            onAddToBasket({
                ...currentMethod,
                method: currentMethod.methodName,
                quantity,
                totalPrice: currentPrice * quantity
            });
        }
        onClose();
    };

    const MethodIcon = currentMethod.Icon;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="customize-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Customize your order</h2>
                    <button className="btn-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="item-preview">
                        <div className="item-preview-info">
                            <div className="item-preview-details">
                                <h3>{currentMethod.name}</h3>
                            </div>
                            <div className="item-preview-price">
                                LKR {(currentPrice * quantity).toFixed(2)}
                            </div>
                        </div>
                    </div>

                    <div className="item-options">
                        <div className="option-group">
                            <label>Select Method</label>
                            <div className="option-selector">
                                <button className="btn-nav" onClick={handlePrevMethod} disabled={availableMethods.length <= 1} style={{ opacity: availableMethods.length <= 1 ? 0.5 : 1 }}>
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="option-display">
                                    <div className="option-icon">
                                        <MethodIcon size={32} />
                                    </div>
                                    <span className="option-name">{currentMethod.methodName}</span>
                                </div>
                                <button className="btn-nav" onClick={handleNextMethod} disabled={availableMethods.length <= 1} style={{ opacity: availableMethods.length <= 1 ? 0.5 : 1 }}>
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="quantity-section">
                            <button className="btn-quantity" onClick={handleDecrease}>
                                <Minus size={18} />
                            </button>
                            <span className="quantity-value">{quantity}</span>
                            <button className="btn-quantity" onClick={handleIncrease}>
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-add-basket" onClick={handleAddToBasket}>
                        Add to basket
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomizeModal;


