import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [errorColor, setErrorColor] = useState('');

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

            setError('Registration successful! Redirecting to login...');
            setErrorColor('green');

            setTimeout(() => {
                window.location.href = '/auth/login';
            }, 1000);
        } catch (err) {
            setError('Username already exists!');
            setErrorColor('red');
            console.error(err);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleRegister} style={styles.card}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>CREATE ACCOUNT</h2>

                {error && <p style={{ color: errorColor }}>{error}</p>}

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

                <p style={{ fontSize: '14px' }}>
                    Already have an account? <Link to="/auth/login" style={styles.link}>Login</Link>
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <button type="submit" style={styles.button}>Register</button>
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

export default Register;