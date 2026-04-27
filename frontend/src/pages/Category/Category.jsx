import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingCircles from '../../components/Loading-circles';
import './Category.css';

const Category = () => {
    const { slug } = useParams();
    const [searchParams] = useSearchParams();
    const gender = searchParams.get('gender');

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('');

    // --- CÁC STATE MỚI ĐỂ PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const pageSize = 8; // Số lượng sản phẩm mỗi trang

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // 1. Lấy Category ID từ slug
                const catRes = await axios.get(`http://localhost:8080/api/categories/slug/${slug}`);
                const categoryId = catRes.data.id || catRes.data._id;
                setCategoryName(catRes.data.name);

                // 2. Gọi API filter với tham số phân trang
                const prodRes = await axios.get('http://localhost:8080/api/products/filter', {
                    params: {
                        categoryId: categoryId,
                        gender: gender,
                        page: currentPage, // Trang hiện tại (bắt đầu từ 0)
                        size: pageSize,    // Số lượng 8
                        sortBy: 'createdAt',
                        sortDir: 'desc'
                    }
                });

                // Dữ liệu từ Page<Product> của Spring Boot nằm trong .content
                setProducts(prodRes.data.content);
                setTotalPages(prodRes.data.totalPages);
                setTotalProducts(prodRes.data.totalElements);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [slug, gender, currentPage]); // Chạy lại khi đổi trang

    // Reset về trang đầu tiên khi người dùng đổi danh mục hoặc giới tính
    useEffect(() => {
        setCurrentPage(0);
    }, [slug, gender]);

    if (loading) {
        return <LoadingCircles />;
    }

    return (
        <div className="category-page">
            <header className="category-header">
                <h1>{gender ? `${gender}'s ${categoryName}` : categoryName}</h1>
                <p className="product-count">{totalProducts} Products</p>
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
                    <p className="no-products">No products found!</p>
                )}
            </div>

            {/* --- BỘ NÚT PHÂN TRANG --- */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        className="pagi-btn"
                        disabled={currentPage === 0} 
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        Previous
                    </button>

                    <div className="page-numbers">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                className={`page-num ${currentPage === index ? 'active' : ''}`}
                                onClick={() => setCurrentPage(index)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <button 
                        className="pagi-btn"
                        disabled={currentPage === totalPages - 1} 
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Category;