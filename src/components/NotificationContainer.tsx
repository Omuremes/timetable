'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
};

const iconColorMap = {
  success: 'text-green-400',
  error: 'text-red-400',
  info: 'text-blue-400',
  warning: 'text-yellow-400',
};

function NotificationItem({ notification, onClose }: NotificationProps) {
  const Icon = iconMap[notification.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification.id);
    }, notification.duration || 5000);

    return () => clearTimeout(timer);
  }, [notification.id, notification.duration, onClose]);

  return (
    <div className={`max-w-xs sm:max-w-sm w-full border rounded-lg shadow-lg p-3 sm:p-4 ${colorMap[notification.type]}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColorMap[notification.type]}`} />
        </div>
        <div className="ml-2 sm:ml-3 flex-1">
          <p className="text-xs sm:text-sm font-medium">{notification.title}</p>
          {notification.message && (
            <p className="mt-1 text-xs opacity-90">{notification.message}</p>
          )}
        </div>
        <div className="ml-3 sm:ml-4 flex-shrink-0 flex">
          <button
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={() => onClose(notification.id)}
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface NotificationContainerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

export default function NotificationContainer({ notifications, onClose }: NotificationContainerProps) {
  return (
    <div className="fixed top-4 right-2 sm:right-4 z-50 space-y-2 max-w-xs sm:max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </div>
  );
}
