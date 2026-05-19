const supabase = require("../config/supabase");

const fetchProfileById = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, email, full_name")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({ error: "Missing Authorization token" });
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data || !data.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const profile = await fetchProfileById(data.user.id);
    if (!profile || !profile.role) {
      return res.status(403).json({ error: "Profile role not found" });
    }

    req.auth = { user: data.user };
    req.user = {
      id: profile.id,
      role: profile.role,
      email: profile.email || data.user.email || null,
      full_name: profile.full_name || null,
    };

    return next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const requireRole = (roles = []) => {
  return (req, res, next) => {
    const role = req.user && req.user.role;

    if (!role || (roles.length > 0 && !roles.includes(role))) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return next();
  };
};

module.exports = {
  authenticate,
  requireRole,
};
