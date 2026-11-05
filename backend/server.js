
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const {
  notFound,
  errorHandler,
} = require("./middleware/errorHandler");

const app = express();

// ==========================================
// CORS CONFIGURATION
// ==========================================

const allowedOrigins = [
  "https://home-service-instant-quote-estimator.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

function isAllowedOrigin(origin) {
  if (!origin) return true;

  let normalizedOrigin;

  try {
    normalizedOrigin = new URL(origin).origin;
  } catch {
    return false;
  }

  // Main production domain
  if (allowedOrigins.includes(normalizedOrigin)) {
    return true;
  }

  // Vercel preview deployments for this project
  const isVercelPreview =
    /^https:\/\/home-service-instant-quote-estimator-[a-z0-9-]+\.vercel\.app$/.test(
      normalizedOrigin
    );

  return isVercelPreview;
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        console.log("Allowed CORS origin:", origin || "No origin");
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ==========================================
// ROOT ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Home Service Estimator API is running",
  });
});

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/health", require("./routes/healthRoutes"));

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/estimations", require("./routes/estimationRoutes"));

// ==========================================
// ERROR HANDLING
// ==========================================

app.use(notFound);

app.use(errorHandler);

// ==========================================
// SERVER START
// ==========================================

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.warn("WARNING: JWT_SECRET is missing.");
}

connectDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      console.log("MongoDB connected successfully");
      console.log("Allowed frontend origins:", allowedOrigins);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
