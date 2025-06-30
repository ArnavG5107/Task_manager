import React, { useState } from 'react';
import { Plus, Search, Check, Edit, Trash2, ChevronDown } from 'lucide-react';

export default function TaskilyHero() {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDetail, setTaskDetail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('By category');
  const [selectedPriority, setSelectedPriority] = useState('By priority');

  // Sample tasks data
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Learn Javascript',
      description: 'Master the language powering the modern web.',
      startDate: '07-07-2023',
      completed: false
    },
    {
      id: 2,
      title: 'Learn Javascript',
      description: 'Master the language powering the modern web.',
      startDate: '07-07-2023',
      completed: false
    },
    {
      id: 3,
      title: 'Learn Javascript',
      description: 'Master the language powering the modern web.',
      startDate: '07-07-2023',
      completed: false
    },
    {
      id: 4,
      title: 'Learn Javascript',
      description: 'Master the language powering the modern web.',
      startDate: '07-07-2023',
      completed: false
    }
  ]);

  // Calendar data
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const currentDay = currentDate.getDate();

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentDate.getMonth(), 1);
    const lastDay = new Date(currentYear, currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Previous month days
    for (let i = startingDay - 1; i >= 0; i--) {
      const prevDate = new Date(currentYear, currentDate.getMonth(), -i);
      days.push({
        day: prevDate.getDate(),
        isCurrentMonth: false,
        isSelected: false
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isSelected: day === currentDay
      });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isSelected: false
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const handleAddTask = () => {
    if (taskTitle.trim()) {
      const newTask = {
        id: tasks.length + 1,
        title: taskTitle,
        description: taskDetail || 'No description provided',
        startDate: new Date().toLocaleDateString('en-GB'),
        completed: false
      };
      setTasks([...tasks, newTask]);
      setTaskTitle('');
      setTaskDetail('');
    }
  };

  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Left - Calendar */}
          <div className="lg:w-1/3 bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-rose-400 mb-2">Sunday</h2>
              <h3 className="text-3xl font-bold text-gray-800">04, April 2024</h3>
            </div>
            
            <div className="calendar">
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-gray-700">{currentMonth}</h4>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500 mb-2">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                  <div key={day} className="p-2">{day}</div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => (
                  <div
                    key={index}
                    className={`p-2 text-center text-sm cursor-pointer rounded-lg transition-colors ${
                      date.isSelected
                        ? 'bg-gray-800 text-white'
                        : date.isCurrentMonth
                        ? 'text-gray-800 hover:bg-gray-100'
                        : 'text-gray-400'
                    }`}
                  >
                    {date.day}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right - Task Input */}
          <div className="lg:w-2/3">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="text"
                placeholder="Type Title Of Task"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="flex-1 px-4 py-3 bg-blue-100 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
              <input
                type="text"
                placeholder="Detail Of Your Task"
                value={taskDetail}
                onChange={(e) => setTaskDetail(e.target.value)}
                className="flex-1 px-4 py-3 bg-blue-100 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
              <button
                onClick={handleAddTask}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="relative">
                <select className="px-4 py-2 bg-orange-200 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none pr-8">
                  <option>By category</option>
                  <option>Work</option>
                  <option>Personal</option>
                  <option>Study</option>
                </select>
                <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-600 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select className="px-4 py-2 bg-orange-200 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none pr-8">
                  <option>By priority</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-600 pointer-events-none" />
              </div>
              
              <div className="relative flex-1 min-w-64">
                <input
                  type="text"
                  placeholder="Search by name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {tasks.map((task) => (
            <div key={task.id} className="bg-orange-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{task.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                  <p className="text-gray-700 font-medium">
                    <span className="font-semibold">Start date:</span> {task.startDate}
                  </p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      task.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mb-8">
          <button className="px-8 py-3 border-2 border-orange-400 text-orange-600 rounded-lg hover:bg-orange-400 hover:text-white transition-colors font-medium">
            Load more
          </button>
        </div>

        {/* Bottom Stats */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Task Stats */}
          <div className="flex gap-6">
            <div className="bg-orange-200 rounded-xl p-6 text-center min-w-48">
              <h4 className="text-sm font-medium text-gray-600 mb-2">COMPLETED TASKS</h4>
              <p className="text-4xl font-bold text-gray-800">{completedTasks.toString().padStart(2, '0')}</p>
            </div>
            
            <div className="bg-rose-200 rounded-xl p-6 text-center min-w-48">
              <h4 className="text-sm font-medium text-gray-600 mb-2">PENDING TASKS</h4>
              <p className="text-4xl font-bold text-gray-800">{pendingTasks}</p>
            </div>
          </div>

          {/* User Stats */}
          <div className="flex-1 bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-blue-500 font-medium mb-2">Tasks created</h4>
                <p className="text-4xl font-bold text-gray-800">1,500</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600 mb-2">
                  <span className="text-2xl font-bold text-blue-500">25k+</span> Active Users
                </p>
                <div className="flex -space-x-2">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&rounded=full" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face&rounded=full" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face&rounded=full" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
                  <img src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=32&h=32&fit=crop&crop=face&rounded=full" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}