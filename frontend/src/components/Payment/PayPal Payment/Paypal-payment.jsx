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
                    // Trả về actions.resolve() hoặc actions.reject() để kiểm soát việc mở popup
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
                                currency_code: "USD", // PHẢI nằm ở đây
                                value: String(totalInUSD) // Đảm bảo là chuỗi
                            },
                        }]
                    });
                }}
                onApprove={async (data, actions) => {
                    try {
                        const details = await actions.order.capture();
                        // Chỉ gọi onSuccess khi đã capture thành công
                        await onSuccess(details);
                    } catch (error) {
                        console.error("Capture failed:", error);
                        alert("Thanh toán thất bại khi lấy tiền. Vui lòng thử lại.");
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