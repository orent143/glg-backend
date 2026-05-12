require("dotenv").config(); // Add this line at the top
const express = require("express");
const supabase = require("./config/supabase");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

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