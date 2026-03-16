import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Clock, ExternalLink } from 'lucide-react';
import { notificationAPI } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getNotifications({ limit: 5 });
      if (response.data.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(prev => 
        prev.map(notif => notif._id === id ? { ...notif, isRead: true } : notif)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      notificationAPI.markAsRead(notification._id);
    }
    setIsOpen(false);
    if (notification.complaintId) {
      navigate(`/complaints/${notification.complaintId._id || notification.complaintId}`);
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSec = Math.floor((now - date) / 1000);
    
    if (diffInSec < 60) return language === 'en' ? 'just now' : 'இப்போது';
    if (diffInSec < 3600) {
      const min = Math.floor(diffInSec / 60);
      return language === 'en' ? `${min}m ago` : `${min} நிமிடம் முன்`;
    }
    if (diffInSec < 86400) {
      const hours = Math.floor(diffInSec / 3600);
      return language === 'en' ? `${hours}h ago` : `${hours} மணி முன்`;
    }
    const days = Math.floor(diffInSec / 86400);
    return language === 'en' ? `${days}d ago` : `${days} நாள் முன்`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 block h-4 w-4 rounded-full bg-danger-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-white shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-card border border-neutral-100 z-50 overflow-hidden animate-fade-in">
          <div className="p-4 border-b border-neutral-50 flex justify-between items-center bg-neutral-50/50">
            <h3 className="font-bold text-neutral-900">{t('notifications.title')}</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                {t('notifications.markAllRead')}
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-neutral-50">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-neutral-50 transition-colors cursor-pointer relative group ${
                      !notification.isRead ? 'bg-primary-50/30' : ''
                    }`}
                  >
                    {!notification.isRead && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500"></div>
                    )}
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
                        {notification.type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                    <h4 className={`text-sm font-bold text-neutral-900 mb-1 ${!notification.isRead ? 'pr-6' : ''}`}>
                      {notification.title}
                    </h4>
                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {notification.message}
                    </p>
                    
                    <div className="mt-2 flex items-center justify-between">
                      {notification.complaintId && (
                        <span className="text-[10px] font-semibold text-neutral-400 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          #{notification.complaintId._id ? notification.complaintId._id.slice(-6).toUpperCase() : notification.complaintId.slice(-6).toUpperCase()}
                        </span>
                      )}
                      {!notification.isRead && (
                        <button
                          onClick={(e) => handleMarkAsRead(notification._id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-success-600 hover:bg-success-50 rounded-md transition-all"
                          title={t('notifications.markRead')}
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 px-4 text-center">
                <div className="bg-neutral-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-6 h-6 text-neutral-300" />
                </div>
                <p className="text-sm text-neutral-500">{t('notifications.empty')}</p>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-neutral-50 text-center bg-neutral-50/30">
            <button className="text-xs font-bold text-neutral-500 hover:text-primary-600 transition-colors">
              {t('notifications.viewAll')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
