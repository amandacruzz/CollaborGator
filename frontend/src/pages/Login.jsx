import React, { useState } from "react";
import { TextField, Button, Typography, Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is imported

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://127.0.0.1:8000/accounts/login/', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
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
        Log In
      </Typography>
      <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: "400px" }}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          margin="normal"
          autoFocus
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
          {loading ? <CircularProgress size={24} color="inherit" /> : "Log In"}
        </Button>
      </form>

      <Typography variant="body2" sx={{ marginTop: "20px" }}>
        Don't have an account?{" "}
        <Button onClick={() => navigate("/signup")} color="primary" sx={{ padding: 0 }}>
          Sign Up
        </Button>
      </Typography>
    </Box>
  );
};

export default Login;
