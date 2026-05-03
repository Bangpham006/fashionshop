import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import LoadingCircles from '../../components/Loading-circles';
import CODPayment from '../../components/Payment/COD Payment/COD-payment';
import CardPayment from '../../components/Payment/Card Payment/Card-payment';
import PayPalPayment from '../../components/Payment/PayPal Payment/Paypal-payment';
import './Checkout.css';

const Checkout = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [deliveryData, setDeliveryData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        phone: ''
    });
    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");
    const shippingFee = 30000;

    useEffect(() => {
        const fetchCartData = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`http://localhost:8080/api/cart/user/${userId}`);
                setCart(response.data);
            } catch (error) {
                console.error("Error fetching cart:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCartData();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDeliveryData({ ...deliveryData, [name]: value });
    };

    const validateDelivery = () => {
        const { email, firstName, lastName, address, phone } = deliveryData;
        if (!email || !firstName || !lastName || !address || !phone) {
            alert("Please complete all delivery information!");
            return false;
        }
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            alert("Invalid email format!");
            return false;
        }
        return true;
    };

    const handlePayNow = () => {
        if (validateDelivery()) {
            handleOrderSuccess();
        }
    };

    const handleOrderSuccess = async (details = null) => {
        try {
            await axios.delete(`http://localhost:8080/api/cart/clear/${userId}`);
            navigate('/payment-success', {
                state: {
                    fromCheckout: true,
                    orderId: "ORD-" + Math.floor(Math.random() * 1000000),
                    customerName: `${deliveryData.firstName} ${deliveryData.lastName}`
                }
            });
        } catch (error) {
            alert("Error processing order.");
        }
    };

    if (loading) return <LoadingCircles />;

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="error-container">
                <h2>Your cart is empty.</h2>
                <button className="btn-pay-now" style={{ width: 'auto', padding: '12px 30px' }} onClick={() => navigate('/')}>Return to Shop</button>
            </div>
        );
    }

    const subtotal = cart.totalPrice;
    const total = subtotal + shippingFee;
    const totalInUSD = (total / 25000).toFixed(2);

    return (
        <div className="checkout-wrapper">
            <PayPalScriptProvider
                options={{
                    "client-id": "test",
                    "currency": "USD",
                    "intent": "capture",
                    "disable-funding": "card,credit",
                    "crossorigin": "anonymous"
                }}>
                <div className="single-column-container">

                    {/* 1. Review Order */}
                    <section className="checkout-section">
                        <h2 className="checkout-heading">Review Order</h2>
                        {cart.items.map((item, index) => (
                            <div key={item.variantId || index} className="checkout-product-item">
                                <img src={item.image} alt="product" className="product-img" />
                                <div className="product-details">
                                    <p className="product-name">{item.productName}</p>
                                    <p className="text-gray">Size: {item.size} | Amount: {item.quantity}</p>
                                    <p className="price-text">{new Intl.NumberFormat('vi-VN').format(item.price || 0)}₫</p>
                                </div>
                            </div>
                        ))}
                    </section>

                    <hr className="checkout-divider" />

                    {/* 2. Delivery */}
                    <section className="checkout-section">
                        <h2 className="checkout-heading">Delivery Details</h2>
                        <input name='email' type="email" placeholder="Email" className="checkout-input" value={deliveryData.email} onChange={handleInputChange} />
                        <div className="input-row">
                            <input name='firstName' type="text" placeholder="First Name" className="checkout-input" value={deliveryData.firstName} onChange={handleInputChange} />
                            <input name='lastName' type="text" placeholder="Last Name" className="checkout-input" value={deliveryData.lastName} onChange={handleInputChange} />
                        </div>
                        <input name='address' type="text" placeholder="Shipping Address" className="checkout-input" value={deliveryData.address} onChange={handleInputChange} />
                        <input name='phone' type="tel" placeholder="Phone Number" className="checkout-input" value={deliveryData.phone} onChange={handleInputChange} />
                    </section>

                    <hr className="checkout-divider" />

                    {/* 3. Payment Method */}
                    <section className="checkout-section">
                        <h2 className="checkout-heading">Payment Method</h2>
                        <div className="method-selector">
                            <button className={`method-button ${paymentMethod === 'COD' ? 'selected' : ''}`} onClick={() => setPaymentMethod('COD')}>Cash on Delivery</button>
                            <button className={`method-button ${paymentMethod === 'CARD' ? 'selected' : ''}`} onClick={() => setPaymentMethod('CARD')}>Credit Card</button>
                            <button className={`method-button ${paymentMethod === 'PAYPAL' ? 'selected' : ''}`} onClick={() => setPaymentMethod('PAYPAL')}>PayPal</button>
                        </div>


                    </section>

                    <hr className="checkout-divider" />

                    {/* 4. Summary */}
                    <section className="checkout-section">
                        <h2 className="checkout-heading">Summary</h2>
                        <div className="summary-row">
                            <span className="text-gray">Subtotal</span>
                            <span>{new Intl.NumberFormat('vi-VN').format(subtotal)}₫</span>
                        </div>
                        <div className="summary-row">
                            <span className="text-gray">Shipping</span>
                            <span>{new Intl.NumberFormat('vi-VN').format(shippingFee)}₫</span>
                        </div>
                        <div className="total-row">
                            <span>Total</span>
                            <span>{new Intl.NumberFormat('vi-VN').format(total)}₫</span>
                        </div>
                    </section>

                    {/* 5. Actions */}
                    <section className="checkout-section" style={{ marginTop: '30px' }}>
                        {paymentMethod === 'PAYPAL' ? (
                            <PayPalPayment
                                totalInUSD={totalInUSD}
                                isDeliveryValid={validateDelivery}
                                onSuccess={handleOrderSuccess}
                            />
                        ) : paymentMethod === 'COD' ? (
                            <button className="btn-pay-now" onClick={handlePayNow}>Place Order</button>
                        ) : null}

                        {paymentMethod === 'CARD' && (
                            <div style={{ marginTop: '20px' }}>
                                <CardPayment totalAmount={total} isDeliveryValid={validateDelivery} onSuccess={handleOrderSuccess} />
                            </div>
                        )}
                    </section>
                </div>
            </PayPalScriptProvider>
        </div>
    );
};

export default Checkout;