import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import UserManagement from '../pages/UserManagement/UserManagement';

const RouterManager = () => {
  
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/users" element={<UserManagement />} />
        </Routes>
    </Router>
  )
}

export default RouterManager
