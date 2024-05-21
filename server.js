// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');


// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors(
    {
        origin: 'http://localhost:5173'
    }
));


// Connect to MongoDB database
mongoose.connect('mongodb+srv://Haider:R0rRfe5CVezRwrwP@cluster0.f8roazj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Define Mongoose schema for User and Todo
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const todoSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['note', 'event'], required: true },
    title: { type: String, required: true },
    description: { type: String },
    time: { type: Date }
});

// Define Mongoose models for User and Todo
const User = mongoose.model('User', userSchema);
const Todo = mongoose.model('Todo', todoSchema);

// Route for user registration
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = new User({ email, password });
        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for user login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Verify password
        if (password !== user.password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });
        const userId = user._id;

        return res.status(200).json({ token, userId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for creating a new todo
app.post('/todos', async (req, res) => {
    try {
        const { userId, type, title, description, time } = req.body;

        // Create new todo
        const newTodo = new Todo({ userId, type, title, description, time });
        await newTodo.save();

        return res.status(201).json({ message: 'Todo created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for getting all todos of a user
app.get('/todos/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find all todos for the user
        const todos = await Todo.find({ userId });

        return res.status(200).json(todos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for updating a todo
app.put('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description, time } = req.body;

        // Find todo by id and update
        await Todo.findByIdAndUpdate(id, { title, description, time });

        return res.status(200).json({ message: 'Todo updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Route for deleting a todo
app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Find todo by id and delete
        await Todo.findByIdAndDelete(id);

        return res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
