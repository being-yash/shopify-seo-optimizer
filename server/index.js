require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3001;

// Connect MongoDB
connectDB();

// Middleware
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: [
      "https://shopify-seo-optimizer.vercel.app",
      "https://shopify-seo-optimizer-git-main-beingyashs-projects.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.COOKIE_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    },
  })
);

// Check MongoDB status
app.get("/api/db-status", (req, res) => {
  const status = mongoose.connection.readyState; // 1 = connected
  res.json({
    status,
    message: status === 1 ? "MongoDB is connected" : "MongoDB is NOT connected",
  });
});

// Shopify OAuth Routes
const shopifyRoutes = require("./routes/shopifyRoutes");
app.use("/api", shopifyRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
