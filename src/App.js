import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components
import Navbar from './Components/Navbar.js';
import Home from './Components/Home/Home.js';
import Footer from './Components/Footer.js';
import Main from './Components/Calender/Calender.js';
import Projects from './Components/Projects/Projects.js';

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
          
          {/* Projects Route - Fixed to match navbar navigation */}
          <Route path="/TaskFlow" element={<Projects />} />
          
          {/* Add more routes here as needed */}
          {/* 
          <Route path="/my-tasks" element={<MyTasks />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          */}
        </Routes>
        
        {/* Footer - will be on all pages */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;