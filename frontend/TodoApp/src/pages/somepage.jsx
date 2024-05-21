import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SomePage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState({

        title: '',
        description: '',
        type: 'note', // Default value
        date: '', // Added date for event
        time: '' // Added time for event
    });
    const [error, setError] = useState('');
    const [completedTasks, setCompletedTasks] = useState([]);

    useEffect(() => {
        fetchTodos();
        const savedCompletedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
        setCompletedTasks(savedCompletedTasks);
    }, [userId]);

    useEffect(() => {
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }, [completedTasks]);

    const fetchTodos = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/todos/${userId}`);
            setTodos(response.data);
        } catch (error) {
            console.error(error);
            setError('Failed to fetch todos');
            toast.error('Failed to fetch todos');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTodo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddTodo = async () => {
        try {
            const response = await axios.post('http://localhost:5000/todos', {
                userId: userId,
                type: newTodo.type,
                title: newTodo.title,
              description: newTodo.description,
                time: newTodo.type === 'event' ? `${newTodo.date} ${newTodo.time}` : new Date()
            });
            setNewTodo({
                title: '',
                description: '',
                type: 'note',
                date: '',
                time: ''
            });
            fetchTodos();
            toast.success('Todo added successfully');
        } catch (error) {
            console.error(error);
            setError('Failed to add todo');
            toast.error('Failed to add todo');
        }
    };

    const handleToggleTodo = async (todoId, completed) => {
        try {
            if (completed) {
                setCompletedTasks(completedTasks.filter(id => id !== todoId));
            } else {
                setCompletedTasks([...completedTasks, todoId]);
            }
            await axios.put(`http://localhost:5000/todos/${todoId}`, { completed: !completed });
            fetchTodos();
            toast.success('Todo toggled successfully');
        } catch (error) {
            console.error(error);
            setError('Failed to toggle todo');
            toast.error('Failed to toggle todo');
        }
    };

    const handleDeleteTodo = async (todoId) => {
        try {
            await axios.delete(`http://localhost:5000/todos/${todoId}`);
            fetchTodos();
            toast.success('Todo deleted successfully');
        } catch (error) {
            console.error(error);
            setError('Failed to delete todo');
            toast.error('Failed to delete todo');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        navigate('/');
        window.location.reload(); // Refresh the page to clear any cached data
    };
    return (
        <div className='container mx-auto'>
            <h1 className='text-4xl mb-8'>Your Todos</h1>
            <ToastContainer />
            <div className='flex justify-between mb-4'>
                <input
                    className='border border-gray-400 p-2 w-1/2 rounded'
                    name='title'
                    placeholder='New Todo Title'
                    value={newTodo.title}
                    onChange={handleInputChange}
                />
                <select
                    className='border border-gray-400 p-2 rounded'
                    name='type'
                    value={newTodo.type}
                    onChange={handleInputChange}
                >
                    <option value='note'>Note</option>
                    <option value='event'>Event</option>
                </select>
                
                <button
                    className='bg-red-500 text-white p-2 rounded ml-2'
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
            <div className='mb-4'>
                <textarea
                    className='border border-gray-400 p-2 w-full rounded'
                    name='description'
                    placeholder='New Todo Description'
                    value={newTodo.description}
                    onChange={handleInputChange}
                />
            </div>
            {newTodo.type === 'event' && (
                <div className='mb-4'>
                    <input
                        className='border border-gray-400 p-2 rounded mr-2'
                        name='date'
                        type='date'
                        value={newTodo.date}
                        onChange={handleInputChange}
                    />
                    <input
                        className='border border-gray-400 p-2 rounded'
                        name='time'
                        type='time'
                        value={newTodo.time}
                        onChange={handleInputChange}
                    />
                    
               </div>
               
            )}
            <button
                    className='bg-blue-500 text-white p-2 rounded'
                    onClick={handleAddTodo}
                >
                    Add Todo
                </button>
            <h2 className='text-2xl mt-8'>Todos</h2>
            <table className='border-collapse border border-gray-400 w-full'>
                <thead>
                    <tr className='bg-gray-200'>
                        <th className='border border-gray-400 px-4 py-2'>Title</th>
                        <th className='border border-gray-400 px-4 py-2'>Description</th>
                        <th className='border border-gray-400 px-4 py-2'>Type</th>
                        <th className='border border-gray-400 px-4 py-2'>Time</th>
                        <th className='border border-gray-400 px-4 py-2'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {todos.map(todo => (
                        <tr key={todo._id} className={`bg-white ${completedTasks.includes(todo._id) ? 'bg-green-100' : ''}`}>
                            <td className={`border border-gray-400 px-4 py-2 ${completedTasks.includes(todo._id) ? 'line-through' : ''}`}>{todo.title}</td>
                            <td className={`border border-gray-400 px-4 py-2 ${completedTasks.includes(todo._id) ? 'line-through' : ''}`}>{todo.description}</td>
                            <td className={`border border-gray-400 px-4 py-2 ${completedTasks.includes(todo._id) ? 'line-through' : ''}`}>{todo.type}</td>
                            <td className={`border border-gray-400 px-4 py-2 ${completedTasks.includes(todo._id) ? 'line-through' : ''}`}>
                            {todo.type === 'event' ? new Date(todo.time).toLocaleString('en-US', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            }) : '-'}
                        </td>
                        
                            <td className='border border-gray-400 px-4 py-2 flex'>
                                <button className={`rounded mr-2 ${completedTasks.includes(todo._id) ? 'bg-gray-300' : 'bg-green-500 hover:bg-green-700 text-white'} px-3 py-1`} onClick={() => handleToggleTodo(todo._id, completedTasks.includes(todo._id))}>
                                    {completedTasks.includes(todo._id) ? 'Undo' : 'Complete'}
                                </button>
                                <button className='rounded px-3 py-1 bg-red-500 hover:bg-red-700 text-white flex items-center' onClick={() => handleDeleteTodo(todo._id)}>
                                    <FontAwesomeIcon icon={faTrash} className='mr-1' /> Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
        </div>
    );
};

export default SomePage;