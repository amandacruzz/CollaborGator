import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const Home = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from('projects').select('*');
      if (error) console.error('Error fetching projects:', error);
      else setProjects(data);
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <h1>Explore Projects</h1>
      <div>
        {projects.map(project => (
          <div key={project.id}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
