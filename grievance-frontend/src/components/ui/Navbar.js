import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar({ toggleSidebar }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 sm:h-20 items-center justify-between glass border-b border-white/60 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-neutral-500 hover:text-primary-600 focus:outline-none lg:hidden mr-4 p-2 rounded-xl hover:bg-primary-50 active:bg-primary-100 transition-all"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <NotificationDropdown />
        
        <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-neutral-100">
          <div className="text-right">
            <p className="text-sm font-bold text-neutral-900 leading-none">
              {user?.name || 'User'}
            </p>
            <p className="text-[10px] font-medium text-primary-600 uppercase tracking-wider mt-1">
              {user?.role}
            </p>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs shadow-inner">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
