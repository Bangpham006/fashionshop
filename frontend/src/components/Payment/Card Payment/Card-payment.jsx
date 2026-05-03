import React from 'react';
import './Card-payment.css';

const CardPayment = ({ totalAmount, isDeliveryValid, onSuccess }) => {
    const handleCardPayment = () => {
        if (!isDeliveryValid()) return;
        onSuccess();
    };

    return (
        <div className="card-payment-wrapper">
            <div className="card-form-mockup">
                <input type="text" placeholder="Card Number (0000 0000 0000 0000)" className="card-input" />
                <div className="card-row">
                    <input type="text" placeholder="MM/YY" className="card-input" />
                    <input type="text" placeholder="CVC" className="card-input" />
                </div>
            </div>
            <button className="pay-now-button" onClick={handleCardPayment}>
                Pay {new Intl.NumberFormat('vi-VN').format(totalAmount)}₫
            </button>
        </div>
    );
};

export default CardPayment;