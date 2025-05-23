import React, { createContext, useContext, useState, ReactNode } from 'react';

type Notification = {
  to: 'user' | 'admin';
  message: string;
  timestamp: Date;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'timestamp'>) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'timestamp'>) => {
    setNotifications((prev) => [
      ...prev,
      { ...notification, timestamp: new Date() },
    ]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
