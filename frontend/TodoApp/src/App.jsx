import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register'; // Import the Register component
import SomePage from './pages/somepage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Add route for Register component */}
         
      </Routes>
    </BrowserRouter>
  );
}

export default App;
