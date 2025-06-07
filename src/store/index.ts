import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice';
import authReducer from './authSlice';
import notificationReducer from './notificationSlice';

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    auth: authReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;