const userService = require("../services/userService");
const { setAuditEvent } = require("../middlewares/auditLogger");

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
    setAuditEvent(req, {
      action: "auth_user.invite",
      entity: "auth_user",
      metadata: { role: req.body && req.body.role },
    });
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

//Admin get staff users
const getStaffUsers = async (req, res) => {
  try {
    const users = await userService.getStaffUsers();

    console.log("Fetched users:", users);

    return res.status(200).json(users);
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      error: err.message,
    });
  }
};

// Login API (returns access token)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await userService.loginUser({ email, password });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  customerRegister,
  inviteAdminUser,
  getStaffUsers,
  loginUser,
};