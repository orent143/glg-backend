const supabase = require("../config/supabase");

// Fetch all users
const fetchAllUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw error;
  return data;
};

// Add a new user
const addUser = async (user) => {
  const { data, error } = await supabase.from("users").insert([user]);
  if (error) throw error;
  return data;
};

module.exports = {
  fetchAllUsers,
  addUser,
};