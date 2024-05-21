import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { userId, setUserId } = useContext(AuthContext);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', {
                email,
                password
            });

            const { token, userId } = response.data;
            setUserId(userId);
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            navigate(`/todos/${userId}`);
        } catch (error) {
            console.error(error);
            setError('Invalid email or password');
        }
    };

    if (userId && location.pathname !== `/todos/${userId}`) {
        return (
            <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
                <h1 className='text-4xl font-bold mb-8'>You are already logged in</h1>
                <button
                    className='bg-blue-500 text-white p-2 rounded mb-4 w-64 hover:bg-blue-600'
                    onClick={() => navigate(`/todos/${userId}`)}
                >
                    Go to your todos
                </button>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
            <h1 className='text-4xl font-bold mb-8'>Login</h1>
            <input
                type='email'
                placeholder='Email'
                className='p-2 border border-gray-300 rounded mb-4 w-64'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type='password'
                placeholder='Password'
                className='p-2 border border-gray-300 rounded mb-4 w-64'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                className='bg-blue-500 text-white p-2 rounded mb-4 w-64 hover:bg-blue-600'
                onClick={handleLogin}
            >
                Login
            </button>
            {error && <p className='text-red-500 mt-2'>{error}</p>}
            <Link to="/register" className='text-blue-500 mt-4 hover:underline'>Register</Link>
        </div>
    );
}

export default Login;