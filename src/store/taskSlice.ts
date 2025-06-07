import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskState, Column, Subtask, CustomField, ActivityLog } from '../types';

const initialTasks: Record<string, Task> = {
  'task-1': {
    id: 'task-1',
    title: 'Brainstorming',
    description: 'Brainstorming brings team members\' diverse experience into play.',
    priority: 'High',
    status: 'todo',
    assignees: ['user1', 'user2', 'user3'],
    comments: 12,
    files: 0,
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    reminderSet: true,
    subtasks: [
      { id: 'sub-1', title: 'Research competitors', completed: false, createdAt: new Date().toISOString() },
      { id: 'sub-2', title: 'Define user personas', completed: true, createdAt: new Date().toISOString() }
    ],
    customFields: [
      { id: 'cf-1', name: 'Complexity', type: 'select', options: ['Low', 'Medium', 'High'], value: 'High' }
    ],
    activityLog: [
      { id: 'log-1', action: 'created', details: 'Task created', timestamp: new Date().toISOString(), userId: 'user1', userName: 'John Doe' }
    ],
    createdBy: 'user1',
  },
  'task-2': {
    id: 'task-2',
    title: 'Research',
    description: 'User research helps you to create an optimal product for users.',
    priority: 'High',
    status: 'todo',
    assignees: ['user1', 'user2'],
    comments: 10,
    files: 3,
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    reminderSet: true,
    subtasks: [],
    customFields: [],
    activityLog: [
      { id: 'log-2', action: 'created', details: 'Task created', timestamp: new Date().toISOString(), userId: 'user1', userName: 'John Doe' }
    ],
    createdBy: 'user1',
  },
  'task-3': {
    id: 'task-3',
    title: 'Wireframes',
    description: 'Low fidelity wireframes include the most basic content and visuals.',
    priority: 'High',
    status: 'todo',
    assignees: ['user1', 'user2'],
    comments: 10,
    files: 3,
    createdAt: new Date().toISOString(),
    subtasks: [],
    customFields: [],
    activityLog: [
      { id: 'log-3', action: 'created', details: 'Task created', timestamp: new Date().toISOString(), userId: 'user1', userName: 'John Doe' }
    ],
    createdBy: 'user1',
  },
};

const initialColumns: Record<string, Column> = {
  'column-1': {
    id: 'column-1',
    title: 'To Do',
    taskIds: ['task-1', 'task-2', 'task-3'],
  },
  'column-2': {
    id: 'column-2',
    title: 'On Progress',
    taskIds: [],
  },
  'column-3': {
    id: 'column-3',
    title: 'Done',
    taskIds: [],
  },
};

