import React, { useState } from "react";
import { TextField, Button, Typography, Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";  // Assuming you have the useAuth hook
import supabase from "../supabaseClient";  // Import your supabase client

const CreateProfile = () => {
  const { user, isLoading } = useAuth(); // Access the user from the useAuth hook
  const navigate = useNavigate();

  // States for form data
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if the user is logged in (if not, navigate them to the login page)
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Insert user profile into the 'public.users' table
    const { data, error } = await supabase.from("users").upsert({
      id: user.id, 
      email: user.email, 
      full_name: fullName, 
      bio: bio, 
      avatar_url: avatarUrl
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Successfully created profile, navigate to home or another page
      navigate("/");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f4f4f9",
        padding: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Create Your Profile
      </Typography>
      <form onSubmit={handleProfileSubmit} style={{ width: "100%", maxWidth: "400px" }}>
        <TextField
          fullWidth
          label="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          margin="normal"
          autoFocus
        />
        <TextField
          fullWidth
          label="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          multiline
          rows={4}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Avatar URL"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          margin="normal"
        />
        
        {error && (
          <Typography variant="body2" color="error" sx={{ marginTop: "10px" }}>
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: "20px" }}
          disabled={loading || isLoading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Create Profile"}
        </Button>
      </form>
    </Box>
  );
};

export default CreateProfile;
