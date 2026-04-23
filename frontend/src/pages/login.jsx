import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Dùng Link thay vì thẻ <a>

/**
 * FILE LOGIN ĐÃ SỬA:
 * 1. Cập nhật các đường dẫn Register và Forgot Password có /auth/
 * 2. Sử dụng <Link> để trang không bị load lại (F5).
 * 3. Giữ nguyên logic xử lý đăng nhập với Backend.
 */

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Đảm bảo Backend của bạn đang chạy ở cổng 8080
            const response = await axios.post("http://localhost:8080/api/auth/login", {
                username: username,
                password: password
            });

            const data = response.data;

            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.username);
                localStorage.setItem("role", data.roles);

                // Chuyển về trang chủ sau khi đăng nhập thành công
                setTimeout(() => {
                    navigate('/'); 
                }, 500);
            }
        } catch (err) {
            setError('Username or password is incorrect!');
            console.error(err);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleLogin} style={styles.card}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>LOGIN</h2>

                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                <div style={styles.inputGroup}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>

                {/* Dùng Link để khớp với App.js đã sửa */}
                <p style={{ fontSize: '14px' }}>
                    Don't have an account? <Link to="/auth/register" style={styles.link}>Register</Link>
                </p>
                <p style={{ fontSize: '14px' }}>
                    <Link to="/auth/forgot-password" style={styles.link}>Forgot password?</Link>
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <button type="submit" style={styles.button}>Login</button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', // Căn giữa theo chiều dọc cho đẹp
        height: '80vh',
    },
    card: {
        padding: '40px',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' // Thêm chút bóng đổ cho chuyên nghiệp
    },
    inputGroup: {
        marginBottom: '15px'
    },
    input: {
        width: '100%',
        padding: '12px',
        marginTop: '5px',
        borderRadius: '25px', // Bo tròn hơn một chút
        border: '1px solid #ddd',
        boxSizing: 'border-box',
        outline: 'none'
    },
    button: {
        width: '50%', // Tăng độ rộng nút bấm cho dễ click
        padding: '12px',
        backgroundColor: '#000000',
        color: '#fff',
        border: 'none',
        borderRadius: '30px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background 0.3s'
    },
    link: {
        color: '#000',
        fontWeight: 'bold',
        textDecoration: 'none'
    }
};

export default Login;