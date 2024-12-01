import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Divider, Button } from "@mui/material";
import axios from "axios";
import Navbar from "../components/Navbar";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://127.0.0.1:8000/accounts/profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile", error);
        navigate("/login"); // If the user is not logged in, redirect to login
      }
      setLoading(false);
    };

    fetchProfile();
  }, [navigate, token]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "800px", margin: "50px auto", padding: "20px" }}>
      <Navbar />
      <Typography variant="h4" gutterBottom>
        {profile?.username}'s Profile
      </Typography>
      <Typography variant="body1">
        <strong>Email:</strong> {profile?.email}
      </Typography>
      <Typography variant="body1">
        <strong>Full Name:</strong> {profile?.full_name}
      </Typography>

      <Divider sx={{ margin: "20px 0" }} />

      <Button
        variant="outlined"
        color="secondary"
        onClick={() => window.location.href = "/login"}
        sx={{ mt: 2 }}
      >
        Log Out
      </Button>
    </Box>
  );
};

export default Profile;
