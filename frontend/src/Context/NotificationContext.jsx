import React, { createContext, useState, useContext, useEffect } from 'react';
import { getNotifications, markNotificationAsRead } from '../utils/api';
import { getSocket } from '../utils/socket';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated } = useAuth();

  // Fetch notifications when user is authenticated
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await getNotifications();
      setNotifications(response);
      
      // Calculate unread count
      const unread = response.filter(notification => !notification.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification._id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // Call API to mark all as read
      await Promise.all(
        notifications
          .filter(notification => !notification.isRead)
          .map(notification => markNotificationAsRead(notification._id))
      );
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, isRead: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Listen for new notifications via socket
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const socket = getSocket();
    
    if (socket) {
      socket.on('notification', (newNotification) => {
        // Add new notification to state
        setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
        
        // Increment unread count
        setUnreadCount(prevCount => prevCount + 1);
      });
      
      return () => {
        socket.off('notification');
      };
    }
  }, [isAuthenticated]);

  // Fetch notifications on initial load
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      // Reset state when user logs out
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};