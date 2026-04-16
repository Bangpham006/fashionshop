import React from 'react';
import './Navbar.css';
// Nếu bạn dùng react-icons thì import ở đây, còn không thì dùng ảnh/SVG
import { FiSearch, FiHeart, FiShoppingBag } from 'react-icons/fi'; 

const Navbar = () => {
  return (
    <header className="nav-header">
      {/* Tầng 1: Sub-nav (Thanh phụ phía trên) */}
      <div className="sub-navbar">
        <div className="sub-nav-container">
          <div className="sub-logo">
            {/* THAY LOGO PHỤ CỦA BẠN Ở ĐÂY */}
            <img src="link_logo_phu_cua_ban.png" alt="sub-logo" />
          </div>
          <ul className="sub-nav-links">
            <li>Find a Store</li>
            <li>Help</li>
            <li>Sign In</li>
          </ul>
        </div>
      </div>

      {/* Tầng 2: Main-nav (Thanh chính) */}
      <div className="main-navbar">
        <div className="main-nav-container">
          {/* LOGO CHÍNH */}
          <div className="main-logo">
            <img src="link_logo_chinh_cua_ban.png" alt="Fashion Shop" />
          </div>

          {/* MENU CHÍNH */}
          <nav className="nav-menu">
            <ul>
              <li>New & Featured</li>
              <li>Men</li>
              <li>Women</li>
            </ul>
          </nav>

          {/* ICON & SEARCH */}
          <div className="nav-right">
            <div className="search-wrapper">
              <button className="search-btn"><FiSearch /></button>
              <input type="text" placeholder="Search" />
            </div>
            <div className="nav-icons">
              <button title="Wishlist"><FiHeart /></button>
              <button title="Cart"><FiShoppingBag /></button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;