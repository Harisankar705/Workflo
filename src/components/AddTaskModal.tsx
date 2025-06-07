import React, { useState } from 'react';
import { X, Calendar, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import { Task, CustomField } from '../types';
import { RootState } from '../store';
import "react-datepicker/dist/react-datepicker.css";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id' | 'createdAt' | 'activityLog'>) => void;
  initialStatus: string;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAdd, initialStatus }) => {
  const { customFieldTemplates, user } = useSelector((state: RootState) => state.tasks);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [reminderSet, setReminderSet] = useState(false);
  const [selectedCustomFields, setSelectedCustomFields] = useState<CustomField[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim(),
      priority,
      status: initialStatus as 'todo' | 'inprogress' | 'done',
      assignees: ['user1', 'user2'], // Default assignees
      comments: 0,
      files: 0,
      dueDate: dueDate?.toISOString(),
      reminderSet,
      subtasks: [],
      customFields: selectedCustomFields,
      createdBy: user?.uid || 'anonymous',
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDueDate(null);
    setReminderSet(false);
    setSelectedCustomFields([]);
    onClose();
  };

  const addCustomField = (template: CustomField) => {
    const newField: CustomField = {
      ...template,
      id: `cf-${Date.now()}`,
      value: template.type === 'select' ? template.options?.[0] || '' : 
             template.type === 'number' ? 0 : 
             template.type === 'date' ? new Date().toISOString() : ''
    };
    setSelectedCustomFields([...selectedCustomFields, newField]);
  };

  const updateCustomFieldValue = (fieldId: string, value: any) => {
    setSelectedCustomFields(fields =>
      fields.map(field =>
        field.id === fieldId ? { ...field, value } : field
      )
    );
  };

  const removeCustomField = (fieldId: string) => {
    setSelectedCustomFields(fields => fields.filter(field => field.id !== fieldId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Add New Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Enter task title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              placeholder="Enter task description..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <DatePicker
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholderText="Select due date..."
                minDate={new Date()}
              />
            </div>
          </div>

          {dueDate && (
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={reminderSet}
                  onChange={(e) => setReminderSet(e.target.checked)}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">Set reminder for this task</span>
              </label>
            </div>
          )}

          {/* Custom Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Fields
            </label>
            
            {selectedCustomFields.map((field) => (
              <div key={field.id} className="mb-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{field.name}</span>
                  <button
                    type="button"
                    onClick={() => removeCustomField(field.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                {field.type === 'select' ? (
                  <select
                    value={field.value}
                    onChange={(e) => updateCustomFieldValue(field.id, e.target.value)}
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
                    onChange={(e) => updateCustomFieldValue(field.id, parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : field.type === 'date' ? (
                  <DatePicker
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => updateCustomFieldValue(field.id, date?.toISOString())}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => updateCustomFieldValue(field.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                )}
              </div>
            ))}

            <div className="flex flex-wrap gap-2">
              {customFieldTemplates
                .filter(template => !selectedCustomFields.some(field => field.name === template.name))
                .map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => addCustomField(template)}
                  className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm hover:bg-teal-200 transition-colors"
                >
                  <Plus size={12} className="inline mr-1" />
                  Add {template.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;