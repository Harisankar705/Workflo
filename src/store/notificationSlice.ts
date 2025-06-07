import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationState } from '../types';

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<{
      type: 'due-date' | 'overdue' | 'reminder';
      taskId: string;
      taskTitle: string;
      message: string;
    }>) => {
      const notification = {
        id: `notif-${Date.now()}`,
        ...action.payload,
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      const exists = state.notifications.some(
        n => n.taskId === notification.taskId && n.type === notification.type
      );
      
      if (!exists) {
        state.notifications.unshift(notification);
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { addNotification, markAsRead, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;