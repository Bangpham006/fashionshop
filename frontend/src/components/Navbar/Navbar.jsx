import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Navbar.css';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ChevronDown, ShoppingBag, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);

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

  const parentCategories = categories.filter(cat => cat.level === 1);

  // 1. Thêm state để lưu từ khóa tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");

  // 2. Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    // Nếu là sự kiện bàn phím và không phải phím Enter thì bỏ qua
    if (e.key && e.key !== 'Enter') return;

    if (searchQuery.trim()) {
      // Chuyển hướng sang trang search với query parameter
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);

      // Nếu đang ở mobile menu thì đóng menu sau khi search
      setIsMenuOpen(false);
    }

    setSearchQuery("")
  };

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

        <div className="nav-links">
          <Link to="/" className="nav-link">New & Featured</Link>

          {parentCategories.map(parent => {
            // Lọc các danh mục con (Shoes, Clothes) cho từng Men/Women
            const subCategories = categories.filter(child => child.parentId === parent.id);

            return (
              <div key={parent.id} className="nav-item">
                <span className="nav-link">
                  {parent.name}
                </span>

                {subCategories.length > 0 && (
                  <ul className="category-dropdown">
                    {subCategories.map(child => (
                      <li key={child.id}>
                        <Link to={`/category/${child.slug}?gender=${parent.name}`} className="dropdown-link">
                          {child.name} {/* Ví dụ: Shoes, Clothes */}
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
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
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