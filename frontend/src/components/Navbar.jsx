import React from "react";
import { AppBar, Toolbar, Typography, Box, Button, Avatar, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Message, PostAdd, AccountCircle } from "@mui/icons-material";
import { useGetUserProfile } from "../hooks/useGetUserProfile";
import CircularProgress from '@mui/material/CircularProgress';

const Navbar = () => {
	const navigate = useNavigate();
	const { user, signOut } = useAuth();
	const { profile, loading, error, updateProfile } = useGetUserProfile();

	const signOutAndRedirect = async () => {
		try {
		  await signOut(); // Perform sign-out logic
		  navigate('/'); // Navigate to the home page after sign-out
		} catch (error) {
		  console.error('Error signing out:', error);
		}
	  };

	return (
	  <AppBar position="static" sx={{ backgroundColor: "#2E3B55" }}>
		<Toolbar sx={{ justifyContent: "space-between", padding: "0 24px" }}>
		  {/* Left: Logo */}
		  <Typography
			variant="h6"
			component={Link}
			to="/"
			sx={{
			  textDecoration: "none",
			  color: "#fff",
			  fontWeight: "bold",
			  fontSize: "1.5rem",
			  "&:hover": {
				color: "#BB86FC", // Pastel purple on hover
			  },
			}}
		  >
			CollaborGators
		  </Typography>
  
		  {/* Middle: Explore */}
		  <Button
			component={Link}
			to="/explore"
			color="inherit"
			sx={{
			  "&:hover": {
				color: "#BB86FC", // Pastel purple on hover
			  },
			}}
		  >
			Explore
		  </Button>
  
		  {/* Right: Auth-dependent actions */}
		  <Box sx={{ display: "flex", alignItems: "center" }}>
			{user ? (
			  <>
				<IconButton
				  component={Link}
				  to="/messages"
				  color="inherit"
				  sx={{
					"&:hover": {
					  color: "#BB86FC",
					},
				  }}
				>
				  <Message />
				</IconButton>
				<IconButton
				  component={Link}
				  to="/post-project"
				  color="inherit"
				  sx={{
					"&:hover": {
					  color: "#BB86FC",
					},
				  }}
				>
				  <PostAdd />
				</IconButton>	
				{loading ? (
					<CircularProgress color="primary" />
				) : (
					<Link
						to={`/profile/${profile?.id}`} // Dynamic link to user's profile
						style={{ textDecoration: "none" }}
					>
						<Avatar
							alt={profile.email}
							src={profile.avatar_url}
							sx={{
							ml: 2,
							cursor: "pointer",
							"&:hover": {
								border: "2px solid #BB86FC", // Border on hover for avatar
							},
							}}
						/>
					</Link>
				)}
				<Button
					onClick={signOutAndRedirect} // Use the sign-out and redirect function
					color="inherit"
					sx={{
						ml: 2,
						"&:hover": {
						color: "#BB86FC",
						},
					}}
				>
					Log Out
				</Button>
			  </>
			) : (
			  <>
				<Button
				  component={Link}
				  to="/signup"
				  color="inherit"
				  sx={{
					"&:hover": {
					  color: "#BB86FC", // Pastel purple on hover
					},
				  }}
				>
				  Sign Up
				</Button>
				<Button
				  component={Link}
				  to="/login"
				  color="inherit"
				  sx={{
					"&:hover": {
					  color: "#BB86FC", // Pastel purple on hover
					},
				  }}
				>
				  Log In
				</Button>
			  </>
			)}
		  </Box>
		</Toolbar>
	  </AppBar>
	);
  };
  
  export default Navbar;