import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchCart = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`http://localhost:8080/api/cart/user/${userId}`);
                setCart(response.data);
            } catch (error) {
                console.error("Lỗi lấy giỏ hàng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [userId]);

    // Hàm điều hướng sang trang Checkout
    const handleCheckout = () => {
        if (cart && cart.items.length > 0) {
            navigate('/checkout');
        } else {
            alert("Giỏ hàng của bạn đang trống!");
        }
    };

    if (loading) return <div className="cart-loading">Loading Bag...</div>;

    if (!userId || !cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="empty-cart">
                <h2>There are no items in your bag.</h2>
                <button onClick={() => navigate('/')}>Continue Shopping</button>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <div className="cart-left">
                <h1 className="cart-title">Bag</h1>
                {cart.items.map((item) => (
                    <div key={item.variantId} className="cart-item">
                        <div className="item-image">
                            {/* Hiển thị ảnh sản phẩm, nếu null thì để trống */}
                            <img src={item.image || ""} alt={item.productName} />
                        </div>
                        <div className="item-details">
                            <div className="item-header">
                                <h3>{item.productName || "Sản phẩm"}</h3>
                                <p className="item-price">
                                    {/* SỬA LỖI NaN: Thêm || 0 để đảm bảo luôn có số */}
                                    {new Intl.NumberFormat('vi-VN').format(item.price || 0)} ₫
                                </p>
                            </div>
                            <p className="item-info">Size: {item.size}</p>
                            <p className="item-info">Quantity: {item.quantity}</p>
                            <div className="item-actions">
                                <button className="action-btn">Remove</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="cart-right">
                <h2 className="summary-title">Summary</h2>
                <div className="summary-row">
                    <span>Subtotal</span>
                    {/* SỬA LỖI NaN ở phần Summary */}
                    <span>{new Intl.NumberFormat('vi-VN').format(cart.totalPrice || 0)} ₫</span>
                </div>
                <div className="summary-row">
                    <span>Estimated Shipping & Handling</span>
                    <span>Free</span>
                </div>
                <div className="summary-total">
                    <span>Total</span>
                    <span>{new Intl.NumberFormat('vi-VN').format(cart.totalPrice || 0)} ₫</span>
                </div>
                
                {/* NÚT CHUYỂN SANG CHECKOUT */}
                <button className="checkout-btn" onClick={handleCheckout}>
                    Member Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;