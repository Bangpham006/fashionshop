import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // QUAN TRỌNG: Thêm dòng này để điều hướng
import axios from 'axios';
import './Featured.css';

const Featured = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/products/featured');
        setFeaturedProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm nổi bật:", error);
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400; 
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return <div className="loading-text">Loading product...</div>;
  }

  return (
    <section className="featured-section">
      <div className="container">
        <div className="featured-header">
          <h2 className="featured-title">Trending</h2>
          <div className="featured-controls">
            <button className="scroll-btn" onClick={() => handleScroll('left')}>❮</button>
            <button className="scroll-btn" onClick={() => handleScroll('right')}>❯</button>
          </div>
        </div>

        <div className="featured-scroll-wrapper" ref={scrollRef}>
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <div key={product.productId} className="featured-card">
                {/* Click vào ảnh cũng dẫn đến trang chi tiết */}
                <Link to={`/product/${product.slug}`}>
                  <div className="card-img">
                    <img 
                      src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/300x400'} 
                      alt={product.name} 
                    />
                    <div className="card-tag">Hot</div>
                  </div>
                </Link>

                <div className="card-info">
                  <h4 className="product-name">{product.name}</h4>
                  <p className="product-subtext">{product.gender}'s {product.type}</p>
                  <p className="product-price">
                    {Number(product.basePrice).toLocaleString('vi-VN')} ₫
                  </p>
                  
                  {/* NÚT SHOP NOW MỚI */}
                  <Link to={`/product/${product.slug}`} className="shop-now-btn">
                    Shop Now
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-msg">Hiện chưa có sản phẩm nổi bật nào.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Featured;