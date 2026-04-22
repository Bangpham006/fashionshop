import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';

function App() {
  return (
    <Router>
      {/* Navbar nằm ngoài Routes để luôn hiển thị ở mọi trang */}
      <Navbar /> 
      
      <div className="content-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Trang lỗi 404 */}
          <Route path="*" element={<h2 style={{ textAlign: 'center', marginTop: '50px' }}>404 - Không tìm thấy trang</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;