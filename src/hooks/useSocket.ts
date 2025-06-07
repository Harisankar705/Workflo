import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { syncTaskUpdate, syncTaskMove, syncTaskAdd, syncTaskDelete } from '../store/taskSlice';

export const useSocket = (userId: string | null) => {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return;

    socketRef.current = io('http://localhost:3001', {
      query: { userId }
    });

    const socket = socketRef.current;

    socket.on('task-updated', (data) => {
      dispatch(syncTaskUpdate(data));
    });

    socket.on('task-moved', (data) => {
      dispatch(syncTaskMove(data));
    });

    socket.on('task-added', (data) => {
      dispatch(syncTaskAdd(data));
    });

    socket.on('task-deleted', (data) => {
      dispatch(syncTaskDelete(data));
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, dispatch]);

  const emitTaskUpdate = (taskData: any) => {
    if (socketRef.current) {
      socketRef.current.emit('update-task', taskData);
    }
  };

  const emitTaskMove = (moveData: any) => {
    if (socketRef.current) {
      socketRef.current.emit('move-task', moveData);
    }
  };

  const emitTaskAdd = (taskData: any) => {
    if (socketRef.current) {
      socketRef.current.emit('add-task', taskData);
    }
  };

  const emitTaskDelete = (taskId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('delete-task', { taskId });
    }
  };

  return {
    emitTaskUpdate,
    emitTaskMove,
    emitTaskAdd,
    emitTaskDelete
  };
};