import { useState, useEffect } from "react";
import { useAuth } from "./useAuth"; 
import supabase from "../supabaseClient"; 

export const useGetUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return; // Skip fetching if no user is logged in

    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("users") // The public.users table
        .select("*")
        .eq("id", user.id)
        .single(); // Expecting a single row for the user

      if (error) {
        setError(error.message);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (updatedData) => {
    if (!user) return;

    const { error } = await supabase
      .from("users")
      .update(updatedData)
      .eq("id", user.id);

    if (error) {
      setError(error.message);
    } else {
      setProfile((prev) => ({ ...prev, ...updatedData }));
    }
  };

  return { profile, loading, error, updateProfile };
};
