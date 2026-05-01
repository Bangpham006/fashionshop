import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import LoadingCircles from '../../components/Loading-circles';
import axios from 'axios';
import './ProductDetail.css';

const ProductDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const productRes = await axios.get(`http://localhost:8080/api/products/slug/${slug}`);
                const productData = productRes.data;
                setProduct(productData);

                const pId = productData.productId || productData.id || productData._id;

                if (pId) {
                    const variantsRes = await axios.get(`http://localhost:8080/api/variants/product/${pId}`);
                    const data = Array.isArray(variantsRes.data) ? variantsRes.data : [];
                    const sortedVariants = data.sort((a, b) => parseFloat(a.size) - parseFloat(b.size));
                    setVariants(sortedVariants);
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    const handleAddToCart = async () => {
        if (!userId) {
            alert("Please login first!");
            navigate('/auth/login');
            return;
        }

        if (!selectedVariant) {
            alert("Please select a size first!");
            return;
        }

        try {
            await axios.post(`http://localhost:8080/api/cart/add`, null, {
                params: {
                    userId: userId,
                    variantId: selectedVariant.id || selectedVariant._id,
                    quantity: 1
                }
            });
            setShowModal(true);
            setTimeout(() => setShowModal(false), 5000);
        } catch (error) {
            alert("Failed to add to cart!");
        }
    };

    if (loading) {
        return <LoadingCircles />;
    }
    if (!product) return <div className="error">Product not found.</div>;

    return (
        <div className="pdp-container">
            {showModal && (
                <div className="nike-modal-overlay">
                    <div className="nike-modal">
                        <div className="modal-header">
                            <span className="success-icon">✔</span>
                            <span>Added to Bag</span>
                            <button className="close-button" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <img src={product.images?.[0]} alt="" />
                            <div className="item-info">
                                <h4>{product.name}</h4>
                                <p>Size: {selectedVariant?.size}</p>
                                <p >Color: {selectedVariant?.color}</p>
                                <p>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedVariant?.price || product.basePrice)}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="view-bag-button" onClick={() => navigate('/cart')}>View Bag</button>
                            <button className="checkout-button" onClick={() => navigate('/checkout')}>Checkout</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="pdp-left">
                <img src={product.images?.[0]} alt={product.name} />
            </div>

            <div className="pdp-right">
                <div className="pdp-info">
                    <h1 className="pdp-name">{product.name}</h1>
                    <p className="pdp-category">{product.gender}'s {product.type}</p>
                    <p className="pdp-price">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedVariant?.price || product.basePrice)}
                    </p>
                </div>

                <div className="pdp-selection">
                    <h3>Select Size</h3>
                    <div className="size-grid">
                        {variants.map((v) => {
                            const isSelected = (selectedVariant?.id || selectedVariant?._id) === (v.id || v._id);
                            const outOfStock = (v.stock || 0) <= 0;
                            return (
                                <button
                                    key={v.id || v._id}
                                    className={`size-item ${isSelected ? 'active' : ''} ${outOfStock ? 'disabled' : ''}`}
                                    disabled={outOfStock}
                                    onClick={() => setSelectedVariant(v)}
                                >
                                    {v.size}
                                    <div className="color-label" style={{ fontSize: '10px', color: '#757575' }}>
                                        {v.color}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="pdp-actions">
                    <button className="add-to-cart-button" onClick={handleAddToCart}>
                        Add to Bag
                    </button>
                </div>

                <div className="pdp-description">
                    <p>{product.description}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;