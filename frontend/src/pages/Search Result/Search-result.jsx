import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingCircles from '../../components/Loading-circles';
import './Search-result.css';

const SearchResult = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return;
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/products/search`, {
                    params: {
                        keyword: query,
                        page: 0,
                        size: 20
                    }
                });

                if (response.data && response.data.content) {
                    setProducts(response.data.content);
                }
            } catch (error) {
                console.error("Error searching products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    if (loading) {
        return <LoadingCircles />;
    }

    return (
        <div className="page">
            <header className="header">
                <h1>Search Result For: "{query}"</h1>
                <p className="product-count">{products.length} Product</p>
            </header>

            <div className="product-grid">
                {products.length > 0 ? (
                    products.map(product => (
                        <Link to={`/product/${product.slug}`} key={product.id || product._id} className="product-card">
                            <div className="product-image">
                                <img
                                    src={product.images && product.images.length > 0
                                        ? product.images[0]
                                        : 'https://via.placeholder.com/300'}
                                    alt={product.name}
                                />
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-category">{product.gender} {product.categoryName || 'Fashionshop'}</p>
                                <p className="product-price">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.basePrice)}
                                </p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="no-products">Không tìm thấy sản phẩm nào khớp với từ khóa!</p>
                )}
            </div>
        </div>
    );
};

export default SearchResult;