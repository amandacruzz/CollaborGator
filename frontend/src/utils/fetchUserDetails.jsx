import supabase from "../supabaseClient";

export async function fetchUserDetails(userId) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("full_name, bio")
      .eq("id", userId)
      .single(); // Since userId is unique

    if (error) throw error;

    return data; // { full_name, bio }
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
}
