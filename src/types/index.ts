export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  userId: string;
  userName: string;
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'select' | 'number' | 'date';
  options?: string[];
  value: any;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'todo' | 'inprogress' | 'done';
  assignees: string[];
  comments: number;
  files: number;
  createdAt: string;
  dueDate?: string;
  reminderSet?: boolean;
  subtasks: Subtask[];
  customFields: CustomField[];
  activityLog: ActivityLog[];
  createdBy: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface TaskState {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
  filter: {
    priority: string;
    search: string;
    assignee: string;
    dueDate: string;
  };
  customFieldTemplates: CustomField[];
  user: User | null;
  isAuthenticated: boolean;
}

export interface NotificationState {
  notifications: Array<{
    id: string;
    type: 'due-date' | 'overdue' | 'reminder';
    taskId: string;
    taskTitle: string;
    message: string;
    timestamp: string;
    read: boolean;
  }>;
}