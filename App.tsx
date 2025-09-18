
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import { Role } from './types';
import CreateStorePage from './pages/CreateStorePage';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  const getHomeRoute = () => {
    if (!user) return '/login';
    switch (user.role) {
      case Role.ADMIN:
        return '/admin/dashboard';
      case Role.STORE_OWNER:
        return '/store-owner/dashboard';
      case Role.USER:
        return '/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Layout />}>
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={[Role.ADMIN]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={[Role.USER]}><UserDashboard /></ProtectedRoute>} />
        <Route path="/store-owner/dashboard" element={<ProtectedRoute allowedRoles={[Role.STORE_OWNER]}><StoreOwnerDashboard /></ProtectedRoute>} />
        <Route path="/store-owner/create-store" element={<ProtectedRoute allowedRoles={[Role.STORE_OWNER]}><CreateStorePage /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to={getHomeRoute()} replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;