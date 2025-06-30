import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components
import Navbar from './Components/Navbar.js';
import Home from './Components/Home/Home.js';
import Footer from './Components/Footer.js';
import Main from './Components/Calender/Calender.js'; // Import


// Import your hero image from assets

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar - will be on all pages */}
        <Navbar />
        
        {/* Routes for different pages */}
        <Routes>
          {/* Home Page Route */}
          <Route 
            path="/" 
            element={
              <>
                <Home  />
                <Footer />
              </>
            } 
          />
          <Route 
            path="/main" 
            element={
              <>
                <Main />
                <Footer />
              </>
            } 
          />
      
          
          {/* Add more routes here as needed */}
          {/* 
          <Route path="/cart" element={<><CartPage /><Footer /></>} />
          <Route path="/shop" element={<><ShopPage /><Footer /></>} />
          */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;