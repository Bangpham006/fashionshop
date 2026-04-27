import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../components/Navbar/CategoryPage.css'; // Tái sử dụng CSS của trang Category

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    // Lấy giá trị 'keyword' từ thanh địa chỉ (?keyword=...)
    const query = searchParams.get('keyword');
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return;
            setLoading(true);
            try {
                // Gọi API search với tham số 'keyword' đúng như Backend của Bằng yêu cầu
                const res = await axios.get(`http://localhost:8080/api/products/search?keyword=${query}`);
                // Backend trả về dạng Page nên ta lấy .content
                setProducts(res.data.content || []);
            } catch (error) {
                console.error("Lỗi khi tìm kiếm sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    if (loading) return <div className="loading">Đang tìm kiếm sản phẩm cho "{query}"...</div>;

    return (
        <div className="category-page">
            <header className="category-header">
                <h1>Kết quả tìm kiếm cho: "{query}"</h1>
                <p className="product-count">{products.length} Sản phẩm được tìm thấy</p>
            </header>

            <div className="product-grid">
                {products.length > 0 ? (
                    products.map(product => (
                        <Link to={`/product/${product.slug}`} key={product.id || product._id} className="product-card">
                            <div className="product-image">
                                <img 
                                    src={(product.images && product.images.length > 0) 
                                        ? product.images[0] 
                                        : 'https://via.placeholder.com/300'} 
                                    alt={product.name} 
                                />
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-category">{product.brand}</p>
                                <p className="product-price">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.basePrice)}
                                </p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="no-results" style={{ textAlign: 'center', gridColumn: '1/-1', padding: '100px 0' }}>
                        <p>Rất tiếc, không tìm thấy sản phẩm nào khớp với từ khóa "{query}".</p>
                        <Link to="/" style={{ color: '#007bff', textDecoration: 'underline' }}>Quay lại mua sắm</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;