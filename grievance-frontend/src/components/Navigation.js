import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiHome } from 'react-icons/fi';

export const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold hover:text-blue-100">
            <FiHome className="w-6 h-6" />
            Grievance System
          </Link>
        </div>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-6">
            <span className="text-sm">Welcome, {user.name}</span>
            <span className="text-xs bg-blue-700 px-3 py-1 rounded-full">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>

            <div className="flex gap-4">
              {user.role === 'citizen' && (
                <>
                  <Link to="/citizen/dashboard" className="hover:text-blue-100">
                    Dashboard
                  </Link>
                  <Link to="/citizen/create-complaint" className="hover:text-blue-100">
                    New Complaint
                  </Link>
                </>
              )}
              {user.role === 'officer' && (
                <>
                  <Link to="/officer/dashboard" className="hover:text-blue-100">
                    Officer
                  </Link>
                  <Link to="/officer/performance" className="hover:text-blue-100">
                    Performance
                  </Link>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <Link to="/admin/dashboard" className="hover:text-blue-100">
                    Admin
                  </Link>
                  <Link to="/admin/officers" className="hover:text-blue-100">
                    Officers
                  </Link>
                  <Link to="/admin/analytics" className="hover:text-blue-100">
                    Analytics
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 hover:text-blue-100"
              >
                <FiLogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-blue-100">
              Login
            </Link>
            <Link to="/register" className="hover:text-blue-100">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
