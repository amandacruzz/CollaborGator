import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Divider } from "@mui/material";
import supabase from "../supabaseClient"; // Ensure you have your supabase client configured here.
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]); // List of unique conversation participants
  const [messages, setMessages] = useState([]); // Messages in the selected conversation
  const [activeConversation, setActiveConversation] = useState(null); // ID of the current active conversation
  const [newMessage, setNewMessage] = useState(""); // New message to send
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

      // Extract unique conversation participants
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
  }, [activeConversation, user.id]);

  // Handle sending a new message
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

      // Add the new message to the local state
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
		{/* Add Navbar at the top */}
		<Navbar />

		<Box sx={{ display: "flex", height: "100vh" }}>

		{/* Left Panel: Conversation List */}
		<Box
			sx={{
			width: "250px",
			borderRight: "1px solid #ccc",
			padding: "10px",
			}}
		>
			<Typography variant="h6">Conversations</Typography>
			{conversations.map((conversationId) => (
			<Button
				key={conversationId}
				fullWidth
				onClick={() => setActiveConversation(conversationId)}
				sx={{
				marginBottom: "5px",
				textAlign: "left",
				}}
			>
				{userNames[conversationId] || `User ${conversationId}`}
			</Button>
			))}
		</Box>

		{/* Right Panel: Messages */}
		<Box sx={{ flex: 1, padding: "10px" }}>
			{activeConversation ? (
			<>
				<Typography variant="h6">
				Chat with User {activeConversation}
				</Typography>
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









































// import React, { useState, useEffect } from "react";
// import { Box, Tabs, Tab, Divider, TextField, Button, Typography, Avatar } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import supabase from "../supabaseClient";
// import { useAuth } from "../hooks/useAuth";
// import { useGetUserProfile } from "../hooks/useGetUserProfile";
// import { useGetRealTimeMessages } from "../hooks/useGetRealTimeMessages";
// import { useGetUniqueConversations } from "../hooks/useGetUniqueConversations";

// const Messages = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { userProfile, profileLoading } = useGetUserProfile();

//   const { uniqueConversations } = useGetUniqueConversations(); // unique conversation user_ids
//   const [activeConversation, setActiveConversation] = useState(null); // which chat is active
//   const [newMessage, setNewMessage] = useState(""); // new messages to send
//   const { messages: conversationMessages } = useGetRealTimeMessages(activeConversation);

//   const [loading, setLoading] = useState(true);
//   // Simulate a loading delay for testing
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false); // Set loading to false after a few seconds
//     }, 3000); // 3-second delay

//     return () => clearTimeout(timer); // Cleanup timer on component unmount
//   }, []);

//   const handleConversationClick = (conversationId) => {
//     setActiveConversation(conversationId);
//   };

//   // Handle message send
//   const handleSendMessage = async (e) => {
//     e.preventDefault();

//     if (!newMessage.trim()) return;

//     try {
//       const { error } = await supabase.from("messages").insert([
//         {
//           sender_id: user.id,
//           recipient_id: activeConversation.recipient_id,
//           content: newMessage,
//         },
//       ]);

//       if (error) throw error;

//       setNewMessage(""); // Clear message input after sending
//     } catch (error) {
//       console.error("Error sending message:", error.message);
//     }
//   };

//   // Effect to fetch conversations when the page loads
//   useEffect(() => {
// 	if (profileLoading) return;

//     if (!user) {
//       navigate("/login");
//     } else if (!userProfile){
// 		navigate("/create-profile")
// 	}
    
//   }, [user, userProfile, navigate]);


//   return (
//     <Box sx={{ display: "flex" }}>
//       {/* Left Side: Conversations */}
//       <Box sx={{ width: "250px", padding: "20px", borderRight: "1px solid #ccc" }}>
//         {uniqueConversations.map((conversationId) => (
//           <Button key={conversationId} onClick={() => handleConversationClick(conversationId)}>
//             {conversationId}
//           </Button>
//         ))}
//       </Box>

//       <Divider orientation="vertical" flexItem />

//       {/* Right Side: Active Conversation */}
//       <Box sx={{ flex: 1, padding: "20px" }}>
//         {activeConversation ? (
//           <>
//             <h2>Conversation with {activeConversation}</h2>
//             <div>
//               {conversationMessages.map((message) => (
//                 <div key={message.id}>
//                   <strong>{message.sender_id}</strong>: {message.content}
//                 </div>
//               ))}
//             </div>
//             <TextField label="Type a message" fullWidth multiline />
//             <Button>Send</Button>
//           </>
//         ) : (
//           <div>Select a conversation to start chatting</div>
//         )}
//       </Box>
//     </Box>
//   );



















// //   return (
// //     <Box sx={{ display: "flex", height: "100vh", flexDirection: "row" }}>
// //       {/* Left Panel: Conversations Tabs */}
// //       <Box sx={{ width: 300, borderRight: "1px solid #ddd", padding: 2 }}>
// //         <Typography variant="h6" sx={{ marginBottom: 2 }}>
// //           Conversations
// //         </Typography>
// //         <Tabs
// //           orientation="vertical"
// //           value={activeConversation ? activeConversation.id : false}
// //           onChange={(e, newValue) => setActiveConversation(newValue)}
// //           aria-label="Conversations Tabs"
// //           sx={{ borderRight: 1, borderColor: "divider" }}
// //         >
// //           {uniqueConversations.map((conversation) => (
// //             <Tab
// //               key={conversation.id}
// //               label={conversation.sender_id === user.id ? conversation.recipient_id.full_name : conversation.sender_id.full_name}
// //               value={conversation.id}
// //               sx={{
// //                 textAlign: "left",
// //                 paddingLeft: 2,
// //                 fontWeight: "bold",
// //               }}
// //             />
// //           ))}
// //         </Tabs>
// //       </Box>

// //       {/* Divider between the left and right panels */}
// //       <Divider orientation="vertical" flexItem />

// //       {/* Right Panel: Active Conversation */}
// //       <Box sx={{ flex: 1, padding: 2 }}>
// //         {activeConversation && (
// //           <>
// //             <Typography variant="h5" sx={{ marginBottom: 2 }}>
// //               {activeConversation.sender_id === user.id
// //                 ? activeConversation.recipient_id.full_name
// //                 : activeConversation.sender_id.full_name}
// //             </Typography>

// //             {/* Message List */}
// //             <Box
// //               sx={{
// //                 maxHeight: "70vh",
// //                 overflowY: "auto",
// //                 marginBottom: 2,
// //                 display: "flex",
// //                 flexDirection: "column",
// //                 gap: 2,
// //               }}
// //             >
// //               {messages.map((message) => (
// //                 <Box
// //                   key={message.id}
// //                   sx={{
// //                     display: "flex",
// //                     flexDirection: message.sender_id === user.id ? "row-reverse" : "row",
// //                     gap: 1,
// //                   }}
// //                 >
// //                   <Avatar sx={{ width: 30, height: 30 }} />
// //                   <Box
// //                     sx={{
// //                       maxWidth: "60%",
// //                       padding: 1,
// //                       backgroundColor: message.sender_id === user.id ? "#BB86FC" : "#f0f0f0",
// //                       borderRadius: 2,
// //                     }}
// //                   >
// //                     <Typography sx={{ wordBreak: "break-word" }}>{message.content}</Typography>
// //                   </Box>
// //                 </Box>
// //               ))}
// //             </Box>

// //             {/* Message Input */}
// //             <Box component="form" onSubmit={handleSendMessage} sx={{ display: "flex", gap: 2 }}>
// //               <TextField
// //                 fullWidth
// //                 label="Type a message"
// //                 variant="outlined"
// //                 value={newMessage}
// //                 onChange={(e) => setNewMessage(e.target.value)}
// //                 sx={{ flex: 1 }}
// //                 required
// //               />
// //               <Button
// //                 type="submit"
// //                 variant="contained"
// //                 color="primary"
// //                 sx={{ padding: "10px 20px" }}
// //                 disabled={!newMessage.trim()}
// //               >
// //                 Send
// //               </Button>
// //             </Box>
// //           </>
// //         )}
// //       </Box>
// //     </Box>
// //   );
// };

// export default Messages;
