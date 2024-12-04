import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Card, CardContent, Typography, Button, CircularProgress, Chip, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Navbar from "../components/Navbar";
import supabase from "../supabaseClient";
import { useGetUserProfile } from "../hooks/useGetUserProfile";  // Import the useGetUserProfile hook
import { useAuth } from "../hooks/useAuth";

const ProjectPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { projectId } = useParams(); // Get project ID from URL params
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useGetUserProfile(); // Fetch user profile using the custom hook
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);  // For controlling the message modal
  const [messageContent, setMessageContent] = useState("");  // Content of the message
  const [sendingMessage, setSendingMessage] = useState(false);  // For showing loading state when sending message


  useEffect(() => {
    const checkUserStatus = async () => {
      if (authLoading) return; // Wait for auth status to load
      if (!user) {
        navigate("/login"); // Redirect to login if not authenticated
        return;
      }

      if (profileLoading) return; // Wait for profile loading to finish

      if (!profile) {
        navigate("/create-profile"); // Redirect to create profile if the profile doesn't exist
        return;
      }
    }

    checkUserStatus();
  }, [authLoading, user, profileLoading, profile]);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) {
        console.error("Error fetching project:", error);
        return;
      }

      setProject(data);
      setLoading(false);
    }

    fetchProject();
  }, [projectId]);

  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      alert("Message cannot be empty!");
      return;
    }
  
    setSendingMessage(true);
    
    try {
      // Log the data that will be sent to the database for debugging
      console.log("Sending message with the following data:");
      console.log({
        sender_id: profile.id,  // Logged-in user's ID
        recipient_id: project.creator_id,  // Creator's ID
        content: messageContent,  // The message content
      });
  
      const { error } = await supabase.from("messages").insert([
        {
          sender_id: profile.id,  // Use profile.id from the useGetUserProfile hook
          recipient_id: project.creator_id,
          content: messageContent,
        },
      ]);
  
      if (error) {
        console.error("Error sending message:", error);
        alert("Error sending message.");
      } else {
        console.log("Message sent successfully!");  // Log success message
        alert("Message sent successfully!");
        setOpenMessageDialog(false); // Close the dialog after sending the message
        setMessageContent(""); // Reset the message input
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Unexpected error occurred.");
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading || profileLoading || authLoading) {
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

          {/* Button to navigate to creator's profile */}
          {project.creator_id && (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate(`/profile/${project.creator_id}`)} // Navigate to creator's profile page
              sx={{ marginTop: "20px" }}
            >
              View Creator's Profile
            </Button>
          )}

          {/* Button to open message dialog */}
          {profile && project.creator_id && (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setOpenMessageDialog(true)} // Open the message dialog
              sx={{ marginTop: "20px" }}
            >
              Message the Creator
            </Button>
          )}
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

      {/* Message Dialog */}
      <Dialog
        open={openMessageDialog}
        onClose={() => setOpenMessageDialog(false)}
        sx={{
          "& .MuiDialog-paper": {
            width: "600px", // Adjust width to make it larger
            maxWidth: "90%", // Optional: to ensure it doesn't exceed the screen width
          },
        }}
      >
        <DialogTitle>Message the Creator</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            rows={6} // Increase the number of rows to make the text box taller
            label="Your Message"
            variant="outlined"
            fullWidth
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            sx={{ marginBottom: "20px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMessageDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSendMessage} color="primary" disabled={sendingMessage}>
            {sendingMessage ? "Sending..." : "Send Message"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    
    </>

    
  );
};

export default ProjectPage;
