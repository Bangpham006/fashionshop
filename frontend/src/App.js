import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Navbar from './components/Layout/Navbar'; 

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/products/filter') 
      .then(res => {
        if (res.data && res.data.content) {
          setProducts(res.data.content);
        } else {
          setProducts(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        setError("Không thể kết nối tới Backend. Hãy check MongoDB và Server!");
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      {/* BƯỚC 2: Đặt Navbar ở ngay đầu tiên, ngoài shop-container */}
      <Navbar />

      <div className="shop-container">
        {/* Bạn có thể xóa bớt header cũ của App nếu muốn giao diện giống Nike hơn */}
        <header className="shop-header">
           <p>Đang hiển thị sản phẩm từ database</p>
        </header>

        {loading ? (
          <div className="status-center">Đang tải sản phẩm...</div>
        ) : error ? (
          <div className="status-center" style={{color: 'red'}}>{error}</div>
        ) : products.length === 0 ? (
          <div className="status-center">Database trống hoặc chưa lấy được dữ liệu.</div>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <div key={p.id || p._id} className="product-card">
                <div className="image-wrapper">
                  <img 
                    src={p.image || 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-shoes-WrQQ17.png'} 
                    alt={p.name} 
                    className="product-image"
                  />
                </div>
                <div className="product-info">
                  <span className="product-category">{p.categoryName || 'Sản phẩm mới'}</span>
                  <h3 className="product-name">{p.name}</h3>
                  <p className="product-gender">{p.gender}</p>
                  <p className="product-price">
                    {p.basePrice?.toLocaleString('vi-VN')} ₫
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;