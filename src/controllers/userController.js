const supabase = require("../config/supabase");
const userService = require("../services/userService");

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

// Customer Signup API
const customerRegister = async (req, res) => {
  try {
    const { email, password, full_name, fullName } = req.body;
    const resolvedFullName = full_name ?? fullName;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    await userService.signUpCustomer({
      email,
      password,
      full_name: resolvedFullName,
    });
    return res
      .status(201)
      .json({ message: "Signup created. Check your email to verify." });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Admin invite for pharmacist/admin
const inviteAdminUser = async (req, res) => {
  try {
    const { email, role } = req.body;
    const allowedRoles = ["pharmacist", "admin"];

    if (!email || !role) {
      return res.status(400).json({ error: "Email and role are required" });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await userService.inviteAuthUser({ email, role });
    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllAuthUsers,
  createUser,
  createAuthUser,
  customerRegister,
  inviteAdminUser,
};