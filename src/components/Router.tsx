import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/Login/Login';
import UserManagement from '../pages/UserManagement/UserManagement';
import Register from '../pages/Register/Register';

const RouterManager = () => {
  
  return (
    <Router basename='/cuentas/'>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="*" element={<Navigate to="/" replace />} />
       </Routes>
    </Router>
  )
}

export default RouterManager
