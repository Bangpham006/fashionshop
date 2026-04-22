import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom'; // 1. BẮT BUỘC phải có dòng này để chuyển trang
import { FiSearch, FiHeart, FiShoppingBag } from 'react-icons/fi'; 

const Navbar = () => {
  return (
    <header className="nav-header">
      {/* Tầng 1: Sub-nav */}
      <div className="sub-navbar">
        <div className="sub-nav-container">
          <div className="sub-logo">
            {/* Click vào logo phụ để về trang chủ */}
            <Link to="/">
                <img src="https://upload.wikimedia.org/wikipedia/en/3/37/Jumpman_logo.svg" alt="sub-logo" style={{height: '20px'}} />
            </Link>
          </div>
          <ul className="sub-nav-links">
            <li>Find a Store</li>
            <li>Help</li>
            {/* 2. CHỖ QUAN TRỌNG NHẤT: Thẻ Link dẫn đến trang Login */}
            <li>
              <Link to="/login" className="nav-link-item">Sign In</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Tầng 2: Main-nav */}
      <div className="main-navbar">
        <div className="main-nav-container">
          <div className="main-logo">
            {/* Click vào logo chính để về trang chủ */}
            <Link to="/">
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" alt="Fashion Shop" style={{height: '30px'}} />
            </Link>
          </div>

          <nav className="nav-menu">
            <ul>
              <li>New & Featured</li>
              <li>Men</li>
              <li>Women</li>
            </ul>
          </nav>

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