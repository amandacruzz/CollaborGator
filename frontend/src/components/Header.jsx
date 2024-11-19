import React from 'react';
import '../index.css';
import { Link } from 'react-router-dom';


const Header = () => {
    return (
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-blue-600">CollaborGators</h1>
          <ul className="flex space-x-6 text-gray-700">
            <li>
              <Link to="/" className="hover:text-blue-600 transition-colors cursor-pointer">Home</Link>
            </li>
            <li>
              <Link to="/projects" className="hover:text-blue-600 transition-colors cursor-pointer">Projects</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-600 transition-colors cursor-pointer">About Us</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  };
  
  export default Header;