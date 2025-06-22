require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const axios = require("axios");
const cors = require("cors");
const { generateInstallUrl, getAccessToken } = require("./shopify");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cookieParser());
app.use(express.json());

app.use(cors({
  origin: [
    "https://shopify-seo-optimizer.vercel.app",
    "https://shopify-seo-optimizer-git-main-beingyashs-projects.vercel.app", // 👈 Add this
    "http://localhost:5173"
  ],
  credentials: true,
}));


// Setup session
app.use(session({
  secret: process.env.COOKIE_SECRET || "defaultsecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  },
}));

// ✅ OAuth Step 1: Redirect to install
app.get("/api/auth", (req, res) => {
  const { shop } = req.query;
  if (!shop) return res.status(400).send("Shop required");

  const installUrl = generateInstallUrl(shop);
  res.redirect(installUrl);
});

// ✅ OAuth Step 2: Handle callback
app.get("/api/auth/callback", async (req, res) => {
  const { shop, code } = req.query;

  try {
    const accessToken = await getAccessToken(shop, code);
    console.log("✅ Auth successful:", { accessToken });
    req.session.shop = shop;
    req.session.accessToken = accessToken;
    res.cookie("shop", shop, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    console.log("✅ Auth successful:", { shop });
    res.redirect(`https://shopify-seo-optimizer.vercel.app/?shop=${shop}&token=${accessToken}`);
    //res.redirect(`https://shopify-seo-optimizer.vercel.app/?shop=${shop}`);
  } catch (err) {
    console.error("❌ Auth error:", err.message);
    res.status(500).send("Auth Error: " + err.message);
  }
});

// ✅ Get all products
app.get("/api/products", async (req, res) => {
  const { shop, accessToken } = req.cookies || {}; // <-- GET FROM COOKIE
  console.log("🔐 shop:", shop, "accessToken:", !!accessToken);

  if (!shop || !accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const response = await axios.get(
      `https://${shop}/admin/api/2024-04/products.json?limit=50`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
        },
      }
    );
    return res.json({ products: response.data.products });
  } catch (err) {
    console.error("❌ Product fetch failed:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ✅ Generate SEO content via Gemini
app.post("/api/generate-seo", async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    console.log("❌ Missing fields", { title, description });
    return res.status(400).json({ error: "Missing title or description" });
  }

  try {
    console.log("⚡ Sending to Gemini:", { title, description });

    const prompt = `
      Optimize this product for SEO on an ecommerce site.

      Product Title:
      ${title}

      Product Description:
      ${description}

      Return:
      - Optimized Title
      - Short, compelling SEO meta description (50–160 characters)
    `;

    const geminiRes = await axios.post(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
        params: { key: process.env.GEMINI_API_KEY },
      }
    );

    const text = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("✅ Gemini Response:", text);

    const [seoTitleLine, ...descLines] = text.split("\n").filter(Boolean);
    const seoTitle = seoTitleLine.replace(/^Optimized Title:/i, "").trim();
    const seoDescription = descLines.join(" ").replace(/^Meta Description:/i, "").trim();

    res.json({ title: seoTitle, description: seoDescription });
  } catch (err) {
    console.error("❌ Gemini API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate SEO content" });
  }
});

// ✅ Update Shopify Product
app.post("/api/update-product", async (req, res) => {
  const { id, title, description } = req.body;
  const { shop, accessToken } = req.session;

  if (!shop || !accessToken) {
    return res.status(401).json({ error: "Unauthorized - Missing session" });
  }

  try {
    const updateRes = await axios.put(
      `https://${shop}/admin/api/2024-04/products/${id}.json`,
      {
        product: { id, title, body_html: description },
      },
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, product: updateRes.data.product });
  } catch (err) {
    console.error("❌ Product update failed:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
