import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import TermsOfServicePage from './pages/TermsOfServicePage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Shallow routes for the front pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />

        {/*Routes for the main pages*/}
        <Route path="/projects" element={<ProjectsPage />} />

      </Routes>
    </Router>
  );
};

export default App;
