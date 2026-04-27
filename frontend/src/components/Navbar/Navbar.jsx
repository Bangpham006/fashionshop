import React, { useState } from 'react';
import './Navbar.css';
import { useNavigate, Link } from 'react-router-dom';
// Thêm icon Menu và X (đóng)
import { Search, ChevronDown, ShoppingBag, LogOut, ChartCandlestick, LayoutDashboard, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State cho Mobile Menu

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
        {/* Nút Burger - Chỉ hiện trên Mobile */}
        <button className="mobile-menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="nav-logo" onClick={() => { navigate('/'); setIsMenuOpen(false); }} style={{ cursor: 'pointer' }}>
          <div className="logo-square">W</div>
          <span className="brand-name">FASHIONSHOP</span>
        </div>

        {/* Thêm class active khi menu mở */}
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>New & Featured</Link>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Men</Link>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Women</Link>
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
                onClick={() => navigate('/auth/login')}
              >Log in</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;