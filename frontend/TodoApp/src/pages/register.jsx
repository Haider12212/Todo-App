import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext); // Access login function from AuthContext

    const handleRegister = async () => {
        try {
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            const response = await axios.post('http://localhost:5000/register', {
                email,
                password
            });
            console.log(response.data);
            // Handle successful registration (e.g., redirect to login)
            // Optionally, you can automatically log in the user after successful registration
            // For example:
            // login(response.data.userId);
        } catch (error) {
            console.error(error);
            setError('Registration failed');
        }
    };

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1 className='text-4xl font-bold mb-8'>Register</h1>
            <input
                type='text'
                placeholder='Email'
                className='p-2 border border-gray-300 rounded mb-4'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type='password'
                placeholder='Password'
                className='p-2 border border-gray-300 rounded mb-4'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type='password'
                placeholder='Confirm Password'
                className='p-2 border border-gray-300 rounded mb-4'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
                className='bg-blue-500 text-white p-2 rounded'
                onClick={handleRegister}
            >
                Register
            </button>
            {error && <p className='text-red-500 mt-2'>{error}</p>}
        </div>
    );
}

export default Register;
