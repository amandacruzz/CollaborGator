import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import { useAuth } from "../hooks/useAuth";
import { useGetUserProfile } from "../hooks/useGetUserProfile";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading, error, updateProfile } = useGetUserProfile();

  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    avatar_url: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect to login if not logged in
    } else if (!loading && profile) {
      setFormData({
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        avatar_url: profile.avatar_url || "",
      });
    }
  }, [user, profile, loading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProfile(formData);
      navigate("/profile"); // Redirect to profile page after successful update
    } catch (error) {
      console.error("Error updating profile:", error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        padding: 3,
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 3 }}>
        Edit Your Profile
      </Typography>

      <Avatar
        src={formData.avatar_url}
        alt="Profile Picture"
        sx={{
          width: 120,
          height: 120,
          marginBottom: 2,
          border: "2px solid #BB86FC",
        }}
      />
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 400 }}>
        <TextField
          label="Full Name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: 2 }}
          required
        />
        <TextField
          label="Bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Avatar URL"
          name="avatar_url"
          value={formData.avatar_url}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            backgroundColor: "#2E3B55",
            "&:hover": {
              backgroundColor: "#3F4D6C",
            },
          }}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Box>
  );
};

export default EditProfile;
