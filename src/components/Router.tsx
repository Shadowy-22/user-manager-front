import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/Login/Login';
import UserManagement from '../pages/UserManagement/UserManagement';
import Register from '../pages/Register/Register';
import Dashboard from '../pages/Dashboard/Dashboard';

const RouterManager = () => {
  
  return (
    <Router basename='/cuentas'>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
       </Routes>
    </Router>
  )
}

export default RouterManager
