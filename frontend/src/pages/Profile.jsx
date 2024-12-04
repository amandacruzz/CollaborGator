import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import supabase from "../supabaseClient";
import { Box, Button, Divider, Typography, CircularProgress, Grid, Card, CardContent, CardActions} from "@mui/material";
import Navbar from "../components/Navbar";

const Profile = () => {
  const { user } = useAuth();
  const { userId } = useParams(); // Retrieve userId from the URL
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = user && user.id === userId; // Check if it's the logged-in user's profile


  ////// NOT SURE WHY I CANT OPEN PEOPLES PROFILE
   ////// NOT SURE WHY I CANT OPEN PEOPLES PROFILE
    ////// NOT SURE WHY I CANT OPEN PEOPLES PROFILE
     ////// NOT SURE WHY I CANT OPEN PEOPLES PROFILE
      ////// NOT SURE WHY I CANT OPEN PEOPLES PROFILE


      
  // Fetch user profile and projects
  useEffect(() => {
    const fetchProfileAndProjects = async () => {
      setLoading(true);

      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        navigate("/explore"); // Redirect to a 404 page if user doesn't exist
        return;
      }

      setProfile(profileData);

      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("creator_id", userId);

      if (projectsError) {
        console.error("Error fetching projects:", projectsError);
      } else {
        setProjects(projectsData);
      }

      setLoading(false);
    };

    if (userId) {
      fetchProfileAndProjects();
    }
  }, [userId, navigate]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (


    <>
      {/* Add Navbar */}
      <Navbar />
    
      <Box sx={{ maxWidth: "800px", margin: "50px auto", padding: "20px" }}>
      

      {/* Top Part: User Profile */}
      <Box sx={{ marginBottom: "30px" }}>
        <Typography variant="h4" gutterBottom>
          {isOwnProfile ? "My Profile" : `${profile.full_name}'s Profile`}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "10px" }}>
          <strong>Name:</strong> {profile.full_name || "N/A"}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "10px" }}>
          <strong>Email:</strong> {isOwnProfile ? profile.email : "Hidden"}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "10px" }}>
          <strong>Bio:</strong> {profile.bio || "No bio set."}
        </Typography>
        {isOwnProfile && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/edit-profile")}
            sx={{ marginBottom: "20px" }}
          >
            Edit Profile
          </Button>
        )}
        <Divider />
      </Box>

      {/* Bottom Part: User's Projects */}
      <Box>
        <Typography variant="h5" gutterBottom>
          My Projects
        </Typography>
        {projects.length > 0 ? (
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} key={project.id}>
                <Card
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    backgroundColor: "#f9f9f9",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {project.title}
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: "10px" }}>
                      {project.description}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Tags: {project.tags?.join(" · ") || "No tags"}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      View Project
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1">You haven’t created any projects yet.</Typography>
        )}
      </Box>
    </Box>
    </>
    
  );
};

export default Profile;
