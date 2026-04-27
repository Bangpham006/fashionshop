import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/home';
import CategoryPage from './components/Navbar/CategoryPage';
import CheckoutPage from './components/Navbar/CheckoutPage';
import ProductDetailPage from './components/Navbar/ProductDetailPage';
import SearchPage from './pages/SearchPage'; // 1. Import trang SearchPage mới tạo
import Login from './pages/login';
import Register from './pages/register';
import ForgotPassword from './pages/forgotPassword';
import RevenueOverview from './pages/admin/revenue-overview';
import IsAdmin from './components/isAdmin';
import Footer from './components/Footer/Footer'; 

/**

 * Thêm Route /search để hiển thị kết quả khi tìm kiếm từ Navbar.
 */

function App() {
  return (
    <Router 
      future={{ 
        v7_startTransition: true, 
        v7_relativeSplatPath: true 
      }}
    >
      <Navbar /> 
      
      <div className="content-container">
        <Routes>
          {/* Trang công khai */}
          <Route path="/" element={<Home />} />
          
          {/* Route cho trang Tìm kiếm */}
          <Route path="/search" element={<SearchPage />} /> {/* 2. Thêm Route này */}
          
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />

          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />

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
      <Footer /> 
    </Router>
  );
}

export default App;