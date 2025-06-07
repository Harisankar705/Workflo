import React, { useState } from 'react';
import { X, Plus, Check, Calendar, User, Tag, Clock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import { Task, Subtask, CustomField } from '../types';
import { updateTask, addSubtask, toggleSubtask, updateCustomField } from '../store/taskSlice';
import { RootState } from '../store';
import "react-datepicker/dist/react-datepicker.css";

interface TaskDetailsModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { customFieldTemplates } = useSelector((state: RootState) => state.tasks);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showActivityLog, setShowActivityLog] = useState(false);

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      dispatch(addSubtask({
        taskId: task.id,
        subtask: {
          title: newSubtaskTitle.trim(),
          completed: false,
        }
      }));
      setNewSubtaskTitle('');
    }
  };

  const handleToggleSubtask = (subtaskId: string) => {
    dispatch(toggleSubtask({ taskId: task.id, subtaskId }));
  };

  const handleUpdateDueDate = (date: Date | null) => {
    dispatch(updateTask({
      taskId: task.id,
      updates: { dueDate: date?.toISOString() }
    }));
  };

  const handleToggleReminder = () => {
    dispatch(updateTask({
      taskId: task.id,
      updates: { reminderSet: !task.reminderSet }
    }));
  };

  const handleCustomFieldUpdate = (fieldId: string, value: any) => {
    dispatch(updateCustomField({ taskId: task.id, fieldId, value }));
  };

  const addCustomFieldToTask = (template: CustomField) => {
    const newField: CustomField = {
      ...template,
      id: `cf-${Date.now()}`,
      value: template.type === 'select' ? template.options?.[0] || '' : 
             template.type === 'number' ? 0 : 
             template.type === 'date' ? new Date().toISOString() : ''
    };

    dispatch(updateTask({
      taskId: task.id,
      updates: {
        customFields: [...task.customFields, newField]
      }
    }));
  };

  if (!isOpen) return null;

  const completedSubtasks = task.subtasks.filter(s => s.completed).length;
  const progressPercentage = task.subtasks.length > 0 ? (completedSubtasks / task.subtasks.length) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{task.description}</p>
            </div>

            {/* Subtasks */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Subtasks ({completedSubtasks}/{task.subtasks.length})
                </h3>
                {task.subtasks.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-4">
                {task.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    <button
                      onClick={() => handleToggleSubtask(subtask.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        subtask.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {subtask.completed && <Check size={12} />}
                    </button>
                    <span className={`flex-1 ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="Add a subtask..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                />
                <button
                  onClick={handleAddSubtask}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Custom Fields */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Custom Fields</h3>
              
              {task.customFields.map((field) => (
                <div key={field.id} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.name}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={field.value}
                      onChange={(e) => handleCustomFieldUpdate(field.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {field.options?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : field.type === 'number' ? (
                    <input
                      type="number"
                      value={field.value}
                      onChange={(e) => handleCustomFieldUpdate(field.id, parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  ) : field.type === 'date' ? (
                    <DatePicker
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date) => handleCustomFieldUpdate(field.id, date?.toISOString())}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  ) : (
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => handleCustomFieldUpdate(field.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  )}
                </div>
              ))}

              {/* Add Custom Field */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Add Custom Field</h4>
                <div className="flex flex-wrap gap-2">
                  {customFieldTemplates
                    .filter(template => !task.customFields.some(field => field.name === template.name))
                    .map((template) => (
                    <button
                      key={template.id}
                      onClick={() => addCustomFieldToTask(template)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      <Plus size={12} className="inline mr-1" />
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div>
              <button
                onClick={() => setShowActivityLog(!showActivityLog)}
                className="flex items-center space-x-2 text-lg font-semibold mb-4 hover:text-teal-600"
              >
                <Clock size={20} />
                <span>Activity Log ({task.activityLog.length})</span>
              </button>

              {showActivityLog && (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {task.activityLog.map((log) => (
                    <div key={log.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {log.userName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{log.userName}</span> {log.details}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Due Date */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Calendar size={20} className="mr-2" />
                Due Date
              </h3>
              <DatePicker
                selected={task.dueDate ? new Date(task.dueDate) : null}
                onChange={handleUpdateDueDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholderText="Set due date..."
              />
              
              {task.dueDate && (
                <div className="mt-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={task.reminderSet || false}
                      onChange={handleToggleReminder}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">Set reminder</span>
                  </label>
                </div>
              )}
            </div>

            {/* Priority */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Tag size={20} className="mr-2" />
                Priority
              </h3>
              <select
                value={task.priority}
                onChange={(e) => dispatch(updateTask({
                  taskId: task.id,
                  updates: { priority: e.target.value as 'High' | 'Medium' | 'Low' }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Assignees */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <User size={20} className="mr-2" />
                Assignees
              </h3>
              <div className="flex flex-wrap gap-2">
                {task.assignees.map((assignee, index) => {
                  const colors = ['bg-teal-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
                  return (
                    <div
                      key={assignee}
                      className={`w-8 h-8 rounded-full ${colors[index % colors.length]} flex items-center justify-center text-white text-sm font-medium`}
                    >
                      {assignee.slice(-1).toUpperCase()}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Comments:</span>
                  <span className="font-medium">{task.comments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Files:</span>
                  <span className="font-medium">{task.files}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;