import { useState, useEffect } from "react";
import supabase from "../supabaseClient";

const useGetProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProjects = async () => {
      const { data, error } = await supabase.from("projects").select("*");
      if (error) {
        console.error("Error fetching projects:", error);
        setError(error.message);
      } else {
        setProjects(data);
      }
      setLoading(false);
    };

    getProjects();
  }, []);

  return { projects, loading, error };
};

export default useGetProjects;
