import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import ForgotPassword from './pages/forgotPassword';
import RevenueOverview from './pages/admin/revenue-overview';

import IsAdmin from './components/isAdmin';

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang công khai */}
        <Route path="/" element={<Home />} />
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

        {/* Báo lỗi 404 khi vào link lạ */}
        <Route path="*" element={<h2 style={{ textAlign: 'center' }}>404 - Không tìm thấy trang</h2>} />
      </Routes>
    </Router>
  );
}

export default App;