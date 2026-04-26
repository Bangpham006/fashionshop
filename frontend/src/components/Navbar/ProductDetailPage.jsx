import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [loading, setLoading] = useState(true);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Lấy product
                const productRes = await axios.get(`http://localhost:8080/api/products/slug/${slug}`);
                const productData = productRes.data;

                setProduct(productData);

                // Lấy ID sản phẩm để tìm Variants
                const productId = productData.productId || productData.id || productData._id;
                
                if (productId) {
                    // 2. Lấy variants
                    const variantsRes = await axios.get(`http://localhost:8080/api/variants/product/${productId}`);
                    
                    // Debug dữ liệu thô nếu vẫn chưa hiện
                    if (variantsRes.data.length === 0) {
                        console.warn("API trả về mảng rỗng cho Product ID:", productId);
                    }

                    // Sắp xếp size (Xử lý an toàn cho cả chuỗi và số)
                    const data = Array.isArray(variantsRes.data) ? variantsRes.data : [];
                    
                    const sortedVariants = data.sort((a, b) => {
                        const sizeA = parseFloat(a.size || 0);
                        const sizeB = parseFloat(b.size || 0);

                        if (!isNaN(sizeA) && !isNaN(sizeB)) {
                            return sizeA - sizeB;
                        }
                        return String(a.size || "").localeCompare(String(b.size || ""));
                    });

                    setVariants(sortedVariants);
                } else {
                    console.error("Không thể xác định ID của sản phẩm để tải Size.");
                }
            } catch (error) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    const handleAddToCart = async () => {
        if (!userId) {
            alert("Vui lòng đăng nhập để mua hàng");
            navigate('/auth/login');
            return;
        }

        if (!selectedVariant) {
            alert("Vui lòng chọn kích cỡ");
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

            alert("Đã thêm vào giỏ hàng thành công!");

        } catch (error) {
            console.error(error);
            alert("Lỗi khi thêm vào giỏ hàng");
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!product) return <div className="error">Product not found.</div>;

    return (
        <div className="pdp-container">
            {/* LEFT */}
            <div className="pdp-left">
                <img
                    src={product.images?.[0] || 'https://via.placeholder.com/600'}
                    alt={product.name}
                />
            </div>

            {/* RIGHT */}
            <div className="pdp-right">
                <div className="pdp-info">
                    <h1 className="pdp-name">{product.name}</h1>

                    <p className="pdp-category">
                        {product.gender}'s {product.type || "Product"}
                    </p>

                    <p className="pdp-price">
                        {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        }).format(
                            selectedVariant?.price || product.basePrice
                        )}
                    </p>
                </div>

                {/* SIZE */}
                <div className="pdp-selection">
                    <div className="selection-header">
                        <h3>Select Size</h3>
                    </div>

                    <div className="size-grid">
                        {variants.length > 0 ? (
                            variants.map((v) => {
                                // CẬP NHẬT: Khớp chính xác với trường 'stock' từ MongoDB của bạn
                                const stockValue = v.stock !== undefined ? v.stock : v.stockQuantity;
                                const isOutOfStock = (stockValue || 0) <= 0;
                                
                                const isActive =
                                    (selectedVariant?.id || selectedVariant?._id) === (v.id || v._id);

                                return (
                                    <button
                                        key={v.id || v._id}
                                        className={`size-item ${isActive ? 'active' : ''} ${isOutOfStock ? 'disabled' : ''}`}
                                        disabled={isOutOfStock}
                                        onClick={() => setSelectedVariant(v)}
                                    >
                                        <span className="size-number">{v.size}</span>
                                        {/* Hiển thị màu sắc từ trường 'color' trong MongoDB */}
                                        {v.color && <span className="pdp-variant-color">{v.color}</span>}
                                    </button>
                                );
                            })
                        ) : (
                            <p className="no-size">
                                This product currently has no sizes available.
                            </p>
                        )}
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="pdp-actions">
                    <button
                        className="add-to-cart-btn"
                        onClick={handleAddToCart}
                    >
                        Add to Bag
                    </button>

                    <button className="favorite-btn">
                        Favorite ♡
                    </button>
                </div>

                {/* DESCRIPTION */}
                <div className="pdp-description">
                    <p>{product.description}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;