import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Payment-success.css';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { fromCheckout, orderId } = location.state || {};

    useEffect(() => {
        if (!fromCheckout) {
            navigate('/');
        }
    }, [fromCheckout, navigate]);

    if (!fromCheckout) {
        return null;
    }

    return (
        <div className="payment-success-container">
            <div className="success-icon-wrapper">
                <span className="checkmark">✓</span>
            </div>

            <h1 className="success-title">Order Placed!</h1>
            <p className="success-message">
                Your order has been successfully processed. Thank you for shopping with us!
            </p>

            <div className="order-details-card">
                <div className="detail-item">
                    <span className="detail-label">Order Number</span>
                    <span className="detail-value">#{orderId}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Estimated Delivery</span>
                    <span className="detail-value">3 - 5 Business Days</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className="detail-value" style={{ color: '#27ae60' }}>Confirmed</span>
                </div>
            </div>

            <div className="action-buttons">
                <button className="button-continue" onClick={() => navigate('/')}>
                    Continue Shopping
                </button>
                <button className="button-outline" onClick={() => window.print()}>
                    Print Receipt
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;