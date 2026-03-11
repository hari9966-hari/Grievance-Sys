import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ toggleSidebar }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white/80 backdrop-blur-md border-b border-neutral-200 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-neutral-500 hover:text-neutral-900 focus:outline-none lg:hidden mr-4 p-2 rounded-lg hover:bg-neutral-100 transition-all"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-neutral-400 hover:text-neutral-500 relative p-2 rounded-full hover:bg-neutral-100 transition-all group">
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white group-hover:scale-125 transition-transform" />
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" aria-hidden="true" />
        </button>
        
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
