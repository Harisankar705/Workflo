import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import { Task, Column as ColumnType } from '../types';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onAddTask: (status: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ column, tasks, onAddTask, onDeleteTask }) => {
  const getColumnColor = (title: string) => {
    switch (title.toLowerCase()) {
      case 'to do':
        return 'border-teal-500';
      case 'on progress':
        return 'border-yellow-500';
      case 'done':
        return 'border-green-500';
      default:
        return 'border-gray-500';
    }
  };

  const getStatusKey = (title: string) => {
    switch (title.toLowerCase()) {
      case 'to do':
        return 'todo';
      case 'on progress':
        return 'inprogress';
      case 'done':
        return 'done';
      default:
        return 'todo';
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 w-80 min-h-96">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full border-2 ${getColumnColor(column.title)}`} />
          <h2 className="font-semibold text-gray-900">{column.title}</h2>
          <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(getStatusKey(column.title))}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 min-h-64 ${
              snapshot.isDraggingOver ? 'bg-teal-50 border-2 border-dashed border-teal-300 rounded-lg p-2' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${
                      snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
                    } transition-transform`}
                  >
                    <TaskCard task={task} onDelete={onDeleteTask} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;