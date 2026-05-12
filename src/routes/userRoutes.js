const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// Define user routes
router.get("/auth-users", userController.getAllAuthUsers);
router.post("/auth-users", userController.createAuthUser);
router.post("/", userController.createUser);

module.exports = router;