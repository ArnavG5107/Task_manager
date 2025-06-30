import React, { useState, useMemo } from 'react';
import { Plus, Search, ChevronDown, Edit3, Trash2, Calendar } from 'lucide-react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Learn JavaScript',
      description: 'Master the language powering the modern web.',
      category: 'Education',
      priority: 'High',
      startDate: '2023-07-07',
      completed: false
    },
    {
      id: 2,
      title: 'Build React Project',
      description: 'Create a comprehensive task management application.',
      category: 'Development',
      priority: 'High',
      startDate: '2023-08-15',
      completed: false
    },
    {
      id: 3,
      title: 'Review Code',
      description: 'Review pull requests and provide feedback.',
      category: 'Development',
      priority: 'Medium',
      startDate: '2023-09-01',
      completed: true
    },
    {
      id: 4,
      title: 'Team Meeting',
      description: 'Weekly sync with the development team.',
      category: 'Meetings',
      priority: 'Low',
      startDate: '2023-09-05',
      completed: false
    }
  ]);

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('category');
  const [sortByPriority, setSortByPriority] = useState('priority');

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    startDate: new Date().toISOString().split('T')[0]
  });

  const categories = ['Education', 'Development', 'Meetings', 'Personal', 'Work'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const priorityColors = {
    'Low': 'bg-blue-100 text-blue-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'High': 'bg-orange-100 text-orange-800',
    'Critical': 'bg-red-100 text-red-800'
  };

  const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };

  const addTask = () => {
    if (newTask.title.trim()) {
      const task = {
        ...newTask,
        id: Date.now(),
        completed: false
      };
      setTasks([...tasks, task]);
      setNewTask({
        title: '',
        description: '',
        category: '',
        priority: 'Medium',
        startDate: new Date().toISOString().split('T')[0]
      });
      setIsAddingTask(false);
    }
  };

  const updateTask = () => {
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    ));
    setEditingTask(null);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === 'category') {
      return filtered.reduce((acc, task) => {
        const category = task.category || 'Uncategorized';
        if (!acc[category]) acc[category] = [];
        acc[category].push(task);
        acc[category].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        return acc;
      }, {});
    } else {
      return filtered.reduce((acc, task) => {
        const priority = task.priority;
        if (!acc[priority]) acc[priority] = [];
        acc[priority].push(task);
        return acc;
      }, {});
    }
  }, [tasks, searchTerm, sortBy]);

  const TaskCard = ({ task }) => (
    <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 transition-all duration-200 hover:shadow-lg ${
      task.completed ? 'opacity-75 border-l-green-500' : 'border-l-blue-500'
    }`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleComplete(task.id)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <h3 className={`font-semibold text-lg ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {task.title}
          </h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setEditingTask(task)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 mb-3 text-sm">{task.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
            {task.category}
          </span>
        </div>
        <div className="flex items-center text-gray-500 text-xs">
          <Calendar size={12} className="mr-1" />
          {task.startDate}
        </div>
      </div>
    </div>
  );

  const TaskForm = ({ task, onSave, onCancel, isEditing }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-blue-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        {isEditing ? 'Edit Task' : 'Add New Task'}
      </h3>
      
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Task title"
          value={task.title}
          onChange={(e) => isEditing 
            ? setEditingTask({...task, title: e.target.value})
            : setNewTask({...task, title: e.target.value})
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <textarea
          placeholder="Task description"
          value={task.description}
          onChange={(e) => isEditing 
            ? setEditingTask({...task, description: e.target.value})
            : setNewTask({...task, description: e.target.value})
          }
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={task.category}
            onChange={(e) => isEditing 
              ? setEditingTask({...task, category: e.target.value})
              : setNewTask({...task, category: e.target.value})
            }
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <select
            value={task.priority}
            onChange={(e) => isEditing 
              ? setEditingTask({...task, priority: e.target.value})
              : setNewTask({...task, priority: e.target.value})
            }
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
          
          <input
            type="date"
            value={task.startDate}
            onChange={(e) => isEditing 
              ? setEditingTask({...task, startDate: e.target.value})
              : setNewTask({...task, startDate: e.target.value})
            }
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onSave}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            {isEditing ? 'Update' : 'Add'} Task
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Task Manager</h1>
          <p className="text-gray-600">Organize your tasks with priorities and categories</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-orange-100"
                >
                  <option value="category">Group by Category</option>
                  <option value="priority">Group by Priority</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={() => setIsAddingTask(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Add/Edit Task Form */}
        {(isAddingTask || editingTask) && (
          <div className="mb-6">
            <TaskForm
              task={editingTask || newTask}
              onSave={editingTask ? updateTask : addTask}
              onCancel={() => {
                setIsAddingTask(false);
                setEditingTask(null);
              }}
              isEditing={!!editingTask}
            />
          </div>
        )}

        {/* Tasks Display */}
        <div className="space-y-6">
          {Object.entries(filteredAndSortedTasks).map(([group, groupTasks]) => (
            <div key={group} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  {group}
                  <span className="ml-2 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                    {groupTasks.length}
                  </span>
                </h2>
              </div>
              <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groupTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {Object.keys(filteredAndSortedTasks).length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first task!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;