import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import './CategoryPage.css';

const CategoryPage = () => {
    const { slug } = useParams(); // Lấy 'shoes' hoặc 'clothes' từ URL
    const [searchParams] = useSearchParams();
    const gender = searchParams.get('gender'); // Lấy 'Men' hoặc 'Women'
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // 1. Tìm thông tin category từ slug để lấy ID (ví dụ: lấy ID của 'Shoes')
                const catRes = await axios.get(`http://localhost:8080/api/categories/slug/${slug}`);
                const categoryId = catRes.data.id || catRes.data._id;
                setCategoryName(catRes.data.name);

                // 2. Gọi API filter sản phẩm (Khớp với ProductServiceImpl của bạn)
                const prodRes = await axios.get('http://localhost:8080/api/products/filter', {
                    params: {
                        categoryId: categoryId,
                        gender: gender,
                        page: 0,
                        size: 20,
                        sortBy: 'createdAt',
                        sortDir: 'desc'
                    }
                });
                setProducts(prodRes.data.content);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [slug, gender]);

    if (loading) return <div className="loading">Đang tải sản phẩm...</div>;

    return (
        <div className="category-page">
            <header className="category-header">
                <h1>{gender ? `${gender}'s ${categoryName}` : categoryName}</h1>
                <p className="product-count">{products.length} Sản phẩm</p>
            </header>

            <div className="product-grid">
                {products.length > 0 ? (
                    products.map(product => (
                        <Link to={`/product/${product.slug}`} key={product._id || product.id} className="product-card">
                            <div className="product-image">
                                <img src={product.images[0] || 'https://via.placeholder.com/300'} alt={product.name} />
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-category">{product.gender} {categoryName}</p>
                                <p className="product-price">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.basePrice)}
                                </p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="no-products">Không tìm thấy sản phẩm nào trong mục này.</p>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;