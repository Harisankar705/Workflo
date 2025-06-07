import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isAfter, isBefore, addDays, parseISO } from 'date-fns';
import { RootState } from '../store';
import { addNotification } from '../store/notificationSlice';

export const useNotifications = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    const checkDueDates = () => {
      const now = new Date();
      const tomorrow = addDays(now, 1);

      Object.values(tasks).forEach(task => {
        if (!task.dueDate) return;

        const dueDate = parseISO(task.dueDate);
        
        if (isBefore(dueDate, now) && task.status !== 'done') {
          dispatch(addNotification({
            type: 'overdue',
            taskId: task.id,
            taskTitle: task.title,
            message: `Task "${task.title}" is overdue!`,
          }));
        }
        
        else if (isBefore(dueDate, tomorrow) && isAfter(dueDate, now) && task.reminderSet) {
          dispatch(addNotification({
            type: 'due-date',
            taskId: task.id,
            taskTitle: task.title,
            message: `Task "${task.title}" is due tomorrow!`,
          }));
        }
      });
    };

    checkDueDates();
    const interval = setInterval(checkDueDates, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [tasks, dispatch]);
};