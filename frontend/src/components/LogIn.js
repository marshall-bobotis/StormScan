import '../css/LogIn.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LogIn = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    /**
     * login form submission handler
     * @param {Event} e 
     */
    const handleLogin = async (e) => {
        e.preventDefault(); 
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/login', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            console.log('Login Successful:', data);
            localStorage.setItem('user', JSON.stringify(data.data));
            window.dispatchEvent(new Event('userLogin'));
            // Redirect to home page
            navigate('/');

        } catch (err) {
            console.error(err);
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h1>Log In</h1>

                {error && <p className="error-message">{error}</p>}
                {loading && <p className="loading-message">Logging in...</p>}

                <label htmlFor="email">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    autoComplete="off" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />

                <label htmlFor="password">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    autoComplete="off" 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Log In'}
                </button>
            </form>
            <p>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
};

export default LogIn;