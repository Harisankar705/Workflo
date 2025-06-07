import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { 
  Search, 
  Filter, 
  Calendar, 
  Share2, 
  Plus, 
  Users,
  Bell,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { RootState } from '../store';
import { moveTask, reorderTasks, addTask, setFilter, deleteTask } from '../store/taskSlice';
import { clearUser } from '../store/authSlice';
import { useSocket } from '../hooks/useSocket';
import { useNotifications } from '../hooks/useNotifications';
import Column from './Column';
import AddTaskModal from './AddTaskModal';
import NotificationBanner from './NotificationBanner';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { tasks, columns, columnOrder, filter } = useSelector((state: RootState) => state.tasks);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState('todo');
  const [searchQuery, setSearchQuery] = useState('');

  const { emitTaskMove, emitTaskAdd, emitTaskDelete } = useSocket(user?.uid || null);
  useNotifications();

  const filteredTasks = useMemo(() => {
    const filtered: Record<string, any> = {};
    
    Object.entries(tasks).forEach(([taskId, task]) => {
      let shouldInclude = true;
      
      if (filter.priority && filter.priority !== 'all' && task.priority.toLowerCase() !== filter.priority.toLowerCase()) {
        shouldInclude = false;
      }
      
      if (filter.assignee && !task.assignees.includes(filter.assignee)) {
        shouldInclude = false;
      }
      
      if (filter.dueDate) {
        const now = new Date();
        const taskDueDate = task.dueDate ? new Date(task.dueDate) : null;
        
        switch (filter.dueDate) {
          case 'overdue':
            if (!taskDueDate || taskDueDate >= now) shouldInclude = false;
            break;
          case 'today':
            if (!taskDueDate || taskDueDate.toDateString() !== now.toDateString()) shouldInclude = false;
            break;
          case 'week':
            const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            if (!taskDueDate || taskDueDate > weekFromNow) shouldInclude = false;
            break;
        }
      }
      
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (!task.title.toLowerCase().includes(query) && 
            !task.description.toLowerCase().includes(query)) {
          shouldInclude = false;
        }
      }
      
      if (shouldInclude) {
        filtered[taskId] = task;
      }
    });
    
    return filtered;
  }, [tasks, filter, searchQuery]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const moveData = {
      taskId: draggableId,
      sourceColumnId: source.droppableId,
      destinationColumnId: destination.droppableId,
      sourceIndex: source.index,
      destinationIndex: destination.index,
    };

    if (source.droppableId === destination.droppableId) {
      dispatch(reorderTasks({
        columnId: source.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
      }));
    } else {
      dispatch(moveTask(moveData));
      emitTaskMove(moveData);
    }
  };

  const handleAddTask = (task: any) => {
    dispatch(addTask(task));
    emitTaskAdd(task);
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteTask(taskId));
    emitTaskDelete(taskId);
  };

  const openAddModal = (status: string) => {
    setNewTaskStatus(status);
    setShowAddModal(true);
  };

  const handlePriorityFilter = (priority: string) => {
    dispatch(setFilter({ priority }));
  };

  const handleAssigneeFilter = (assignee: string) => {
    dispatch(setFilter({ assignee }));
  };

  const handleDueDateFilter = (dueDate: string) => {
    dispatch(setFilter({ dueDate }));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const uniqueAssignees = Array.from(new Set(Object.values(tasks).flatMap(task => task.assignees)));

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">Mobile App</h1>
              <div className="flex items-center space-x-1">
                <button className="text-purple-600 hover:text-purple-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button className="text-purple-600 hover:text-purple-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            <button className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors">
              <Users size={16} className="inline mr-1" />
              Invite
            </button>
            
            <div className="flex -space-x-2">
              {uniqueAssignees.slice(0, 4).map((assignee, i) => {
                const colors = ['bg-teal-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
                return (
                  <div key={assignee} className={`w-8 h-8 ${colors[i % colors.length]} rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium`}>
                    {assignee.slice(-1).toUpperCase()}
                  </div>
                );
              })}
              {uniqueAssignees.length > 4 && (
                <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-gray-600 text-xs font-medium">
                  +{uniqueAssignees.length - 4}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <Bell size={20} />
            </button>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">
                {user?.displayName || 'User'}
              </span>
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.displayName?.charAt(0) || 'U'}
              </div>
              <button
                onClick={handleLogout}
                className="p-1 text-gray-600 hover:text-gray-900"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-1 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={16} />
                <span className="text-sm">Filter</span>
                <ChevronDown size={12} />
              </button>
              
              <button className="flex items-center space-x-1 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar size={16} />
                <span className="text-sm">Today</span>
                <ChevronDown size={12} />
              </button>
            </div>

            {/* Priority Filter Buttons */}
            <div className="flex items-center space-x-2">
              {['All', 'High', 'Medium', 'Low'].map((priority) => (
                <button
                  key={priority}
                  onClick={() => handlePriorityFilter(priority === 'All' ? '' : priority)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    (priority === 'All' && !filter.priority) || filter.priority === priority
                      ? 'bg-teal-100 text-teal-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>

            {/* Assignee Filter */}
            <div className="flex items-center space-x-2">
              <select
                value={filter.assignee}
                onChange={(e) => handleAssigneeFilter(e.target.value)}
                className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border-0 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">All Assignees</option>
                {uniqueAssignees.map((assignee) => (
                  <option key={assignee} value={assignee}>{assignee}</option>
                ))}
              </select>
            </div>

            {/* Due Date Filter */}
            <div className="flex items-center space-x-2">
              {['Overdue', 'Today', 'This Week'].map((period) => {
                const value = period.toLowerCase().replace(' ', '');
                return (
                  <button
                    key={period}
                    onClick={() => handleDueDateFilter(filter.dueDate === value ? '' : value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filter.dueDate === value
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {period}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-1 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 size={16} />
              <span className="text-sm">Share</span>
            </button>
            
            <button 
              onClick={() => openAddModal('todo')}
              className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Banner */}
      <div className="px-6 pt-4">
        <NotificationBanner />
      </div>

      {/* Kanban Board */}
      <div className="p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex space-x-6 overflow-x-auto pb-4">
            {columnOrder.map((columnId) => {
              const column = columns[columnId];
              const columnTasks = column.taskIds
                .map((taskId) => filteredTasks[taskId])
                .filter(Boolean);

              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={columnTasks}
                  onAddTask={openAddModal}
                  onDeleteTask={handleDeleteTask}
                />
              );
            })}
          </div>
        </DragDropContext>
      </div>

      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddTask}
        initialStatus={newTaskStatus}
      />
    </div>
  );
};

export default Dashboard;