
import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, CircularProgress } from "@mui/material";
import supabase from "../supabaseClient"; // Import your supabase client
import Navbar from "../components/Navbar"; // Import Navbar
import SearchBar from "../components/SearchBar"; // Import SearchBar

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from("projects").select("*");
      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(data);
        setFilteredProjects(data); // Initially show all projects
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const handleSearch = (query) => {
	const lowercasedQuery = query.toLowerCase();
	const filtered = projects.filter((project) =>
	  project.title.toLowerCase().includes(lowercasedQuery) ||
	  project.description.toLowerCase().includes(lowercasedQuery) ||
	  project.tags.some((tag) => tag.toLowerCase().includes(lowercasedQuery)) // Check if any tag matches the query
	);
	setFilteredProjects(filtered);
  };

  return (
    <Box sx={{ padding: "24px", backgroundColor: "#f5f5f5" }}>
      {/* Add Navbar */}
      <Navbar />

      {/* Add SearchBar */}
      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
              <Card
                sx={{
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 3,
                  },
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                    {project.title}
                  </Typography>
                  <Typography variant="body2" sx={{ marginTop: "10px", color: "#666" }}>
                    {project.description}
                  </Typography>
				  <Typography variant="body2" sx={{ marginTop: "10px", color: "#666" }}>
					{project.tags.join(" • ")}
				  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    component="a"
                    href={`/project/${project.id}`}
                    sx={{
                      backgroundColor: "#BB86FC",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#9A6DFF",
                      },
                    }}
                  >
                    View Project
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Home;
