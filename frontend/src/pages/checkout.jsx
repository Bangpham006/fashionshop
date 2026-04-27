import React, { useState } from 'react';

const Checkout = () => {
    const product = {
        name: "Nike Hyverse Men's Dri-FIT Training T-Shirt",
        price: 1019000,
        size: "L",
        quantity: 1,
        image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/28811802-1406-4074-9844-31f6e2b925f3/hyverse-mens-dri-fit-short-sleeve-graphic-training-top-9S6LPh.png",
    };

    const subtotal = product.price * product.quantity;
    const shippingFee = 30000;
    const total = subtotal + shippingFee;

    return (
        <div style={styles.checkoutWrapper}>
            <div style={styles.singleColumnContainer}>

                {/* 1. Review Order */}
                <section style={styles.section}>
                    <h2 style={styles.heading}>Review Your Order</h2>

                    <div style={styles.productCard}>
                        <img src={product.image} alt="product" style={styles.productImg} />
                        <div style={styles.productDetails}>
                            <p style={{ fontWeight: '600', marginBottom: '4px', fontSize: '16px' }}>{product.name}</p>
                            <p style={styles.grayText}>Size {product.size}</p>

                            <p style={{ marginTop: '12px', fontWeight: '600' }}>{product.price.toLocaleString()}₫</p>
                        </div>
                    </div>
                </section>

                <hr style={styles.divider} />

                {/* 2. Delivery Info */}
                <section style={styles.section}>
                    <h2 style={styles.heading}>Delivery Options</h2>

                    <div style={styles.inputGroup}>
                        <input
                            type="email"
                            placeholder="Email"
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.row}>
                        <input
                            type="text"
                            placeholder="First Name"
                            style={{ ...styles.input, flex: 1 }}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            style={{ ...styles.input, flex: 1 }}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="Shipping Address"
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            style={styles.input}
                        />
                    </div>
                </section>

                <hr style={styles.divider} />

                {/* 3. Order Summary */}
                <section style={styles.section}>
                    <h2 style={styles.heading}>Summary</h2>

                    <div style={styles.summaryRow}>
                        <span style={styles.grayText}>Product Price</span>
                        <span>{subtotal.toLocaleString()}₫</span>
                    </div>

                    <div style={styles.summaryRow}>
                        <span style={styles.grayText}>Shipping</span>
                        <span>30000₫</span>
                    </div>

                    <div style={styles.summaryRow}>
                        <span style={styles.grayText}>Quantity</span>
                        <span>{product.quantity}</span>
                    </div>

                    <div style={{ ...styles.summaryRow, fontWeight: '700', fontSize: '20px', marginTop: '10px' }}>
                        <span>Total</span>
                        <span>{total.toLocaleString()}₫</span>
                    </div>
                </section>

                <hr style={styles.divider} />

                {/* 4. Payment */}
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
                    <button style={styles.payNowButton}>Pay Now</button>
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
    paymentMethods: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
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
        marginBottom: '20px',
    },
    row: {
        display: 'flex',
        gap: '15px',
        marginBottom: '20px',
    },
    input: {
        width: '100%',
        padding: '16px',
        fontSize: '16px',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        outline: 'none',
        transition: 'border-color 0.2s',
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