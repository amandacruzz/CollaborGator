import React, { useState } from "react";
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is imported

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(""); // Added username state
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://127.0.0.1:8000/accounts/register/', {
        email,
        username,  // Sending the username to the backend
        password,
      });

      if (response.data.message === "User registered successfully") {
        navigate("/login"); // Redirect to login after successful sign-up
      } else {
        throw new Error("Something went wrong during registration");
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
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
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "400px" }}>
        <TextField
          fullWidth
          label="Username"
          type="text"
          value={username}  // Bind username state
          onChange={(e) => setUsername(e.target.value)} // Update username
          required
          margin="normal"
          autoFocus
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
        </Button>
      </form>

      <Typography variant="body2" sx={{ marginTop: "20px" }}>
        Already have an account?{" "}
        <Button onClick={() => navigate("/login")} color="primary" sx={{ padding: 0 }}>
          Log In
        </Button>
      </Typography>
    </Box>
  );
};

export default SignUp;
