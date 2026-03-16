import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import Toast from './Toast';

const ToastContainer = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-6 right-6 z-[9999] pointer-events-none flex flex-col items-end">
      <div className="pointer-events-auto">
        {notifications.map((notification) => (
          <Toast 
            key={notification.id} 
            notification={notification} 
            onClose={removeNotification} 
          />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
