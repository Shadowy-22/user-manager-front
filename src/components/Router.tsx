import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from '../pages/Register/Register';
import Login from '../pages/Login/Login';
import Home from '../pages/Home/Home';

const RouterManager = () => {
  
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    </Router>
  )
}

export default RouterManager
