import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [errorColor, setErrorColor] = useState('');
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match!');
            setErrorColor('red');
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/auth/forgot-password', {
                username, email, newPassword
            });

            setError('Password changed successfully! Redirecting to login...');
            setErrorColor('green');

            setTimeout(() => {
                navigate('/auth/login');
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
                <h2>CHANGE PASSWORD</h2>

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
                        type="text"
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

                <p>Don't have an account? <a href="/auth/register">Register</a></p>
                <button type="submit" style={styles.button}>Change Password</button>
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
        width: '40%',
        padding: '10px',
        backgroundColor: '#000000',
        color: '#fff',
        border: 'none',
        borderRadius: '30px',
        cursor: 'pointer',
        fontSize: '16px'
    }
};

export default ForgotPassword;