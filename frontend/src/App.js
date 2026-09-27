import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Home from './pages/Home/Home';
import Category from './pages/Category/Category';
import Checkout from './pages/Checkout/Checkout';
import ProductDetail from './pages/Product Detail/ProductDetail';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/Forgot Password/ForgotPassword';
import RevenueOverview from './pages/Admin Pages/Revenue Overview/revenueOverview';
import ProductManagement from './pages/Admin Pages/Product Management/ProductManagement';
import SearchResult from './pages/Search Result/SearchResult';
import Cart from './pages/Cart/Cart';
import PaymentSuccess from './pages/Payment Success/PaymentSuccess';

import Navbar from './components/Navbar/Navbar';
import IsLogin from './components/isLogin';
import IsAdmin from './components/isAdmin';
import Footer from './components/Footer/Footer';
import Chatbot from './components/Chatbot/Chatbot';

const NavbarWrapper = () => {
  const location = useLocation();
  const isPaymentSuccessPage = location.pathname === '/payment-success';
  const isAuthPage = location.pathname.startsWith('/auth');
  return (
    <>
      {!isAuthPage && !isPaymentSuccessPage && <Navbar />}
    </>
  );
};

const FooterWrapper = () => {
  const location = useLocation();
  const isPaymentSuccessPage = location.pathname === '/payment-success';
  const isAuthPage = location.pathname.startsWith('/auth');
  return (
    <>
      {!isAuthPage && !isPaymentSuccessPage && <Footer />}
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

          <Route path="/payment-success" element={<PaymentSuccess />} />

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
      <Chatbot />
    </Router>
  );
}

export default App;