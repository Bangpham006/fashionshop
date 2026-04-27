import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Thêm Link vào đây

/**
 * FILE FORGOT PASSWORD ĐÃ SỬA:
 * 1. Dùng <Link> để chuyển về trang Register không bị load lại trang.
 * 2. Đồng bộ giao diện (style) với file Login cho đẹp.
 * 3. Chỉnh lại navigate về đúng route /auth/login sau khi đổi pass thành công.
 */

function ForgotPassword() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [errorColor, setErrorColor] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match!');
            setErrorColor('red');
            return;
        }

        try {
            // Đảm bảo API backend của bạn đúng cổng 8080
            await axios.post('http://localhost:8080/api/auth/forgot-password', {
                username,
                email,
                newPassword
            });

            setError('Password changed successfully! Redirecting to login...');
            setErrorColor('green');

            setTimeout(() => {
                window.location.href = '/auth/login'; // Phải khớp với route trong App.js
            }, 1000);
        } catch (error) {
            setError('Failed to change password. Please check your username and email.');
            setErrorColor('red');
            console.error(error);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleForgotPassword} style={styles.card}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>CHANGE PASSWORD</h2>

                {error && <p style={{ color: errorColor, textAlign: 'center' }}>{error}</p>}

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
                        type="email" // Chuyển sang type email để validate tốt hơn
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>

                <p style={{ fontSize: '14px' }}>
                    Don't have an account? <Link to="/auth/register" style={styles.link}>Register</Link>
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <button type="submit" style={styles.button}>Change Password</button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
    },
    card: {
        padding: '40px',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    inputGroup: {
        marginBottom: '15px'
    },
    input: {
        width: '100%',
        padding: '12px',
        marginTop: '5px',
        borderRadius: '25px',
        border: '1px solid #ddd',
        boxSizing: 'border-box',
        outline: 'none'
    },
    button: {
        width: '70%', // Cho rộng ra tí vì chữ "Change Password" hơi dài
        padding: '12px',
        backgroundColor: '#000000',
        color: '#fff',
        border: 'none',
        borderRadius: '30px',
        cursor: 'pointer',
        fontSize: '16px'
    },
    link: {
        color: '#000',
        fontWeight: 'bold',
        textDecoration: 'none'
    }
};

export default ForgotPassword;