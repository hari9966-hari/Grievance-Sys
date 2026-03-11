import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/ui/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CitizenDashboard from './pages/CitizenDashboard';
import CreateComplaint from './pages/CreateComplaint';
import ComplaintDetails from './pages/ComplaintDetails';
import OfficerDashboard from './pages/OfficerDashboard';
import OfficerPerformance from './pages/OfficerPerformance';
import AdminDashboard from './pages/AdminDashboard';
import AdminOfficers from './pages/AdminOfficers';
import AdminAnalytics from './pages/AdminAnalytics';

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Authenticated Dashboard Routes */}
      <Route element={<DashboardLayout />}>
        {/* Citizen Routes */}
        <Route
          path="/citizen/dashboard"
          element={
            <ProtectedRoute requiredRole="citizen">
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/create-complaint"
          element={
            <ProtectedRoute requiredRole="citizen">
              <CreateComplaint />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/complaint/:id"
          element={
            <ProtectedRoute requiredRole="citizen">
              <ComplaintDetails />
            </ProtectedRoute>
          }
        />

        {/* Officer Routes */}
        <Route
          path="/officer/dashboard"
          element={
            <ProtectedRoute requiredRole="officer">
              <OfficerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer/performance"
          element={
            <ProtectedRoute requiredRole="officer">
              <OfficerPerformance />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/officers"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminOfficers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 text-center px-4">
            <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Page Not Found</h2>
            <p className="text-neutral-500 mb-8 max-w-md">The page you're looking for doesn't exist or has been moved.</p>
            <a href="/" className="bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors font-medium">
              Go Back Home
            </a>
          </div>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
