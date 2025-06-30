import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components
import Navbar from './Components/Navbar.js';
import Home from './Components/Home/Home.js';
import Footer from './Components/Footer.js';
import Main from './Components/Calender/Calender.js';
import Projects from './Components/Projects/Projects.js';
import TaskManager from './Components/tasks/TaskManager.js';
import { Login, Register } from './Components/Auth/Auth.js'; // New import for auth components

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar - will be on all pages */}
        <Navbar />
        
        {/* Routes for different pages */}
        <Routes>
          {/* Home Page Route */}
          <Route path="/" element={<Home />} />
          
          {/* Calendar/Main Route */}
          <Route path="/main" element={<Main />} />
          
          {/* Projects Route */}
          <Route path="/TaskFlow" element={<Projects />} />
          
          {/* Task Manager Route */}
          <Route path="/TaskManager" element={<TaskManager />} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
        </Routes>
        
        {/* Footer - will be on all pages */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;