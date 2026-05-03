import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [errorColor, setErrorColor] = useState('red');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", {
                username: username,
                password: password
            });

            const data = response.data;

            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.username);
                localStorage.setItem("role", data.roles || data.role);

                const userId = data.id || data._id || (data.user && (data.user.id || data.user._id));

                if (userId) {
                    localStorage.setItem("userId", String(userId));

                    setError('Login successful! Redirecting...');
                    setErrorColor('green');
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 500);
                } else {
                    console.error("Error", data);
                    setError('Login successful but failed to retrieve user ID. Please try again.');
                    setErrorColor('red');
                }
            }
        } catch (err) {
            setError('Username or password is incorrect!');
            setErrorColor('red');
            console.error("Error:", err);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleLogin} style={styles.card}>
                <h2 style={{ textAlign: 'center', marginBottom: '25px', letterSpacing: '2px', fontWeight: '800' }}>LOGIN</h2>

                {error &&
                    <p style={{
                        color: errorColor,
                        fontSize: '14px',
                        marginBottom: '15px',
                        fontWeight: 'bold'
                    }}>
                        {error}
                    </p>
                }

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

                <div style={{ marginTop: '15px', textAlign: 'left' }}>
                    <p style={{ fontSize: '13px', margin: '5px 0', color: '#666' }}>
                        Don't have an account? <Link to="/auth/register" style={styles.link}>Register</Link>
                    </p>
                    <p style={{ fontSize: '13px', margin: '5px 0', color: '#666' }}>
                        <Link to="/auth/forgot-password" style={styles.link}>Forgot password?</Link>
                    </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
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
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#f5f5f5',
        overflow: 'hidden',
    },

    card: {
        padding: '50px 40px',
        borderRadius: '15px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        backgroundColor: '#fff'
    },

    inputGroup: {
        marginBottom: '20px'
    },

    input: {
        width: '100%',
        padding: '14px 20px',
        borderRadius: '30px',
        border: '1px solid #eee',
        boxSizing: 'border-box',
        outline: 'none',
        backgroundColor: '#f9f9f9',
        fontSize: '15px'
    },

    button: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#000',
        color: '#fff',
        border: 'none',
        borderRadius: '30px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: '0.3s opacity'
    },

    link: {
        color: '#000',
        fontWeight: 'bold',
        textDecoration: 'none',
    }
};

export default Login;