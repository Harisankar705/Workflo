import React from 'react';
import { 
  Home, 
  MessageCircle, 
  CheckSquare, 
  Users, 
  Settings, 
  Plus,
  Clock,
  Edit3,
  Lightbulb
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: Home, label: 'Home', active: false },
    { icon: MessageCircle, label: 'Messages', active: false },
    { icon: CheckSquare, label: 'Tasks', active: true },
    { icon: Users, label: 'Members', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  const projects = [
    { name: 'Mobile App', color: 'bg-green-500', active: true },
    { name: 'Website Redesign', color: 'bg-orange-500', active: false },
    { name: 'Design System', color: 'bg-purple-500', active: false },
    { name: 'Wireframes', color: 'bg-teal-500', active: false },
  ];

  return (
    <div className="w-64 bg-white h-full border-r border-gray-200 flex flex-col">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">PM</span>
        </div>
        <span className="font-semibold text-gray-900">Project M.</span>
      </div>

      <nav className="px-4 space-y-1">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
              item.active 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            MY PROJECTS
          </h3>
          <button className="text-gray-400 hover:text-gray-600">
            <Plus size={16} />
          </button>
        </div>
        
        <div className="space-y-2">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                project.active ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${project.color}`} />
              <span className={`text-sm ${project.active ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                {project.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-8 p-4 bg-yellow-50 rounded-xl">
        <div className="flex items-center space-x-2 mb-2">
          <Lightbulb className="text-yellow-600" size={20} />
          <span className="font-semibold text-gray-900">Thoughts Time</span>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          We don't have any notice for you, till then you can share your thoughts with your peers.
        </p>
        <button className="w-full bg-white text-gray-700 text-sm font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
          Write a message
        </button>
      </div>
    </div>
  );
};

export default Sidebar;