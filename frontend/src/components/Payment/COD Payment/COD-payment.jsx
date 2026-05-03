import React from 'react';
import './COD-payment.css';

const CODPayment = ({ onOrderSuccess }) => {
    return (
        <div className="payment-method-container">
            <p className="payment-note">Bạn sẽ thanh toán bằng tiền mặt khi nhận được hàng.</p>
            <button className="pay-now-button" onClick={onOrderSuccess}>
                Đặt hàng ngay
            </button>
        </div>
    );
};

export default CODPayment;