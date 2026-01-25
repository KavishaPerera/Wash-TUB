import { useState } from 'react';
import './CustomizeModal.css';

const methods = [
    { id: 1, name: 'Wash & Dry' },
    { id: 2, name: 'Pressing' },
    { id: 3, name: 'Dry Cleaning' },
    { id: 4, name: 'Ironing' }
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

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="customize-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Customize your order</h2>
                    <button className="btn-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="item-preview">
                        <div className="item-preview-image">

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
                                <button className="btn-nav" onClick={handlePrevMethod}>←</button>
                                <div className="option-display">
                                    <div className="option-icon">

                                    </div>
                                    <span className="option-name">{methods[selectedMethod].name}</span>
                                </div>
                                <button className="btn-nav" onClick={handleNextMethod}>→</button>
                            </div>
                        </div>

                        <div className="quantity-section">
                            <button className="btn-quantity" onClick={handleDecrease}>−</button>
                            <span className="quantity-value">{quantity}</span>
                            <button className="btn-quantity" onClick={handleIncrease}>+</button>
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

