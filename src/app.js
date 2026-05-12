require("dotenv").config(); // Add this line at the top
const express = require("express");
const rateLimit = require("express-rate-limit");
const supabase = require("./config/supabase");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(apiLimiter);

// Base route
app.get("/", (req, res) => {
  res.send("GLG Pharmacy Backend is running");
});

// Routes
app.use("/users", userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});