const loadStateFromStorage = (): TaskState | undefined => {
  try {
    const serializedState = localStorage.getItem('taskManagerState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveStateToStorage = (state: TaskState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('taskManagerState', serializedState);
  } catch (err) {
    console.error('Could not save state to localStorage:', err);
  }
};

const initialState: TaskState = loadStateFromStorage() || {
  tasks: initialTasks,
  columns: initialColumns,
  columnOrder: ['column-1', 'column-2', 'column-3'],
  filter: {
    priority: '',
    search: '',
    assignee: '',
    dueDate: '',
  },
  customFieldTemplates: [
    { id: 'template-1', name: 'Complexity', type: 'select', options: ['Low', 'Medium', 'High'], value: '' },
    { id: 'template-2', name: 'Estimated Hours', type: 'number', value: 0 },
    { id: 'template-3', name: 'Category', type: 'select', options: ['Development', 'Design', 'Testing', 'Documentation'], value: '' },
  ],
  user: null,
  isAuthenticated: false,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt' | 'activityLog'>>) => {
      const id = `task-${Date.now()}`;
      const newTask: Task = {
        ...action.payload,
        id,
        createdAt: new Date().toISOString(),
        activityLog: [{
          id: `log-${Date.now()}`,
          action: 'created',
          details: 'Task created',
          timestamp: new Date().toISOString(),
          userId: state.user?.uid || 'anonymous',
          userName: state.user?.displayName || 'Anonymous User',
        }],
      };
      
      state.tasks[id] = newTask;
      const column = Object.values(state.columns).find(col => 
        col.title.toLowerCase().replace(' ', '') === action.payload.status
      );
      if (column) {
        column.taskIds.push(id);
      }
      
      saveStateToStorage(state);
    },
    
    updateTask: (state, action: PayloadAction<{ taskId: string; updates: Partial<Task> }>) => {
      const { taskId, updates } = action.payload;
      const task = state.tasks[taskId];
      
      if (task) {
        Object.assign(task, updates);
        
        task.activityLog.push({
          id: `log-${Date.now()}`,
          action: 'updated',
          details: `Task updated: ${Object.keys(updates).join(', ')}`,
          timestamp: new Date().toISOString(),
          userId: state.user?.uid || 'anonymous',
          userName: state.user?.displayName || 'Anonymous User',
        });
        
        saveStateToStorage(state);
      }
    },
    
    addSubtask: (state, action: PayloadAction<{ taskId: string; subtask: Omit<Subtask, 'id' | 'createdAt'> }>) => {
      const { taskId, subtask } = action.payload;
      const task = state.tasks[taskId];
      
      if (task) {
        const newSubtask: Subtask = {
          ...subtask,
          id: `sub-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        
        task.subtasks.push(newSubtask);
        
        task.activityLog.push({
          id: `log-${Date.now()}`,
          action: 'subtask_added',
          details: `Subtask added: ${subtask.title}`,
          timestamp: new Date().toISOString(),
          userId: state.user?.uid || 'anonymous',
          userName: state.user?.displayName || 'Anonymous User',
        });
        
        saveStateToStorage(state);
      }
    },
    
    toggleSubtask: (state, action: PayloadAction<{ taskId: string; subtaskId: string }>) => {
      const { taskId, subtaskId } = action.payload;
      const task = state.tasks[taskId];
      
      if (task) {
        const subtask = task.subtasks.find(s => s.id === subtaskId);
        if (subtask) {
          subtask.completed = !subtask.completed;
          
          task.activityLog.push({
            id: `log-${Date.now()}`,
            action: 'subtask_updated',
            details: `Subtask ${subtask.completed ? 'completed' : 'uncompleted'}: ${subtask.title}`,
            timestamp: new Date().toISOString(),
            userId: state.user?.uid || 'anonymous',
            userName: state.user?.displayName || 'Anonymous User',
          });
          
          saveStateToStorage(state);
        }
      }
    },
    
    updateCustomField: (state, action: PayloadAction<{ taskId: string; fieldId: string; value: any }>) => {
      const { taskId, fieldId, value } = action.payload;
      const task = state.tasks[taskId];
      
      if (task) {
        const field = task.customFields.find(f => f.id === fieldId);
        if (field) {
          field.value = value;
          
          task.activityLog.push({
            id: `log-${Date.now()}`,
            action: 'custom_field_updated',
            details: `Custom field updated: ${field.name} = ${value}`,
            timestamp: new Date().toISOString(),
            userId: state.user?.uid || 'anonymous',
            userName: state.user?.displayName || 'Anonymous User',
          });
          
          saveStateToStorage(state);
        }
      }
    },
    
    addCustomFieldTemplate: (state, action: PayloadAction<Omit<CustomField, 'id'>>) => {
      const newTemplate: CustomField = {
        ...action.payload,
        id: `template-${Date.now()}`,
      };
      state.customFieldTemplates.push(newTemplate);
      saveStateToStorage(state);
    },
    
    moveTask: (state, action: PayloadAction<{
      taskId: string;
      sourceColumnId: string;
      destinationColumnId: string;
      sourceIndex: number;
      destinationIndex: number;
    }>) => {
      const { taskId, sourceColumnId, destinationColumnId, sourceIndex, destinationIndex } = action.payload;
      
      state.columns[sourceColumnId].taskIds.splice(sourceIndex, 1);
      
      state.columns[destinationColumnId].taskIds.splice(destinationIndex, 0, taskId);
      
      const newStatus = destinationColumnId === 'column-1' ? 'todo' : 
                       destinationColumnId === 'column-2' ? 'inprogress' : 'done';
      const task = state.tasks[taskId];
      if (task) {
        task.status = newStatus;
        
        task.activityLog.push({
          id: `log-${Date.now()}`,
          action: 'moved',
          details: `Task moved to ${state.columns[destinationColumnId].title}`,
          timestamp: new Date().toISOString(),
          userId: state.user?.uid || 'anonymous',
          userName: state.user?.displayName || 'Anonymous User',
        });
      }
      
      saveStateToStorage(state);
    },
    
    reorderTasks: (state, action: PayloadAction<{
      columnId: string;
      sourceIndex: number;
      destinationIndex: number;
    }>) => {
      const { columnId, sourceIndex, destinationIndex } = action.payload;
      const column = state.columns[columnId];
      const [removed] = column.taskIds.splice(sourceIndex, 1);
      column.taskIds.splice(destinationIndex, 0, removed);
      
      saveStateToStorage(state);
    },
    
    setFilter: (state, action: PayloadAction<{ 
      priority?: string; 
      search?: string; 
      assignee?: string; 
      dueDate?: string; 
    }>) => {
      if (action.payload.priority !== undefined) {
        state.filter.priority = action.payload.priority;
      }
      if (action.payload.search !== undefined) {
        state.filter.search = action.payload.search;
      }
      if (action.payload.assignee !== undefined) {
        state.filter.assignee = action.payload.assignee;
      }
      if (action.payload.dueDate !== undefined) {
        state.filter.dueDate = action.payload.dueDate;
      }
      
      saveStateToStorage(state);
    },
    
    deleteTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      const task = state.tasks[taskId];
      
      if (task) {
        delete state.tasks[taskId];
        
        Object.values(state.columns).forEach(column => {
          const index = column.taskIds.indexOf(taskId);
          if (index > -1) {
            column.taskIds.splice(index, 1);
          }
        });
      }
      
      saveStateToStorage(state);
    },
    
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    
    syncTaskUpdate: (state, action: PayloadAction<any>) => {
      const { taskId, updates } = action.payload;
      const task = state.tasks[taskId];
      if (task) {
        Object.assign(task, updates);
      }
    },
    
    syncTaskMove: (state, action: PayloadAction<any>) => {
      const { taskId, sourceColumnId, destinationColumnId, sourceIndex, destinationIndex } = action.payload;
      
      state.columns[sourceColumnId].taskIds.splice(sourceIndex, 1);
      
      state.columns[destinationColumnId].taskIds.splice(destinationIndex, 0, taskId);
      
      const newStatus = destinationColumnId === 'column-1' ? 'todo' : 
                       destinationColumnId === 'column-2' ? 'inprogress' : 'done';
      const task = state.tasks[taskId];
      if (task) {
        task.status = newStatus;
      }
    },
    
    syncTaskAdd: (state, action: PayloadAction<any>) => {
      const task = action.payload;
      state.tasks[task.id] = task;
      
      const column = Object.values(state.columns).find(col => 
        col.title.toLowerCase().replace(' ', '') === task.status
      );
      if (column) {
        column.taskIds.push(task.id);
      }
    },
    
    syncTaskDelete: (state, action: PayloadAction<{ taskId: string }>) => {
      const { taskId } = action.payload;
      
      if (state.tasks[taskId]) {
        delete state.tasks[taskId];
        
        Object.values(state.columns).forEach(column => {
          const index = column.taskIds.indexOf(taskId);
          if (index > -1) {
            column.taskIds.splice(index, 1);
          }
        });
      }
    },
  },
});

export const { 
  addTask, 
  updateTask, 
  addSubtask, 
  toggleSubtask, 
  updateCustomField, 
  addCustomFieldTemplate, 
  moveTask, 
  reorderTasks, 
  setFilter, 
  deleteTask, 
  setUser,
  syncTaskUpdate,
  syncTaskMove,
  syncTaskAdd,
  syncTaskDelete
} = taskSlice.actions;
export default taskSlice.reducer;