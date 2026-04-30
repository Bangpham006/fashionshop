import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Navbar.css';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));

    // Xử lý reset state khi resize màn hình từ Mobile sang Desktop
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
        setOpenMenu(null);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const parentCategories = categories.filter(c => c.level === 1);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setIsMenuOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className="nav">
      <div className="nav-container">

        {/* MOBILE BUTTON */}
        <button className="mobile-menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
        </button>

        {/* LOGO */}
        <div className="nav-logo" onClick={() => navigate('/')}>
          <div className="logo-square">W</div>
          <span className="brand-name">FASHIONSHOP</span>
        </div>

        {/* MENU */}
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>

          <Link to="/" className="nav-link">New & Featured</Link>

          {parentCategories.map(parent => {
            const children = categories.filter(c => c.parentId === parent.id);

            return (
              <div key={parent.id} className="nav-item">

                <div
                  className="nav-link"
                  onClick={() => {
                    if (window.innerWidth <= 768) {
                      setOpenMenu(openMenu === parent.id ? null : parent.id);
                    }
                  }}
                >
                  {parent.name}
                </div>

                {children.length > 0 && (
                  <ul className={`category-dropdown ${openMenu === parent.id ? 'show' : ''}`}>
                    {children.map(child => (
                      <li key={child.id}>
                        <Link
                          to={`/category/${child.slug}`}
                          className="dropdown-link"
                          onClick={() => setIsMenuOpen(false)}
                        >
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

        {/* RIGHT */}
        <div className="nav-utils">
          <div className="search-bar">
            <Search size={18}/>
            <input
              placeholder="Search"
              value={searchQuery}
              onChange={(e)=>setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <div className="user-section">
            <div className="avatar"></div>
            <span className="user-name">Hi</span>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;