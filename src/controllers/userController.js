const supabase = require("../config/supabase");

// Get all users
const getAllAuthUsers = async (req, res) => {
  try {
    const { data, error } = await supabase.from("auth.users").select("*");
    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").insert([req.body]);
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllAuthUsers,
  createUser,
};