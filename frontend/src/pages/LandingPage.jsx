import { useState } from 'react';
import '../index.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LandingPage = () => {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-500 to-blue-700 text-white text-center">
        <h1 className="text-5xl font-extrabold mb-4">Welcome to Collaborgators!</h1>
        <p className="text-lg mb-8">Connecting UF students with collaboration opportunities.</p>
        <button 
          onClick={() => scrollToSection('signInSection')}
          className="bg-white text-blue-500 hover:bg-gray-200 transition-colors px-6 py-3 rounded-full font-semibold"
        >
          Get Started
        </button>
      </div>

      {/* Sign In Section */}
      <div id="signInSection" className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-16">
        <h2 className="text-3xl font-bold mb-4">Sign In or Create an Account</h2>
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <form className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <button 
              type="submit" 
              className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg font-semibold"
            >
              Sign In
            </button>
            <div className="text-center">
              <p className="text-sm text-gray-600">or</p>
              <button 
                type="button" 
                className="bg-red-500 text-white hover:bg-red-600 transition-colors px-4 py-2 rounded-lg font-semibold mt-2"
              >
                Sign In with Google
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Create one</a></p>
          </div>
        </div>
      </div>

      {/* Additional Content Section */}
      <div id="aboutSection" className="min-h-screen flex flex-col justify-center items-center bg-gray-200 py-16">
        <h2 className="text-3xl font-bold mb-4">About Collaborgators</h2>
        <p className="text-center max-w-2xl text-lg text-gray-700 mb-4">
          Collaborgators is a platform designed to help UF students find collaborators for their projects and startups. We believe in the power of teamwork and creativity, and we aim to foster a vibrant community of innovators.
        </p>
        <button 
          onClick={() => scrollToSection('signInSection')}
          className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-6 py-3 rounded-full font-semibold"
        >
          Join Us Now!
        </button>
      </div>

      <Footer />
    </>
  );
};

export default LandingPage;
