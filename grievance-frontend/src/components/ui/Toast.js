import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const Toast = ({ notification, onClose }) => {
  const { id, message, type, duration } = notification;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      text: 'text-emerald-800',
      icon: <CheckCircle className="h-5 w-5 text-emerald-500" />,
      progress: 'bg-emerald-500'
    },
    error: {
      bg: 'bg-rose-50',
      border: 'border-rose-100',
      text: 'text-rose-800',
      icon: <AlertCircle className="h-5 w-5 text-rose-500" />,
      progress: 'bg-rose-500'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-amber-800',
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      progress: 'bg-amber-500'
    },
    info: {
      bg: 'bg-sky-50',
      border: 'border-sky-100',
      text: 'text-sky-800',
      icon: <Info className="h-5 w-5 text-sky-500" />,
      progress: 'bg-sky-500'
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div 
      className={`relative flex items-center p-4 min-w-[320px] max-w-md ${config.bg} ${config.border} border rounded-2xl shadow-lg transform transition-all duration-300 ease-out animate-slide-in-right mb-3`}
    >
      <div className="flex-shrink-0 mr-3">
        {config.icon}
      </div>
      <div className={`flex-grow font-medium text-sm ${config.text}`}>
        {message}
      </div>
      <button 
        onClick={() => onClose(id)}
        className="flex-shrink-0 ml-4 text-neutral-400 hover:text-neutral-600 transition-colors p-1"
      >
        <X className="h-4 w-4" />
      </button>
      
      {/* Progress Bar for Auto-dismiss */}
      {duration && (
        <div className="absolute bottom-0 left-0 h-1 overflow-hidden w-full rounded-b-2xl">
          <div 
            className={`h-full ${config.progress} animate-toast-progress`}
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      )}
    </div>
  );
};

export default Toast;
