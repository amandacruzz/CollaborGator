import { useState, useEffect } from "react";
import supabase from "../supabaseClient"; 
import { useGetUserProfile } from "./useGetUserProfile"; 

export const useGetUniqueConversations = () => {
  const { userProfile } = useGetUserProfile();  // Get the logged-in user's profile
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (userProfile?.id) {
      // Fetch messages where the user is either the sender or recipient
      const fetchMessages = async () => {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(`sender_id.eq.${userProfile.id},recipient_id.eq.${userProfile.id}`);

        if (error) {
          console.error("Error fetching messages:", error.message);
        } else {
          setMessages(data);
          // Get unique conversations (unique sender or recipient)
          const uniqueConversations = getUniqueConversations(data, userProfile.id);
          setConversations(uniqueConversations);
        }
      };

      fetchMessages();
    }
  }, [userProfile]);

  // Function to get unique conversations based on sender_id or recipient_id
  const getUniqueConversations = (messages, userId) => {
    const uniqueUsers = new Set();
    messages.forEach((message) => {
      if (message.sender_id !== userId) uniqueUsers.add(message.sender_id);
      if (message.recipient_id !== userId) uniqueUsers.add(message.recipient_id);
    });
    return Array.from(uniqueUsers);
  };

  return { messages, conversations };
};
