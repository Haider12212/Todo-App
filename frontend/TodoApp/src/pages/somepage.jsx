import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext"; // Import AuthContext from your authentication context file

const SomePage = () => {
    const { userId } = useContext(AuthContext); // Get userId from the AuthContext
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTodos();
        console.log(userId);
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/todos/${userId}`); // Use userId dynamically in the URL
            setTodos(response.data);
        } catch (error) {
            console.error(error);
            setError('Failed to fetch todos');
        }
    };

    const handleAddTodo = async () => {
        try {
            const response = await axios.post('http://localhost:5000/todos', {
                userId: userId, // Use userId dynamically
                type: 'note', // or 'event' depending on your logic
                title: newTodo,
                description: '', // Add description if needed
                time: new Date() // Add time if needed
            });
            console.log(response.data);
            setNewTodo('');
            fetchTodos();
        } catch (error) {
            console.error(error);
            setError('Failed to add todo');
        }
    };

    return (
        <div className='container mx-auto'>
            <h1 className='text-4xl font-bold mb-8'>Todo List</h1>
            <div className='mb-4'>
                <input
                    type='text'
                    placeholder='Enter a new todo'
                    className='p-2 border border-gray-300 rounded mr-2'
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                />
                <button
                    className='bg-blue-500 text-white p-2 rounded'
                    onClick={handleAddTodo}
                >
                    Add Todo
                </button>
            </div>
            <ul>
                {todos.map(todo => (
                    <li key={todo._id} className='mb-2'> {/* Change from todo.id to todo._id */}
                        {todo.title}
                    </li>
                ))}
            </ul>
            {error && <p className='text-red-500 mt-2'>{error}</p>}
        </div>
    );
}

export default SomePage;
