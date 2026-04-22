import React, { useState } from 'react';
import './Navbar.css';

import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, ShoppingBag, LogOut, ChartCandlestick, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false); // Quản lý dropdown ở phần admin
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false); // Quản lý dropdown ở phần tài khoản

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
        <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="logo-square">W</div>
          <span className="brand-name">FASHIONSHOP</span>
        </div>

        <div className="nav-links">
          <a href="/">New & Featured</a>
          <a href="/">Men</a>
          <a href="/">Women</a>
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


                {/* ACCOUNT DROPDOWN SECTION */}

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
                onClick={() => {
                  setTimeout(() => {
                    navigate('/auth/login');
                  }, 500);
                }}
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