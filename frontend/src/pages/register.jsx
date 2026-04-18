import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [errorColor, setErrorColor] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            setErrorColor('red');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', { username, password, email });

            setError('Registration successful!');
            setErrorColor('green');

            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (err) {
            setError('Username already exists!');
            setErrorColor('red');
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleRegister} style={styles.card}>
                <h2>CREATE ACCOUNT</h2>

                {error && <p style={{ color: errorColor }}>{error}</p>}

                <div style={styles.inputGroup}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>

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

                <p>Already have an account? <a href="/login">Login</a></p>
                <button type="submit" style={styles.button}>Register</button>
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

export default Register;