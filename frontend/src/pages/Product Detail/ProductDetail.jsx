import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';

const ProductDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [loading, setLoading] = useState(true);

    const username = localStorage.getItem("username");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 1. Lấy thông tin sản phẩm từ slug
                const productRes = await axios.get(`http://localhost:8080/api/products/slug/${slug}`);
                const productData = productRes.data;
                setProduct(productData);

                // Kiểm tra ID: Ưu tiên lấy productId (từ Java) hoặc _id (từ MongoDB)
                const pId = productData.productId || productData.id || productData._id;
                console.log("ID dùng để gọi API Variant:", pId);

                if (pId) {
                    // 2. Lấy danh sách variants theo productId
                    const variantsRes = await axios.get(`http://localhost:8080/api/variants/product/${pId}`);
                    console.log("Dữ liệu Variants nhận được:", variantsRes.data);

                    const data = Array.isArray(variantsRes.data) ? variantsRes.data : [];

                    // Sắp xếp size tăng dần
                    const sortedVariants = data.sort((a, b) => {
                        return parseFloat(a.size) - parseFloat(b.size);
                    });

                    setVariants(sortedVariants);
                }
            } catch (error) {
                console.error("Lỗi khi fetch dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    const handleAddToCart = async () => {
        if (!username) {
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
                    username: username,
                    variantId: selectedVariant.id || selectedVariant._id,
                    quantity: 1
                }
            });
            alert("Successfully added to cart!");
        } catch (error) {
            alert("Failed to add to cart. Please try again.");
        }
    };

    if (loading) return <div className="loading">Loading product...</div>;
    if (!product) return <div className="error">Product not found.</div>;

    return (
        <div className="pdp-container">
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
                    <div className="selection-header">
                        <h3>Select Size</h3>
                    </div>

                    <div className="size-grid">
                        {variants.length > 0 ? (
                            variants.map((v) => {
                                const isSelected = (selectedVariant?.id || selectedVariant?._id) === (v.id || v._id);
                                const outOfStock = (v.stock || 0) <= 0;

                                return (
                                    <button
                                        key={v.id || v._id}
                                        className={`size-item ${isSelected ? 'active' : ''} ${outOfStock ? 'disabled' : ''}`}
                                        disabled={outOfStock}
                                        onClick={() => setSelectedVariant(v)}
                                    >
                                        <span className="size-number">{v.size}</span>
                                        {v.color && <span className="pdp-variant-color">{v.color}</span>}
                                    </button>
                                );
                            })
                        ) : (
                            <p className="no-size-msg">This product is currently out of stock or size information is not available.</p>
                        )}
                    </div>
                </div>

                <div className="pdp-actions">
                    <button className="add-to-cart-btn" onClick={handleAddToCart}>
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