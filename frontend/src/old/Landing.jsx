import { useState } from 'react';
import { motion } from 'framer-motion'; // Import motion from framer-motion
import '../index.css';


const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/accounts/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,  // Corrected from `username` to `email`
          password: password,
        }),
      });
      
      const data = await response.json();

      if (response.ok) {
        setMessage("Login successful");
        // Redirect or additional actions can go here
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <motion.div
        className="h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-500 to-blue-700 text-white text-center"
        initial={{ opacity: 0, y: -50 }} // Initial state for animation
        animate={{ opacity: 1, y: 0 }} // Animation on load
        transition={{ duration: 1 }} // Slower duration of the animation
      >
        <motion.h1
          className="text-5xl font-extrabold mb-4 cursor-pointer hover:translate-y-1 hover:text-blue-300 transition-all duration-300" // Added hover effect
          whileHover={{ scale: 1.05 }} // Slightly scale on hover
        >
          Welcome to Collaborgators!
        </motion.h1>
        <p className="text-lg mb-8">Connecting UF students with collaboration opportunities.</p>
        <motion.button 
          onClick={() => scrollToSection('signInSection')}
          className="bg-white text-blue-500 hover:bg-gray-200 transition-colors px-6 py-3 rounded-full font-semibold"
          whileHover={{ scale: 1.1, rotate: 3 }} // Add a hover effect
        >
          Get Started
        </motion.button>
      </motion.div>

      {/* Sign In Section */}
      <motion.div
        id="signInSection"
        className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-16"
        initial={{ opacity: 0, scale: 0.9 }} // Initial state for animation
        animate={{ opacity: 1, scale: 1 }} // Animation on load
        transition={{ duration: 1 }} // Slower duration of the animation
      >
        <h2 className="text-3xl font-bold mb-4">Sign In or Create an Account</h2>
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <form onSubmit={handleLogin} className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <motion.button 
              type="submit" 
              className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg font-semibold"
              whileHover={{ scale: 1.05, backgroundColor: '#004080' }} // Slight scaling and color change
            >
              Sign In
            </motion.button>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {message && <p className="text-green-500 mt-2">{message}</p>}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Create one</a></p>
          </div>
        </div>
      </motion.div>

      {/* Additional Content Section */}
      <motion.div
        id="aboutSection"
        className="min-h-screen flex flex-col justify-center items-center bg-gray-200 py-16"
        initial={{ opacity: 0, y: 50 }} // Initial state for animation
        animate={{ opacity: 1, y: 0 }} // Animation on load
        transition={{ duration: 1 }} // Slower duration of the animation
      >
        <h2 className="text-3xl font-bold mb-4">About Collaborgators</h2>
        <p className="text-center max-w-2xl text-lg text-gray-700 mb-4">
          Collaborgators is a platform designed to help UF students find collaborators for their projects and startups. We believe in the power of teamwork and creativity, and we aim to foster a vibrant community of innovators.
        </p>
        <motion.button 
          onClick={() => scrollToSection('signInSection')}
          className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-6 py-3 rounded-full font-semibold"
          whileHover={{ scale: 1.1 }} // Scale up on hover
        >
          Join Us Now!
        </motion.button>
      </motion.div>

      <Footer />
    </>
  );
};

export default LandingPage;
