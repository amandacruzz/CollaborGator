import { useState, useEffect } from "react";
import supabase from "../supabaseClient";
import { useGetUserProfile } from "./useGetUserProfile"; 

export const useGetConversationMessages = (participantId) => {
  const { userProfile } = useGetUserProfile();  // Get the logged-in user's profile
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (userProfile?.id && participantId) {
      // Fetch messages for the conversation between the current user and the participant
      const fetchConversationMessages = async () => {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(
            `sender_id.eq.${userProfile.id},recipient_id.eq.${userProfile.id}`
          )
          .filter("sender_id", "eq", participantId)  // Filter by the selected conversation participant
          .filter("recipient_id", "eq", participantId); // make sure this works

        if (error) {
          console.error("Error fetching conversation messages:", error.message);
        } else {
          setMessages(data);
        }
      };

      fetchConversationMessages();
    }
  }, [userProfile, participantId]);

  return { messages };
};
