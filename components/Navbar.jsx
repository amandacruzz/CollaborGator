import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link to="/" className="font-bold text-lg">CollaborGators</Link>
        <div>
          {/* Authentication links (login, signup, logout) */}
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
          {/* ... other authentication links */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;