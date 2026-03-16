import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FiLogOut, FiHome, FiGlobe, FiMenu, FiX } from 'react-icons/fi';
import NotificationDropdown from './ui/NotificationDropdown';

export const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link to="/" className="flex items-center gap-2 text-lg sm:text-xl font-bold hover:text-blue-100 transition-colors" onClick={() => setIsMenuOpen(false)}>
            <FiHome className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="truncate max-w-[150px] sm:max-w-none">
              {language === 'en' ? 'Grievance Sys' : 'குறைதீர்ப்பு'}
            </span>
          </Link>
          
          <button 
            onClick={toggleLanguage}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 transition-colors text-sm font-medium"
          >
            <FiGlobe className="w-4 h-4" />
            {language === 'en' ? 'Tamil' : 'English'}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated && user ? (
            <>
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium">Welcome, {user.name}</span>
                <span className="text-[10px] bg-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {user.role}
                </span>
              </div>

              <NotificationDropdown />

              <div className="flex gap-4 border-l border-blue-500 pl-4">
                {user.role === 'citizen' && (
                  <>
                    <Link to="/citizen/dashboard" className="text-sm font-medium hover:text-blue-100">{t('nav.dashboard')}</Link>
                    <Link to="/citizen/create-complaint" className="text-sm font-medium hover:text-blue-100">{t('nav.createComplaint')}</Link>
                  </>
                )}
                {user.role === 'officer' && (
                  <>
                    <Link to="/officer/dashboard" className="text-sm font-medium hover:text-blue-100">{t('nav.dashboard')}</Link>
                    <Link to="/officer/performance" className="text-sm font-medium hover:text-blue-100">{t('nav.performance')}</Link>
                  </>
                )}
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin/dashboard" className="text-sm font-medium hover:text-blue-100">{t('nav.dashboard')}</Link>
                    <Link to="/admin/officers" className="text-sm font-medium hover:text-blue-100">{t('nav.officers')}</Link>
                    <Link to="/admin/analytics" className="text-sm font-medium hover:text-blue-100">{t('nav.analytics')}</Link>
                  </>
                )}
                <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-medium hover:text-blue-100 transition-colors">
                  <FiLogOut className="w-4 h-4" />
                  {t('nav.logout')}
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-4">
              <Link to="/transparency" className="text-sm font-medium hover:text-blue-100 transition-colors uppercase tracking-wider">
                {language === 'en' ? 'Transparency' : 'வெளிப்படை'}
              </Link>
              <Link to="/login" className="text-sm font-bold bg-white text-blue-600 px-5 py-2 rounded-xl hover:bg-blue-50 transition-all shadow-md">
                {t('nav.login')}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Header Buttons */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && <NotificationDropdown />}
          <button 
            onClick={toggleMenu}
            className="p-2 rounded-xl bg-blue-700 hover:bg-blue-800 transition-colors text-white"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-700 border-t border-blue-500 animate-slide-down">
          <div className="px-4 py-6 space-y-4">
            {isAuthenticated && user ? (
              <>
                <div className="pb-4 border-b border-blue-600 mb-4 px-2">
                  <p className="text-sm font-bold">Welcome, {user.name}</p>
                  <p className="text-[10px] text-blue-200 mt-0.5 uppercase tracking-widest">{user.role}</p>
                </div>
                {user.role === 'citizen' && (
                  <>
                    <Link to="/citizen/dashboard" className="block px-2 py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium border-b border-blue-600/30" onClick={toggleMenu}>{t('nav.dashboard')}</Link>
                    <Link to="/citizen/create-complaint" className="block px-2 py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium border-b border-blue-600/30" onClick={toggleMenu}>{t('nav.createComplaint')}</Link>
                  </>
                )}
                {user.role === 'officer' && (
                  <>
                    <Link to="/officer/dashboard" className="block px-2 py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium border-b border-blue-600/30" onClick={toggleMenu}>{t('nav.dashboard')}</Link>
                    <Link to="/officer/performance" className="block px-2 py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium border-b border-blue-600/30" onClick={toggleMenu}>{t('nav.performance')}</Link>
                  </>
                )}
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin/dashboard" className="block px-2 py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium border-b border-blue-600/30" onClick={toggleMenu}>{t('nav.dashboard')}</Link>
                    <Link to="/admin/officers" className="block px-2 py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium border-b border-blue-600/30" onClick={toggleMenu}>{t('nav.officers')}</Link>
                    <Link to="/admin/analytics" className="block px-2 py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium border-b border-blue-600/30" onClick={toggleMenu}>{t('nav.analytics')}</Link>
                  </>
                )}
                <button onClick={handleLogout} className="flex items-center gap-2 w-full px-2 py-3 rounded-lg text-left text-blue-200 hover:bg-blue-800 transition-colors font-medium">
                  <FiLogOut /> {t('nav.logout')}
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <Link to="/login" className="block w-full text-center bg-white text-blue-600 py-3 rounded-xl font-bold shadow-soft" onClick={toggleMenu}>
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="block w-full text-center bg-blue-500 text-white py-3 rounded-xl font-bold border border-blue-400" onClick={toggleMenu}>
                  {t('nav.register')}
                </Link>
              </div>
            )}
            
            <div className="pt-4 border-t border-blue-600 mt-4 flex justify-between items-center px-2">
              <button 
                onClick={() => { toggleLanguage(); toggleMenu(); }}
                className="flex items-center gap-2 text-sm font-semibold"
              >
                <FiGlobe /> {language === 'en' ? 'தமிழ் (Tamil)' : 'English'}
              </button>
              <Link to="/transparency" className="text-xs font-bold uppercase tracking-tighter opacity-80" onClick={toggleMenu}>
                {language === 'en' ? 'Transparency' : 'வெளிப்படை'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
