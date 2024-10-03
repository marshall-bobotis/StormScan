import '../css/Register.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.error(err);
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h1>Register</h1>
                
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                {loading && <p className="loading-message">Registering...</p>}
                
                <label htmlFor="name">Name</label>
                <input 
                    type="text" 
                    id="name" 
                    autoComplete="off" 
                    placeholder="Enter your name" 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />

                <label htmlFor="email">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    autoComplete="off" 
                    placeholder="Enter your email" 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                
                <label htmlFor="password">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    autoComplete="off" 
                    placeholder="Enter your password" 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            <p>
                Already have an account? <Link to="/login">Log In here</Link>
            </p>
        </div>
    );
}

export default Register;