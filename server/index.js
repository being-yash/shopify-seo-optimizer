// server/index.js
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const { generateInstallUrl, getAccessToken } = require('./shopify');

const app = express();
app.use(cookieParser());
app.use(express.json());

const PORT = process.env.PORT || 3001;
//const PORT = 3001;

// ✅ Start Auth Flow
app.get('/api/auth', (req, res) => {
  const { shop } = req.query;
  if (!shop) return res.status(400).send('Shop required');

  const installUrl = generateInstallUrl(shop);
  res.redirect(installUrl);
});

// ✅ Callback Handler
app.get('/api/auth/callback', async (req, res) => {
  const { shop, code } = req.query;

  try {
    const accessToken = await getAccessToken(shop, code);

    // You can store accessToken in DB or session/cookie
    res.cookie('shop', shop);
    res.cookie('accessToken', accessToken);
    res.redirect(`https://your-frontend-app-url.com?shop=${shop}`);
  } catch (err) {
    res.status(500).send('Auth Error: ' + err.message);
  }
});

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

