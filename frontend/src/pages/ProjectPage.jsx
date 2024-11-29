import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, Button, CircularProgress, Chip } from "@mui/material";
import Navbar from "../components/Navbar";
import supabase from "../supabaseClient";

const ProjectPage = () => {
  const { projectId } = useParams(); // Get project ID from URL params

  console.log("Params:", projectId);
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) {
        console.error("Error fetching project:", error);
        //navigate("/404"); // Redirect to a 404 page if the project is not found
        return;
      }

      setProject(data);
      setLoading(false);
    };

    fetchProject();
  }, [projectId, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "800px", margin: "50px auto", padding: "20px" }}>
      {/* Add Navbar */}
      <Navbar />

      <Card
        sx={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
            {project.title}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "20px", color: "#555" }}>
            {project.description}
          </Typography>

          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="body2" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
              Creator:
            </Typography>
            <Typography variant="body1" sx={{ color: "#333" }}>
              {project.creator_id || "Unknown"}
            </Typography>
          </Box>

          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="body2" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
              Tags:
            </Typography>
            {project.tags?.length > 0 ? (
              project.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  sx={{
                    marginRight: "10px",
                    marginBottom: "10px",
                    backgroundColor: "#BB86FC",
                    color: "#fff",
                  }}
                />
              ))
            ) : (
              <Typography variant="body1" sx={{ color: "#555" }}>
                No tags available
              </Typography>
            )}
          </Box>

          <Box sx={{ marginBottom: "20px" }}>
            <Typography variant="body2" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
              Created On:
            </Typography>
            <Typography variant="body1" sx={{ color: "#333" }}>
              {new Date(project.created_at).toLocaleDateString() || "Unknown"}
            </Typography>
          </Box>
        </CardContent>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/explore")} // Redirect to explore page or another location
          sx={{
            marginTop: "20px",
          }}
        >
          Back to Projects
        </Button>
      </Card>
    </Box>
  );
};

export default ProjectPage;
