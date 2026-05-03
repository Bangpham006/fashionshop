import React from 'react';
import { PayPalButtons, FUNDING } from "@paypal/react-paypal-js";

const PayPalPayment = ({ totalInUSD, isDeliveryValid, onSuccess }) => {
    return (
        <div className="paypal-container" style={styles.paypalContainer}>
            <PayPalButtons
                forceReRender={[totalInUSD]}
                fundingSource={FUNDING.PAYPAL}
                style={{
                    layout: "vertical",
                    shape: "pill",
                }}
                onClick={(data, actions) => {
                    if (isDeliveryValid()) {
                        return actions.resolve();
                    } else {
                        return actions.reject();
                    }
                }}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                currency_code: "USD",
                                value: String(totalInUSD)
                            },
                        }]
                    });
                }}
                onApprove={async (data, actions) => {
                    try {
                        const details = await actions.order.capture();
                        await onSuccess(details);
                    } catch (error) {
                        console.error("Capture failed:", error);
                        alert("Payment capture failed. Please try again.");
                    }
                }}
                onError={(err) => {
                    console.error("PayPal Error:", err);
                    alert("Paypal session expired or error. Please refresh page.");
                }}
            />
        </div>
    );
};

const styles = {
    paypalContainer: {
        marginTop: "20px",
        maxWidth: "100%",
    }
};
export default PayPalPayment;