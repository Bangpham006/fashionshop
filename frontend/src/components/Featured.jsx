import React from 'react';
import './Featured.css';

import img1 from '../image/lifestyle.jpg';
import img2 from '../image/sport.jpg';
// import img3 from '../image/lifestyle1.jpg';

const Featured = () => {
  const featuredProducts = [
    { id: 1, name: "Premium Cotton Tee", price: "350.000", image: img1 },
    { id: 2, name: "Urban Sport Short", price: "420.000", image: img2 },
    { id: 3, name: "Classic Street Cap", price: "280.000", image: img1 },
    { id: 4, name: "Running Essential", price: "850.000", image: img2 },
    { id: 5, name: "Summer Lifestyle", price: "390.000", image: img1 },
    { id: 6, name: "Sport Accessories", price: "150.000", image: img1 },
  ];

  return (
    <section className="featured-section">
      <div className="container">
        <div className="featured-header">
          <h2 className="featured-title">Sản Phẩm Nổi Bật</h2>
          <button className="view-all-btn">Xem tất cả</button>
        </div>

        <div className="featured-scroll-wrapper">
          {featuredProducts.map((product) => (
            <div key={product.id} className="featured-card">
              <div className="card-img">
                <img src={product.image} alt={product.name} />
                <div className="card-tag">Hot</div>
              </div>
              <div className="card-info">
                <h4 className="product-name">{product.name}</h4>
                <p className="product-price">{product.price} ₫</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Featured;