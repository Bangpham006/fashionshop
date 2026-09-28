import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Navbar.css';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ChevronDown, ShoppingBag, LogOut, LayoutDashboard, Menu, X, ChartCandlestick } from 'lucide-react';

const Navbar = () => {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://fashionshop-e972.onrender.com/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    if (e.key && e.key !== 'Enter') return;
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const parentCategories = categories.filter(cat => cat.level === 1);

  return (
    <nav className="nav">
      <div className="nav-container">
        <button className="mobile-menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="nav-logo" onClick={() => { navigate('/'); setIsMenuOpen(false); }}>
          <div className="logo-square">F</div>
          <span className="brand-name">FASHIONSHOP</span>
        </div>

        {/* THÊM CLASS ACTIVE Ở ĐÂY */}
        <div className={`tab ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            New & Featured
          </Link>

          {parentCategories.map(parent => (
            <div key={parent.id} className="nav-item">
              <span className="nav-link">{parent.name}</span>
              <ul className="category-dropdown">
                {categories
                  .filter(child => child.parentId === parent.id)
                  .map(child => (
                    <li key={child.id}>
                      <Link
                        to={`/category/${child.slug}?gender=${parent.name}`}
                        className="dropdown-link"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
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
                  <ChevronDown size={16} />
                </button>

                {isAccountDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-item" onClick={() => { navigate('/cart'); setIsAccountDropdownOpen(false); }}>
                      <ShoppingBag size={16} /> <span>View cart</span>
                    </div>
                    {userRole === "ROLE_ADMIN" && (
                      <>
                        <div className="dropdown-item" onClick={() => { navigate('/admin/product-management'); setIsAccountDropdownOpen(false); }}>
                          <LayoutDashboard size={16} /> <span>Products Managment</span>
                        </div>
                        <div className="dropdown-item" onClick={() => { navigate('/admin/revenue-overview'); setIsAccountDropdownOpen(false); }}>
                          <ChartCandlestick size={16} /> <span>Revenue Overview</span>
                        </div>
                      </>
                    )}
                    <div className="dropdown-item logout" onClick={handleLogout}>
                      <LogOut size={16} /> <span>Sign out</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button className="login-button" onClick={() => navigate('/auth/login')}>Log in</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;