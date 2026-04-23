import React, { useState } from 'react';
import './Navbar.css';
import { useNavigate, Link } from 'react-router-dom'; // Thêm Link vào đây
import { Search, ChevronDown, ShoppingBag, LogOut, ChartCandlestick, LayoutDashboard } from 'lucide-react';

/**
 * FILE NAVBAR ĐÃ SỬA:
 * 1. Chuyển các thẻ <a> sang <Link> để tránh load lại trang.
 * 2. Đảm bảo navigate('/auth/login') khớp chính xác với App.js.
 */

const Navbar = () => {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const username = localStorage.getItem("username");
  const userRole = localStorage.getItem("role");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        {/* Logo click về trang chủ */}
        <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="logo-square">W</div>
          <span className="brand-name">FASHIONSHOP</span>
        </div>

        {/* Chuyển <a> thành <Link> */}
        <div className="nav-links">
          <Link to="/">New & Featured</Link>
          <Link to="/">Men</Link>
          <Link to="/">Women</Link>
        </div>

        <div className="nav-utils">
          <div className="search-bar">
            <Search size={20} />
            <input type="text" placeholder="Search" />
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
              <button
                className="login-button"
                onClick={() => navigate('/auth/login')} // Đã khớp với App.js
              >
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