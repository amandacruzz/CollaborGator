import { useState, useEffect } from "react";
import supabase from "../supabaseClient";
import { useGetUserProfile } from "./useGetUserProfile";
import { useGetConversationMessages } from "./useGetConversationMessages";

export const useGetRealTimeMessages = (participantId) => {
  const { userProfile } = useGetUserProfile();
  const [messages, setMessages] = useState([]);
  
  // load initial messages
  setMessages(useGetConversationMessages(participantId));
  
  useEffect(() => {
    if (!userProfile?.id || !participantId) return;

    // Subscribe to the messages table for new inserts
    const channel = supabase
      .from("messages")
      .on("INSERT", (payload) => {
        const newMessage = payload.new;
        // Check if the new message belongs to the current conversation
        if (
          (newMessage.sender_id === participantId && newMessage.recipient_id === userProfile.id) ||
          (newMessage.recipient_id === participantId && newMessage.sender_id === userProfile.id)
        ) {
          // Add new message to the list of messages for the active conversation
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      })
      .subscribe();

    // Cleanup subscription when the component is unmounted or conversation changes
    return () => {
      supabase.removeSubscription(channel);
    };
  }, [userProfile, participantId]);

  return { messages };
};
