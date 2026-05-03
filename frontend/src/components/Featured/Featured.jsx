import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingCircles from '../LoadingCircles';
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
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;

      const scrollTo = direction === 'left'
        ? scrollLeft - clientWidth * 0.8
        : scrollLeft + clientWidth * 0.8;

      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  if (loading) return <LoadingCircles />;

  return (
    <section className="featured-section">
      <div className="container">
        <div className="featured-header">
          <h2 className="featured-title">Trending</h2>
        </div>

        <div className="featured-relative-container">

          <button
            className="scroll-button prev-button"
            onClick={() => handleScroll('left')}
            aria-label="Previous"
          >
            ❮
          </button>

          <div className="featured-scroll-wrapper" ref={scrollRef}>
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div key={product.productId} className="featured-card">
                  <Link to={`/product/${product.slug}`}>
                    <div className="card-img">
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/300x400'}
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
                    <Link to={`/product/${product.slug}`} className="shop-now-button">
                      Shop Now
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-msg">No featured products available.</p>
            )}
          </div>

          <button
            className="scroll-button next-button"
            onClick={() => handleScroll('right')}
            aria-label="Next"
          >
            ❯
          </button>
        </div>
      </div>
    </section>
  );
};

export default Featured;