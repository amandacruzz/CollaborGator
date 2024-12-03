import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import supabase from "../supabaseClient";
import { Box, Button, TextField, Typography, CircularProgress } from "@mui/material";
import Navbar from "../components/Navbar"; // Import Navbar

const PostProject = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  // Check user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        navigate("/create-profile");
        return;
      }

      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !tags) {
      alert("Please fill in all fields.");
      return;
    }

    const tagArray = tags.split(",").map((tag) => tag.trim());

    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          creator_id: user.id,
          title,
          description,
          tags: tagArray,
        },
      ]);

    if (error) {
      console.error("Error creating project:", error);
      alert("Failed to post project. Please try again.");
    } else {
      alert("Project posted successfully!");
      navigate("/");
    }
  };

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

      <Box sx={{ maxWidth: "600px", margin: "50px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "10px" }}>
      
	  
        <Typography variant="h4" align="center" gutterBottom>
            Post a Project
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Project Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              label="Project Description"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ marginBottom: "20px" }}
            />
            <TextField
              label="Tags (comma-separated)"
              fullWidth
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              sx={{ marginBottom: "20px" }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Post Project
            </Button>
          </form>
        </Box>
    
    </>

    
  );
};

export default PostProject;
