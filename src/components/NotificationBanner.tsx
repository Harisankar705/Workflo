import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Clock, AlertTriangle } from 'lucide-react';
import { RootState } from '../store';
import { markAsRead } from '../store/notificationSlice';

const NotificationBanner: React.FC = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state: RootState) => state.notifications);
  
  const unreadNotifications = notifications.filter(n => !n.read);

  if (unreadNotifications.length === 0) return null;

  const handleDismiss = (notificationId: string) => {
    dispatch(markAsRead(notificationId));
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Task Reminders ({unreadNotifications.length})
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            {unreadNotifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="flex items-center justify-between py-1">
                <div className="flex items-center">
                  <Clock size={14} className="mr-2" />
                  <span>{notification.message}</span>
                </div>
                <button
                  onClick={() => handleDismiss(notification.id)}
                  className="ml-2 text-yellow-600 hover:text-yellow-800"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {unreadNotifications.length > 3 && (
              <p className="text-xs mt-1">
                And {unreadNotifications.length - 3} more notifications...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationBanner;