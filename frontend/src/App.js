import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Home from './pages/home';
import Category from './pages/Category/Category';
import Checkout from './pages/checkout';
import ProductDetail from './pages/Product Detail/ProductDetail';
import Login from './pages/login';
import Register from './pages/register';
import ForgotPassword from './pages/forgot-password';
import RevenueOverview from './pages/admin/Revenue Overview/revenue-overview';
import ProductManagement from './pages/admin/Product Management/Product-management';
import SearchResult from './pages/Search Result/Search-result';
import Cart from './pages/Cart/Cart';

import Navbar from './components/Navbar/Navbar';
import IsLogin from './components/isLogin';
import IsAdmin from './components/isAdmin';
import Footer from './components/Footer/Footer';

const NavbarWrapper = () => {
  const location = useLocation();

  const isAuthPage = location.pathname.startsWith('/auth');
  return (
    <>
      {!isAuthPage && <Navbar />}
    </>
  );
};

const FooterWrapper = () => {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/auth');
  return (
    <>
      {!isAuthPage && <Footer />}
    </>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <ScrollToTop />
      <NavbarWrapper />

      <div className="content-container">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />

          <Route path="/search" element={<SearchResult />} />

          <Route path="/category/:slug" element={<Category />} />
          <Route path="/product/:slug" element={<ProductDetail />} />

          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />

          {/* Login required routes */}
          <Route
            path="/cart"
            element={
              <IsLogin>
                <Cart />
              </IsLogin>
            }
          />

          <Route
            path="/checkout"
            element={
              <IsLogin>
                <Checkout />
              </IsLogin>
            }
          />

          {/* Admin only routes */}
          <Route
            path="/admin/revenue-overview"
            element={
              <IsAdmin>
                <RevenueOverview />
              </IsAdmin>
            }
          />

          <Route
            path="/admin/product-management"
            element={
              <IsAdmin>
                <ProductManagement />
              </IsAdmin>
            }
          />

          {/* Error Routes */}
          <Route path="*" element={<h2 style={{ textAlign: 'center', marginTop: '50px' }}>404 - Page Not Found</h2>} />


        </Routes>
      </div>

      <FooterWrapper />
    </Router>
  );
}

export default App;