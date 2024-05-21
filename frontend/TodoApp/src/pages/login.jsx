import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize the useNavigate hook
    const { setUserId } = useContext(AuthContext); // Access login function from AuthContext

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password
            });
            
            const { token , userId } = JSON.stringify(response.data); // Extract userId from response
            // Call login function from AuthContext to set user authentication
            setUserId(userId);
            console.log('User ID:', userId);
            // Redirect to '/todos' after successful login
            navigate('/todos'); // Use navigate to redirect after successful login
            
        } catch (error) {
            console.error(error);
            setError('Invalid username or password');
        }
    };

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1 className='text-4xl font-bold mb-8'>Login</h1>
            <input
                type='text'
                placeholder='Username'
                className='p-2 border border-gray-300 rounded mb-4'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type='password'
                placeholder='Password'
                className='p-2 border border-gray-300 rounded mb-4'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                className='bg-blue-500 text-white p-2 rounded mb-4'
                onClick={handleLogin}
            >
                Login
            </button>
            {error && <p className='text-red-500 mt-2'>{error}</p>}
            {/* Add Register button */}
            <Link to="/register" className='text-blue-500'>Register</Link>
        </div>
    );
}

export default Login;
