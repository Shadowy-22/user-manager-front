import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import UserManagement from '../pages/UserManagement/UserManagement';

const RouterManager = () => {
  
  return (
    <Router basename='/cuentas'>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="*" element={<Navigate to="/" replace />} />
       </Routes>
    </Router>
  )
}

export default RouterManager
