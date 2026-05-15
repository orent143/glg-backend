const express = require("express");
const userController = require("../controllers/userController");
const { authenticate, requireRole } = require("../middlewares/auth");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const signupLimiter = rateLimit({
	windowMs: 3 * 1000,
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: "Too many signups. Please try again shortly." },
});

// Define user routes
router.get(
	"/auth-users",
	authenticate,
	requireRole(["admin"]),
	userController.getAllAuthUsers
);
router.post(
	"/auth-users",
	authenticate,
	requireRole(["admin"]),
	userController.createAuthUser
);

// Auth helpers
router.post("/auth/signup", signupLimiter, userController.customerRegister);
router.post(
	"/auth/invite",
	authenticate,
	requireRole(["admin"]),
	userController.inviteAdminUser
);
router.post("/", userController.createUser);

module.exports = router;