const supabase = require("../config/supabase");

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

    req.auth = { user: data.user };
    return next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const requireRole = (roles = []) => {
  return (req, res, next) => {
    const user = req.auth && req.auth.user;
    const role = user && user.app_metadata && user.app_metadata.role;

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
