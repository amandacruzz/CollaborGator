import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to CollaborGators</h1>
      <p className="text-lg mb-8">Find your perfect team and bring your ideas to life.</p>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Projects</h2>
        {/* Display featured projects here */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link to="/project/1" className="bg-white p-4 rounded shadow hover:shadow-lg">
            <h3 className="text-xl font-bold">Project 1</h3>
            <p>A brief description of the project.</p>
          </Link>
          {/* ... more featured projects */}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Find Your Team</h2>
        <form>
          <input type="text" placeholder="Search for projects or users" className="border border-gray-300 p-2 rounded" />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Search</button>
        </form>
      </div>
    </div>
  );
}

export default HomePage;