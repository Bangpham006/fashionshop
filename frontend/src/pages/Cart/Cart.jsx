import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingCircles from '../../components/LoadingCircles';
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
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [userId]);

    const handleCheckout = () => {
        if (cart && cart.items.length > 0) {
            navigate('/checkout');
        } else {
            alert("Your cart is empty!");
        }
    };

    if (loading) {
        return <LoadingCircles />;
    }

    if (!userId || !cart || !cart.items || cart.items.length === 0) {
        return (
            <div className='empty-cart'>
                <h2 className='cart-title'>There are no items in your cart.</h2>
                <button onClick={() => navigate('/')}>Continue Shopping</button>
            </div>
        );
    }

    const handleRemoveItem = async (variantId) => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            alert("Please log in to perform this action!");
            return;
        }
        if (window.confirm("Are you sure you want to remove this item from your cart?")) {
            try {
                const response = await axios.delete(`http://localhost:8080/api/cart/remove`, {
                    params: {
                        userId: userId,
                        variantId: variantId
                    }
                });
                setCart(response.data);
            } catch (error) {
                alert("Cannot remove item. Please try again!");
            }
        }
    };

    return (
        <div className="cart-container">
            <div className="cart-left">
                <h1 className="cart-title">Cart</h1>
                {cart.items.map((item) => (
                    <div key={item.variantId} className="cart-item">
                        <div className="item-image">
                            <img src={item.image || ""} alt={item.productName} />
                        </div>
                        <div className="item-details">
                            <div className="item-header">
                                <h3>{item.productName || "Product"}</h3>
                                <p className="item-price">
                                    {new Intl.NumberFormat('vi-VN').format(item.price || 0)} ₫
                                </p>
                            </div>
                            <p className="item-info">Size: {item.size}</p>
                            <p className="item-info">Quantity: {item.quantity}</p>
                            <div className="item-actions">
                                <button className="action-button" onClick={() => handleRemoveItem(item.variantId)}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="cart-right">
                <h2 className="summary-title">Summary</h2>
                <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{new Intl.NumberFormat('vi-VN').format(cart.totalPrice || 0)} ₫</span>
                </div>
                <div className="summary-row">
                    <span>Estimated Shipping & Handling</span>
                    <span>30.000 ₫</span>
                </div>
                <div className="summary-total">
                    <span>Total</span>
                    <span>{new Intl.NumberFormat('vi-VN').format((cart.totalPrice || 0) + 30000)} ₫</span>
                </div>

                <button className="checkout-button" onClick={handleCheckout}>
                    Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;