import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../Context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { BellIcon, CheckIcon } from '@heroicons/react/outline';

const NotificationDropdown = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotification();
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    
    onClose();
  };
  
  // Get notification link based on type
  const getNotificationLink = (notification) => {
    switch (notification.type) {
      case 'message':
        return `/messages/${notification.relatedId}`;
      case 'order':
        return `/orders/${notification.relatedId}`;
      case 'wishlist':
        return `/products/${notification.relatedId}`;
      case 'review':
        return `/products/${notification.relatedId}`;
      default:
        return '#';
    }
  };
  
  return (
    <div
      ref={dropdownRef}
      className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
      <div className="py-1">
        <div className="px-4 py-2 border-b flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
          <button
            onClick={markAllAsRead}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Mark all as read
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-1 text-sm text-gray-500">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <Link
                key={notification._id}
                to={getNotificationLink(notification)}
                className={`block px-4 py-3 hover:bg-gray-50 ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start">
                  {notification.sender?.avatar ? (
                    <img
                      src={notification.sender.avatar || "/placeholder.svg"}
                      alt={notification.sender.name}
                      className="h-10 w-10 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <BellIcon className="h-5 w-5 text-blue-500" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {notification.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <span className="inline-flex items-center justify-center h-2 w-2 rounded-full bg-blue-600"></span>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
        
        <div className="border-t px-4 py-2">
          <Link
            to="/notifications"
            className="text-xs text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            View all notifications
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;