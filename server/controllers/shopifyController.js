const axios = require("axios");
const Shop = require("../models/Shop");

exports.initiateOAuth = (req, res) => {
  const shop = req.query.shop;
  if (!shop) return res.status(400).send("Missing shop param");

  const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=${process.env.SHOPIFY_SCOPES}&redirect_uri=${process.env.SHOPIFY_REDIRECT_URI}`;
  res.redirect(installUrl);
};

exports.handleCallback = async (req, res) => {
  const { shop, code } = req.query;

  const tokenURL = `https://${shop}/admin/oauth/access_token`;

  const response = await axios.post(tokenURL, {
    client_id: process.env.SHOPIFY_API_KEY,
    client_secret: process.env.SHOPIFY_API_SECRET,
    code
  });

  const access_token = response.data.access_token;

  await Shop.findOneAndUpdate(
    { shop_domain: shop },
    { access_token, shop_domain: shop },
    { upsert: true, new: true }
  );

  // Redirect to embedded frontend with shop param
  res.redirect(`${process.env.APP_URL}/admin?shop=${shop}`);
};
