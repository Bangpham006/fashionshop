import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingCircles from '../../components/Loading-circles';
import './Category.css';
import { ChevronDown } from 'lucide-react';

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

    // State cho sắp xếp
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDir, setSortDir] = useState('desc');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRef = useRef(null); // Ref để theo dõi vùng menu sort

    const pageSize = 8; // Số lượng sản phẩm mỗi trang

    const sortOptions = [
        { label: 'Newest', value: 'createdAt,desc' },
        { label: 'Price: Low - High', value: 'basePrice,asc' },
        { label: 'Price: High - Low', value: 'basePrice,desc' },
        { label: 'Name: A - Z', value: 'name,asc' },
    ];

    // Xử lý click ra ngoài để đóng menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                        sortBy: sortBy,
                        sortDir: sortDir
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
    }, [slug, gender, currentPage, sortBy, sortDir]); // Chạy lại khi đổi trang hoặc tiêu chí sort

    // Reset về trang đầu tiên khi người dùng đổi danh mục hoặc giới tính
    useEffect(() => {
        setCurrentPage(0);
    }, [slug, gender]);

    // Hàm xử lý khi thay đổi kiểu sắp xếp
    const handleSortSelect = (value) => {
        const [field, direction] = value.split(',');
        setSortBy(field);
        setSortDir(direction);
        setCurrentPage(0); // Quay về trang 1
        setIsSortOpen(false);
    };

    if (loading) {
        return <LoadingCircles />;
    }

    return (
        <div className="category-page">
            <header className="category-header" style={styles.header}>
                <h1 style={styles.title}>{gender ? `${gender}'s ${categoryName}` : categoryName}</h1>
                <div className="category-controls" style={styles.controls}>
                    <span className="product-count" style={styles.count}>{totalProducts} Products</span>
                    <div className="sort-wrapper" ref={sortRef}>
                        <div className="sort-trigger" onClick={() => setIsSortOpen(!isSortOpen)}>
                            <span>Sort By</span>
                            <ChevronDown 
                                size={18} 
                                className={`chevron-icon ${isSortOpen ? 'rotate' : ''}`} 
                            />
                        </div>
                        
                        {isSortOpen && (
                            <div className="sort-dropdown">
                                {sortOptions.map((option) => (
                                    <div 
                                        key={option.value}
                                        className={`sort-item ${(`${sortBy},${sortDir}` === option.value) ? 'active' : ''}`}
                                        onClick={() => handleSortSelect(option.value)}
                                    >
                                        {option.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
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

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px 0',
        borderBottom: '1px solid #f0f0f0',
        flexWrap: 'wrap',
        gap: '15px'
    },
    title: {
        fontSize: 'calc(18px + 1vw)', // Kích thước chữ co giãn theo màn hình
        fontWeight: '700',
        margin: 0,
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '100%',
        gap: '15px'
    },
    count: {
        fontSize: '14px',
        color: '#757575',
        fontWeight: '500'
    }
};

export default Category;