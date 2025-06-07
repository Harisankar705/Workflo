import React, { useState } from 'react';
import { MessageCircle, Paperclip, MoreHorizontal, Calendar, CheckSquare } from 'lucide-react';
import { Task } from '../types';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import TaskDetailsModal from './TaskDetailsModal';

interface TaskCardProps {
  task: Task;
  onDelete?: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-600 border-l-red-500';
      case 'medium':
        return 'bg-yellow-100 text-yellow-600 border-l-yellow-500';
      case 'low':
        return 'bg-green-100 text-green-600 border-l-green-500';
      case 'completed':
        return 'bg-teal-100 text-teal-600 border-l-teal-500';
      default:
        return 'bg-gray-100 text-gray-600 border-l-gray-500';
    }
  };

  const getDueDateColor = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const tomorrow = addDays(now, 1);

    if (isBefore(due, now)) {
      return 'text-red-600 bg-red-50'; 
    } else if (isBefore(due, tomorrow)) {
      return 'text-orange-600 bg-orange-50'; 
    } else {
      return 'text-gray-600 bg-gray-50'; 
    }
  };

  const getUserAvatars = (assignees: string[]) => {
    const colors = ['bg-teal-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
    return assignees.slice(0, 3).map((assignee, index) => (
      <div
        key={assignee}
        className={`w-6 h-6 rounded-full ${colors[index % colors.length]} flex items-center justify-center text-xs text-white font-medium -ml-1 first:ml-0 border-2 border-white`}
      >
        {assignee.slice(-1).toUpperCase()}
      </div>
    ));
  };

  const completedSubtasks = task.subtasks.filter(s => s.completed).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <>
      <div 
        className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="flex items-start justify-between mb-3">
          <span className={`px-2 py-1 rounded text-xs font-medium border-l-4 ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <button 
            className="text-gray-400 hover:text-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete) onDelete(task.id);
            }}
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>
        
        {task.dueDate && (
          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium mb-3 ${getDueDateColor(task.dueDate)}`}>
            <Calendar size={12} />
            <span>{format(new Date(task.dueDate), 'MMM dd')}</span>
          </div>
        )}

        {totalSubtasks > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <div className="flex items-center space-x-1">
                <CheckSquare size={12} />
                <span>Subtasks</span>
              </div>
              <span>{completedSubtasks}/{totalSubtasks}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-teal-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {task.customFields.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {task.customFields.slice(0, 2).map((field) => (
                <span key={field.id} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                  {field.name}: {field.value}
                </span>
              ))}
              {task.customFields.length > 2 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                  +{task.customFields.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getUserAvatars(task.assignees)}
            {task.assignees.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium -ml-1 border-2 border-white">
                +{task.assignees.length - 3}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3 text-gray-500">
            {task.comments > 0 && (
              <div className="flex items-center space-x-1 text-xs">
                <MessageCircle size={12} />
                <span>{task.comments}</span>
              </div>
            )}
            {task.files > 0 && (
              <div className="flex items-center space-x-1 text-xs">
                <Paperclip size={12} />
                <span>{task.files}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <TaskDetailsModal
        task={task}
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
      />
    </>
  );
};

export default TaskCard;