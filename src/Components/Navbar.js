import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckSquare, BarChart3, FolderOpen, User } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();

  // Function to handle navigation using React Router
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Function to handle logo click (go to home)
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-xl border-b border-blue-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <div 
            className="flex items-center cursor-pointer group transition-all duration-200 hover:scale-105" 
            onClick={handleLogoClick}
          >
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg shadow-lg group-hover:shadow-blue-500/25 transition-all duration-200">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
            <span className="text-white text-xl font-bold ml-3 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Taskily
            </span>
          </div>

          {/* Center: Navigation Menu */}
          <div className="hidden md:flex space-x-1">
            <button
              onClick={() => handleNavigation('/main')}
              className="text-blue-200 hover:text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200 hover:bg-blue-800/30 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </button>
            
            <button
              onClick={() => handleNavigation('/my-tasks')}
              className="text-blue-200 hover:text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200 hover:bg-blue-800/30 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              My Tasks
            </button>
            
            <button
              onClick={() => handleNavigation('/TaskFlow')}
              className="text-blue-200 hover:text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200 hover:bg-blue-800/30 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Projects
            </button>
          </div>

          {/* Right: Login/Sign Up */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleNavigation('/login')}
              className="text-blue-200 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-800/30"
            >
              Login
            </button>
            
            <button
              onClick={() => handleNavigation('/signup')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200 shadow-lg hover:shadow-blue-500/25 hover:scale-105"
            >
              <User className="w-4 h-4 mr-2" />
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-blue-200 hover:text-white p-2 rounded-lg transition-all duration-200 hover:bg-blue-800/30">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}