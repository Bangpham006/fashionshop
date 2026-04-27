import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';

import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import ForgotPassword from './pages/forgot-password';
import Checkout from './pages/checkout';
import RevenueOverview from './pages/admin/revenue-overview';

import IsAdmin from './components/isAdmin';
import Footer from './components/Footer/Footer';

const NavbarWrapper = () => {
  const location = useLocation();
  // Kiểm tra xem trang hiện tại có phải là Login hoặc Register không
  const isAuthPage = location.pathname.startsWith('/auth');
  return (
    <>
      {/* Chỉ hiện Navbar nếu KHÔNG phải trang Auth */}
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

function App() {
  return (
    <Router>
      <NavbarWrapper />

      <div className="content-container">
        <Routes>
          {/* Trang công khai */}
          <Route path="/" element={<Home />} />

          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />

          <Route path="/product/checkout" element={<Checkout />} />

          {/* Trang chỉ cho Admin */}
          <Route
            path="/admin/revenue-overview"
            element={
              <IsAdmin>
                <RevenueOverview />
              </IsAdmin>
            }
          />

          {/* Trang lỗi 404 */}
          <Route path="*" element={<h2 style={{ textAlign: 'center', marginTop: '50px' }}>404 - Không tìm thấy trang</h2>} />
        </Routes>
      </div>
      <FooterWrapper />
    </Router>
  );
}

export default App;