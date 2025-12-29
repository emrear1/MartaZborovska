import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Booking from './pages/Booking';
import About from './pages/About';
import Admin from './pages/Admin';
import Portfolio from './pages/Portfolio';
import Reels from './pages/Reels';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
        <Toaster position="top-center" />
      </div>
    </Router>
  );
}

export default App;

