import React, { useState } from 'react';
import './CheckoutPage.css';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        phoneNumber: '',
        email: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Đơn hàng của bạn đã được ghi nhận! Cảm ơn bạn đã mua sắm.");
        navigate('/');
    };

    return (
        <div className="checkout-container">
            <div className="checkout-left">
                <h2 className="checkout-title">How would you like to get your order?</h2>
                <form onSubmit={handleSubmit} className="checkout-form">
                    <section className="form-section">
                        <h3>Enter your name and address:</h3>
                        <div className="input-group">
                            <input type="text" name="firstName" placeholder="First Name" required onChange={handleInputChange} />
                            <input type="text" name="lastName" placeholder="Last Name" required onChange={handleInputChange} />
                        </div>
                        <input type="text" name="address" placeholder="Address" required onChange={handleInputChange} />
                        <div className="input-group">
                            <input type="email" name="email" placeholder="Email" required onChange={handleInputChange} />
                            <input type="tel" name="phoneNumber" placeholder="Phone Number" required onChange={handleInputChange} />
                        </div>
                    </section>

                    <section className="form-section">
                        <h3>Payment</h3>
                        <p className="payment-notice">All transactions are secure and encrypted.</p>
                        <div className="payment-methods">
                            <label className="radio-container">
                                <input type="radio" name="payment" value="cod" defaultChecked />
                                <span className="checkmark"></span>
                                Cash on Delivery (COD)
                            </label>
                        </div>
                    </section>

                    <button type="submit" className="order-button">Place Order</button>
                </form>
            </div>

            <div className="checkout-right">
                <div className="order-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>1.500.000₫</span>
                    </div>
                    <div className="summary-row">
                        <span>Estimated Delivery & Handling</span>
                        <span>Free</span>
                    </div>
                    <div className="summary-total">
                        <span>Total</span>
                        <span>1.500.000₫</span>
                    </div>
                    <p className="tax-info">(Inclusive of local taxes and duties)</p>
                    
                    <div className="items-preview">
                        <h4>Arrives in 3-5 business days</h4>
                        <div className="item-card">
                            <div className="item-img-placeholder"></div>
                            <div className="item-details">
                                <p className="item-name">Nike Air Max 90</p>
                                <p className="item-sub">Men's Shoes</p>
                                <p className="item-sub">Qty 1 | Size 42</p>
                                <p className="item-price">1.500.000₫</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;