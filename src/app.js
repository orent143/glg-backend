require("dotenv").config(); // Add this line at the top
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const userRoutes = require("./routes/userRoutes");
const { auditLogger } = require("./middlewares/auditLogger");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

// Middleware

const allowedOrigins = [
  "https://glgtech.qzz.io",
  "https://glgpharma.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

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

// Error handler (keep last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});