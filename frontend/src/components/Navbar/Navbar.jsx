import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Navbar.css';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ChevronDown, ShoppingBag, LogOut, ChartCandlestick, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // 1. Thêm State để lưu từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // 2. Hàm xử lý khi người dùng nhấn Enter ở ô Search
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== "") {
      // Điều hướng sang trang search kèm tham số keyword (khớp với Backend của bạn)
      navigate(`/search?keyword=${searchTerm}`);
      setSearchTerm(""); // Xóa nội dung ô nhập sau khi tìm kiếm
    }
  };

  const parentCategories = categories.filter(cat => cat.level === 1);
  const username = localStorage.getItem("username");
  const userRole = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="logo-square">W</div>
          <span className="brand-name">FASHIONSHOP</span>
        </div>

        <div className="nav-links">
          <Link to="/" className="nav-link">New & Featured</Link>

          {parentCategories.map(parent => {
            const subCategories = categories.filter(child => child.parentId === parent.id);
            return (
              <div key={parent.id} className="nav-item">
                <Link to={`/category/${parent.slug}`} className="nav-link">
                  {parent.name}
                </Link>
                {subCategories.length > 0 && (
                  <ul className="category-dropdown">
                    {subCategories.map(child => (
                      <li key={child.id}>
                        <Link to={`/category/${child.slug}?gender=${parent.name}`} className="dropdown-link">
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        <div className="nav-utils">
          {/* 3. Cập nhật ô Search Bar */}
          <div className="search-bar">
            <Search size={20} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật khi gõ chữ
              onKeyDown={handleSearch} // Lắng nghe phím Enter
            />
          </div>

          {username ? (
            <div className="user-section">
              <div className="avatar"></div>
              <span className="user-name">Hi, {username}</span>
              <div className="dropdown-container">
                <button
                  className={`dropdown-button ${isAccountDropdownOpen ? 'active' : ''}`}
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                >
                  <ChevronDown size={16} color='black' />
                </button>

                {isAccountDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-item" onClick={() => { navigate('/cart'); setIsAccountDropdownOpen(false); }}>
                      <ShoppingBag size={16} />
                      <span>View cart</span>
                    </div>

                    {userRole === "ROLE_ADMIN" && (
                      <div className="dropdown-item" onClick={() => { navigate('/admin/product-management'); setIsAccountDropdownOpen(false); }}>
                        <LayoutDashboard size={16} />
                        <span>Product Management</span>
                      </div>
                    )}

                    {userRole === "ROLE_ADMIN" && (
                      <div className="dropdown-item" onClick={() => { navigate('/admin/revenue-overview'); setIsAccountDropdownOpen(false); }}>
                        <ChartCandlestick size={16} />
                        <span>Revenue Overview</span>
                      </div>
                    )}

                    <div className="dropdown-item logout" onClick={handleLogout}>
                      <LogOut size={16} />
                      <span>Sign out</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="user-section">
              <button className="login-button" onClick={() => navigate('/auth/login')}>
                Log in
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;