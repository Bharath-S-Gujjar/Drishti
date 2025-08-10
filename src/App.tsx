import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';
import System from './pages/System';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './components/auth';

// Import your new Predictive Analytics page
import PredictiveAnalytics from './pages/PredictiveAnalytics';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout><Analytics /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <Layout><Alerts /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/system"
          element={
            <ProtectedRoute>
              <Layout><System /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/predictive-analytics"
          element={
            <ProtectedRoute>
              <Layout><PredictiveAnalytics /></Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
