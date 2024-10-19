import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2024 Collaborgators. All Rights Reserved.</p>
        <p className="mt-2 text-sm text-gray-400">Connecting UF students with collaboration opportunities.</p>
        <div className="mt-4">
          <Link to="/about" className="text-blue-500 hover:underline mx-2">About Us</Link>
          <Link to="/terms-of-service" className="text-blue-500 hover:underline mx-2">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;