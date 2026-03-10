import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ toggleSidebar }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white border-b border-neutral-200 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-neutral-500 hover:text-neutral-900 focus:outline-none lg:hidden mr-4"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        {/* Can add page title here if needed based on route, or keep it clean */}
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-neutral-400 hover:text-neutral-500 relative p-2 rounded-full hover:bg-neutral-100 transition-colors">
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white" />
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" aria-hidden="true" />
        </button>
        
        <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-neutral-200">
          <span className="text-sm font-medium text-neutral-700">
            Welcome, {user?.name?.split(' ')[0] || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
}
