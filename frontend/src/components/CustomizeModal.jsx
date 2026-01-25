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

const CustomizeModal = ({ item, onClose, onAddToBasket }) => {
    const [selectedMethod, setSelectedMethod] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const handlePrevMethod = () => {
        setSelectedMethod((prev) => (prev === 0 ? methods.length - 1 : prev - 1));
    };

    const handleNextMethod = () => {
        setSelectedMethod((prev) => (prev === methods.length - 1 ? 0 : prev + 1));
    };

    const handleDecrease = () => {
        if (quantity > 0) setQuantity(quantity - 1);
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };

    const handleAddToBasket = () => {
        if (quantity > 0) {
            onAddToBasket({
                ...item,
                method: methods[selectedMethod].name,
                quantity,
                totalPrice: item.price * quantity
            });
        }
        onClose();
    };

    const MethodIcon = methods[selectedMethod].Icon;

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
                        <div className="item-preview-image">
                            <ShoppingBasket size={64} />
                        </div>
                        <div className="item-preview-info">
                            <div className="item-preview-details">
                                <h3>{item.name}</h3>
                                <span>4 days to process</span>
                            </div>
                            <div className="item-preview-price">
                                LKR {(item.price * quantity).toFixed(2)}
                            </div>
                        </div>
                    </div>

                    <div className="item-options">
                        <div className="option-group">
                            <label>Select Method</label>
                            <div className="option-selector">
                                <button className="btn-nav" onClick={handlePrevMethod}>
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="option-display">
                                    <div className="option-icon">
                                        <MethodIcon size={32} />
                                    </div>
                                    <span className="option-name">{methods[selectedMethod].name}</span>
                                </div>
                                <button className="btn-nav" onClick={handleNextMethod}>
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


