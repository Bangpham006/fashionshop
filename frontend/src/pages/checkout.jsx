import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
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
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCartData();
    }, [userId]);

    function handlePayNowButton() {
        alert("Your order has been placed successfully! Thank you for shopping with us.");
        navigate('/');
    }

    if (loading) return <div style={styles.checkoutWrapper}>Loading order...</div>;

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div style={styles.checkoutWrapper}>
                <h2>Your bag is empty. Please add items before checkout.</h2>
                <button style={styles.payNowButton} onClick={() => navigate('/cart')}>Back to Bag</button>
            </div>
        );
    }

    const subtotal = cart.totalPrice || 0;
    const total = subtotal + shippingFee;

    return (
        <div style={styles.checkoutWrapper}>
            <div style={styles.singleColumnContainer}>
                <section style={styles.section}>
                    <h2 style={styles.heading}>Review Your Order</h2>

                    {cart.items.map((item, index) => (
                        <div key={item.variantId || index} style={{ ...styles.productCard, marginBottom: '20px' }}>
                            <img src={item.image} alt="product" style={styles.productImg} />
                            <div style={styles.productDetails}>
                                <p style={{ fontWeight: '600', marginBottom: '4px', fontSize: '16px' }}>{item.productName}</p>
                                <p style={styles.grayText}>Size {item.size}</p>
                                <p style={styles.grayText}>Quantity: {item.quantity}</p>
                                <p style={{ marginTop: '8px', fontWeight: '600' }}>
                                    {new Intl.NumberFormat('vi-VN').format(item.price || 0)}₫
                                </p>
                            </div>
                        </div>
                    ))}
                </section>

                <hr style={styles.divider} />

                <section style={styles.section}>
                    <h2 style={styles.heading}>Delivery Options</h2>
                    <div style={styles.inputGroup}>
                        <input type="email" placeholder="Email" style={styles.input} />
                    </div>
                    <div style={styles.row}>
                        <input type="text" placeholder="First Name" style={{ ...styles.input, flex: 1 }} />
                        <input type="text" placeholder="Last Name" style={{ ...styles.input, flex: 1 }} />
                    </div>
                    <div style={styles.inputGroup}>
                        <input type="text" placeholder="Shipping Address" style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                        <input type="tel" placeholder="Phone Number" style={styles.input} />
                    </div>
                </section>

                <hr style={styles.divider} />

                <section style={styles.section}>
                    <h2 style={styles.heading}>Summary</h2>

                    <div style={styles.summaryRow}>
                        <span style={styles.grayText}>Subtotal</span>
                        <span>{new Intl.NumberFormat('vi-VN').format(subtotal)}₫</span>
                    </div>

                    <div style={styles.summaryRow}>
                        <span style={styles.grayText}>Shipping</span>
                        <span>{new Intl.NumberFormat('vi-VN').format(shippingFee)}₫</span>
                    </div>

                    <div style={{ ...styles.summaryRow, fontWeight: '700', fontSize: '20px', marginTop: '10px' }}>
                        <span>Total</span>
                        <span>{new Intl.NumberFormat('vi-VN').format(total)}₫</span>
                    </div>
                </section>

                <hr style={styles.divider} />

                <section style={styles.section}>
                    <h2 style={styles.heading}>Payment</h2>
                    <div style={styles.row}>
                        <button style={styles.paymentButton}>Pay with Card</button>
                        <button style={styles.paymentButton}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="paypal" style={{ height: '20px' }} />
                        </button>
                    </div>
                </section>

                <hr style={styles.divider} />

                <section style={styles.section}>
                    <button style={styles.payNowButton} onClick={handlePayNowButton}>
                        Pay Now
                    </button>
                </section>
            </div>
        </div>
    );
};

const styles = {
    checkoutWrapper: {
        backgroundColor: '#fff',
        minHeight: '100vh',
        padding: '40px 20px',
        display: 'flex',
        justifyContent: 'center'
    },
    singleColumnContainer: {
        width: '100%',
        maxWidth: '600px'
    },
    section: {
        padding: '10px 0'
    },
    heading: {
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '20px',
        letterSpacing: '-0.5px'
    },
    divider: {
        border: 'none',
        borderTop: '1px solid #f5f5f5',
        margin: '10px 0'
    },
    productCard: {
        display: 'flex',
        gap: '20px',
        alignItems: 'flex-start'
    },
    productImg: {
        width: '100px',
        height: '100px',
        objectFit: 'cover',
        borderRadius: '8px',
        backgroundColor: '#f6f6f6'
    },
    productDetails: {
        flex: 1
    },
    grayText: {
        color: '#707072',
        fontSize: '14px'
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
        fontSize: '16px'
    },
    paymentButton: {
        flex: 1,
        width: '100%',
        padding: '10px',
        backgroundColor: '#ffffff',
        color: '#000000',
        border: '1px solid #000000',
        fontSize: '16px',
        cursor: 'pointer'
    },
    inputGroup: {
        marginBottom: '20px'
    },
    row: {
        display: 'flex',
        gap: '15px',
        marginBottom: '20px'
    },
    input: {
        width: '100%',
        padding: '16px',
        fontSize: '16px',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        outline: 'none',
        transition: 'border-color 0.2s'
    },
    payNowButton: {
        flex: 1,
        width: '100%',
        padding: '16px',
        backgroundColor: '#000',
        color: '#fff',
        border: 'none',
        borderRadius: '30px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer'
    }
};

export default Checkout;