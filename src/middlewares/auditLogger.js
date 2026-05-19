const supabase = require("../config/supabase");

const shouldAudit = (req) => {
  if (!req.user) return false;
  if (req.method === "GET") return false;
  return true;
};

const auditLogger = (req, res, next) => {
  res.on("finish", async () => {
    try {
      if (!shouldAudit(req) && !req.auditEvent) return;

      const event = req.auditEvent || {};
      const action = event.action || `${req.method} ${req.baseUrl}${req.path}`;

      const payload = {
        user_id: req.user && req.user.id ? req.user.id : null,
        role: req.user && req.user.role ? req.user.role : null,
        action,
        entity: event.entity || null,
        entity_id: event.entity_id || null,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        ip: req.ip || null,
        user_agent: req.headers["user-agent"] || null,
        metadata: event.metadata || null,
      };

      await supabase.from("audit_logs").insert([payload]);
    } catch (err) {
      console.error("audit log error:", err.message);
    }
  });

  next();
};

const setAuditEvent = (req, event) => {
  req.auditEvent = event;
};

module.exports = {
  auditLogger,
  setAuditEvent,
};
