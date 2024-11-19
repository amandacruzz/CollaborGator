import React from "react";
import { Container, Grid, Card, CardContent, Typography } from "@mui/material";
import Navbar from "../components/Navbar";
import useFetchProjects from "../hooks/useFetchProjects";

const Home = () => {
  const { projects, loading, error } = useFetchProjects();

  return (
    <div>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Explore Projects</Typography>
        {loading && <Typography>Loading projects...</Typography>}
        {error && <Typography color="error">Error: {error}</Typography>}
        <Grid container spacing={4}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{project.title}</Typography>
                  <Typography variant="body2" color="textSecondary">{project.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default Home;
