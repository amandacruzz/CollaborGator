import React from 'react';
import Header from '../components/Header'
import Footer from '../components/Footer'

const ProjectsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      {/* Navbar */}
      <Header />

      {/* Search Bar */}
      <div className="container mx-auto mt-8 px-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for projects..."
            className="w-full p-4 pl-12 text-gray-800 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 10-14 0 7 7 0 0014 0z"
            />
          </svg>
        </div>
      </div>

      {/* Projects Gallery */}
      <div className="container mx-auto my-12 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Explore Projects
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Placeholder project cards */}
          {Array(9).fill(0).map((_, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl hover:bg-blue-50 cursor-pointer"
            >
              <img
                src={`https://via.placeholder.com/300x200?text=Project+${index + 1}`}
                alt={`Project ${index + 1}`}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900">Project {index + 1}</h3>
              <p className="text-gray-600 mt-2">
                This is a brief description of Project {index + 1}. Click to learn more.
              </p>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all">
                View Project
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProjectsPage;
