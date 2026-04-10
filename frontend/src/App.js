import React, { useEffect, useState } from 'react';
import api from './api/axiosConfig';

function App() {
  // Khởi tạo là một mảng rỗng để không bị văng App khi chưa có dữ liệu
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API lấy sản phẩm (Mặc định page=0, size=10 như Backend quy định)
    api.get('/products') 
      .then(res => {
        // VÌ BACKEND TRẢ VỀ Page<Product> NÊN DỮ LIỆU NẰM TRONG .content
        console.log("Dữ liệu từ Backend:", res.data);
        if (res.data && res.data.content) {
          setProducts(res.data.content); 
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi kết nối Backend:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Đang tải sản phẩm...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2c3e50', textAlign: 'center' }}>IWS FASHION SHOP</h1>
      <hr />
      
      {products.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Không có sản phẩm nào để hiển thị.</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '20px',
          marginTop: '20px' 
        }}>
          {products.map(p => (
            <div key={p.id} style={{ 
              border: '1px solid #ddd', 
              padding: '15px', 
              borderRadius: '10px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              {/* Hiển thị ảnh đầu tiên nếu có */}
              <img 
                src={p.images && p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/200'} 
                alt={p.name} 
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }}
              />
              <h3 style={{ fontSize: '18px', margin: '10px 0' }}>{p.name}</h3>
              <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Thương hiệu: {p.brand}</p>
              <p style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '16px' }}>
                Giá: {p.basePrice?.toLocaleString()} VNĐ
              </p>
              <button style={{ 
                width: '100%', 
                padding: '10px', 
                backgroundColor: '#3498db', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                cursor: 'pointer'
              }}>
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;