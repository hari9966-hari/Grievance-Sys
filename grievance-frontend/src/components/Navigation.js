import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FiLogOut, FiHome, FiGlobe } from 'react-icons/fi';
import NotificationDropdown from './ui/NotificationDropdown';

export const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
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
            {language === 'en' ? 'Grievance System' : 'குறைதீர்ப்பு அமைப்பு'}
          </Link>
          
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 transition-colors text-sm font-medium"
          >
            <FiGlobe className="w-4 h-4" />
            {language === 'en' ? 'Tamil' : 'English'}
          </button>

          <Link to="/transparency" className="text-sm font-semibold hover:text-blue-100 transition-colors uppercase tracking-wider">
            {language === 'en' ? 'Transparency' : 'வெளிப்படைத்தன்மை'}
          </Link>
        </div>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-6">
            <span className="text-sm">Welcome, {user.name}</span>
            <span className="text-xs bg-blue-700 px-3 py-1 rounded-full">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>

            <NotificationDropdown />

            <div className="flex gap-4">
              {user.role === 'citizen' && (
                <>
                  <Link to="/citizen/dashboard" className="hover:text-blue-100">
                    {t('nav.dashboard')}
                  </Link>
                  <Link to="/citizen/create-complaint" className="hover:text-blue-100">
                    {t('nav.createComplaint')}
                  </Link>
                </>
              )}
              {user.role === 'officer' && (
                <>
                  <Link to="/officer/dashboard" className="hover:text-blue-100">
                    {t('nav.dashboard')}
                  </Link>
                  <Link to="/officer/performance" className="hover:text-blue-100">
                    {t('nav.performance')}
                  </Link>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <Link to="/admin/dashboard" className="hover:text-blue-100">
                    {t('nav.dashboard')}
                  </Link>
                  <Link to="/admin/officers" className="hover:text-blue-100">
                    {t('nav.officers')}
                  </Link>
                  <Link to="/admin/analytics" className="hover:text-blue-100">
                    {t('nav.analytics')}
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 hover:text-blue-100"
              >
                <FiLogOut className="w-5 h-5" />
                {t('nav.logout')}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-blue-100">
              {t('nav.login')}
            </Link>
            <Link to="/register" className="hover:text-blue-100">
              {t('nav.register')}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
