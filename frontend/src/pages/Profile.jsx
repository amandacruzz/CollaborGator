import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import supabase from "../supabaseClient";
import { Box, Button, Divider, Typography, CircularProgress, Grid } from "@mui/material";
import Navbar from "../components/Navbar"; // Import Navbar

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user profile and projects
  useEffect(() => {
    const fetchProfileAndProjects = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        navigate("/create-profile");
        return;
      }

      setProfile(profileData);

      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("creator_id", user.id);

      if (projectsError) {
        console.error("Error fetching projects:", projectsError);
      } else {
        setProjects(projectsData);
      }

      setLoading(false);
    };

    fetchProfileAndProjects();
  }, [user, navigate]);

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
	
      {/* Top Part: User Profile */}
      <Box sx={{ marginBottom: "30px" }}>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "10px" }}>
          <strong>Name:</strong> {profile.full_name || "N/A"}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "10px" }}>
          <strong>Email:</strong> {profile.email}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "10px" }}>
          <strong>Bio:</strong> {profile.bio || "No bio set."}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/edit-profile")}
          sx={{ marginBottom: "20px" }}
        >
          Edit Profile
        </Button>
        <Divider />
      </Box>

      {/* Bottom Part: User's Projects */}
      <Box>
        <Typography variant="h5" gutterBottom>
          My Projects
        </Typography>
        {projects.length > 0 ? (
          <Grid container spacing={2}>
            {projects.map((project) => (
              <Grid item xs={12} key={project.id}>
                <Box
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "15px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {project.title}
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                    {project.description}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Tags: {project.tags.join(" · ")}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1">You haven’t created any projects yet.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Profile;
