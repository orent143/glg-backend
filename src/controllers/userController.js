const supabase = require("../config/supabase");

// Get all users (Auth Admin API)
const getAllAuthUsers = async (req, res) => {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;

    res.json(data.users);
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

// Create a new auth user (Admin API)
const createAuthUser = async (req, res) => {
  try {
    const { email, password, email_confirm } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: Boolean(email_confirm),
    });
    if (error) throw error;

    res.status(201).json(data.user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllAuthUsers,
  createUser,
  createAuthUser,
};