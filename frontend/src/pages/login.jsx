import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Chặn load lại trang giống như trong Web truyền thống
        setError('');

        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", {
                username: username,
                password: password
            });

            const data = response.data;

            console.log(data)
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.username);
                localStorage.setItem("role", data.roles);

                setTimeout(() => {
                    window.location.href = '/';
                }, 500);
            };
        } catch (err) {
            setError('Username or password is incorrect!');
            console.error(err);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleLogin} style={styles.card}>
                <h2>LOGIN</h2>

                {error && <p style={{ color: 'red' }}>{error}</p>}

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

                <p>Don't have an account? <a href="/auth/register">Register</a></p>
                <p><a href="/auth/forgot-password">Forgot password?</a></p>
                <button type="submit" style={styles.button}>Login</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
    },
    card: {
        padding: '40px',
        borderRadius: '8px',
        width: '400px'
    },
    inputGroup: {
        marginBottom: '15px'
    },
    input: {
        width: '100%',
        padding: '10px',
        marginTop: '5px',
        borderRadius: '15px',
        border: '1px solid #000000',
        boxSizing: 'border-box'
    },
    button: {
        width: '20%',
        padding: '10px',
        backgroundColor: '#000000',
        color: '#fff',
        border: 'none',
        borderRadius: '30px',
        cursor: 'pointer',
        fontSize: '16px'
    }
};

export default Login;