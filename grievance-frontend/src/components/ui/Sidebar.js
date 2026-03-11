import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  PlusCircle, 
  LogOut,
  Users,
  BarChart2,
  AlertCircle
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const citizenLinks = [
    { to: '/citizen/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/citizen/create-complaint', icon: PlusCircle, label: 'Raise Complaint' },
  ];

  const officerLinks = [
    { to: '/officer/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/officer/performance', icon: BarChart2, label: 'Performance' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/admin/officers', icon: Users, label: 'Manage Officers' },
    { to: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
  ];

  let links = [];
  if (user?.role === 'admin') links = adminLinks;
  else if (user?.role === 'officer') links = officerLinks;
  else if (user?.role === 'citizen') links = citizenLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-neutral-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo area */}
          <div className="h-16 flex items-center px-6 border-b border-neutral-200">
            <AlertCircle className="h-8 w-8 text-primary-600 mr-3" />
            <span className="text-lg font-bold text-neutral-900">Grievance Sys</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-soft shadow-primary-200 translate-x-1'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`
                }
              >
                <link.icon className={`mr-3 h-5 w-5 flex-shrink-0`} strokeWidth={2.5} />
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* User & Logout section */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center mb-4 px-2">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-neutral-900 truncate">{user?.name}</p>
                <p className="text-xs text-neutral-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-danger-600 rounded-xl hover:bg-danger-50 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" strokeWidth={2} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
