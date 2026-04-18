import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';

function App() {
  return (
    <Router>
      {/* Khu vực hiển thị nội dung các trang */}
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Báo lỗi 404 khi vào link lạ */}
        <Route path="*" element={<h2 style={{ textAlign: 'center' }}>404 - Không tìm thấy trang</h2>} />
      </Routes>
    </Router>
  );
}

export default App;