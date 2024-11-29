import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Divider } from "@mui/material";
import supabase from "../supabaseClient"; // Ensure you have your supabase client configured here.
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [userNames, setUserNames] = useState({});

  // Fetch conversations involving the logged-in user
  useEffect(() => {
    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("sender_id, recipient_id")
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);

      if (error) {
        console.error("Error fetching conversations:", error.message);
        return;
      }

      const uniqueUserIds = Array.from(
        new Set(
          data.flatMap((msg) =>
            msg.sender_id === user.id ? msg.recipient_id : msg.sender_id
          )
        )
      );
      setConversations(uniqueUserIds);
    };

    fetchConversations();
  }, [user.id]);

  useEffect(() => {
    const fetchUserNames = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name')
        .in('id', conversations);

      if (error) {
        console.error('Error fetching user names:', error);
      } else {
        const userNamesMap = data.reduce((acc, user) => {
          acc[user.id] = user.full_name;
          return acc;
        }, {});
        setUserNames(userNamesMap);
      }
    };

    if (conversations.length > 0) {
      fetchUserNames();
    }
  }, [conversations]);

  // Fetch messages for the active conversation
  useEffect(() => {
    if (!activeConversation) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `sender_id.eq.${activeConversation},recipient_id.eq.${activeConversation}`
        )
        .or(
          `sender_id.eq.${user.id},recipient_id.eq.${user.id}`
        );

      if (error) {
        console.error("Error fetching messages:", error.message);
        return;
      }
      setMessages(data);
    };

    fetchMessages();

    // Real-time subscription to the messages table
    const messageChannel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          if (
            payload.new.sender_id === user.id ||
            payload.new.recipient_id === user.id
          ) {
            setMessages((prevMessages) => [...prevMessages, payload.new]);
          }
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount or when active conversation changes
    return () => {
		messageChannel.unsubscribe();
    };
  }, [activeConversation, user.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    try {
      const { error } = await supabase.from("messages").insert([
        {
          sender_id: user.id,
          recipient_id: activeConversation,
          content: newMessage,
        },
      ]);

      if (error) throw error;

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender_id: user.id,
          recipient_id: activeConversation,
          content: newMessage,
        },
      ]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Box sx={{ width: "250px", borderRight: "1px solid #ccc", padding: "10px" }}>
          <Typography variant="h6">Conversations</Typography>
          {conversations.map((conversationId) => (
            <Button
              key={conversationId}
              fullWidth
              onClick={() => setActiveConversation(conversationId)}
              sx={{ marginBottom: "5px", textAlign: "left" }}
            >
              {userNames[conversationId] || `User ${conversationId}`}
            </Button>
          ))}
        </Box>

        <Box sx={{ flex: 1, padding: "10px" }}>
          {activeConversation ? (
            <>
              <Typography variant="h6">Chat with User {activeConversation}</Typography>
              <Divider sx={{ margin: "10px 0" }} />
              <Box
                sx={{
                  height: "70vh",
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                {messages.map((msg, index) => (
                  <Typography
                    key={index}
                    align={msg.sender_id === user.id ? "right" : "left"}
                    sx={{
                      marginBottom: "5px",
                      color: msg.sender_id === user.id ? "blue" : "black",
                    }}
                  >
                    {msg.content}
                  </Typography>
                ))}
              </Box>
              <form onSubmit={handleSendMessage}>
                <TextField
                  label="Type a message"
                  fullWidth
                  multiline
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  sx={{ marginBottom: "10px" }}
                />
                <Button variant="contained" type="submit" fullWidth>
                  Send
                </Button>
              </form>
            </>
          ) : (
            <Typography>Select a conversation to start chatting</Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Messages;
