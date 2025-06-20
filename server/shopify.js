// server/shopify.js
const crypto = require('crypto');
const querystring = require('querystring');
const axios = require('axios');

const generateInstallUrl = (shop) => {
  const scopes = process.env.SHOPIFY_SCOPES;
  const redirectUri = process.env.SHOPIFY_REDIRECT_URI;
  const apiKey = process.env.SHOPIFY_API_KEY;

  const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${redirectUri}&state=randomstring&grant_options[]=per-user`;

  return installUrl;
};

const getAccessToken = async (shop, code) => {
  const url = `https://${shop}/admin/oauth/access_token`;

  const { data } = await axios.post(url, {
    client_id: process.env.SHOPIFY_API_KEY,
    client_secret: process.env.SHOPIFY_API_SECRET,
    code,
  });

  return data.access_token;
};

const callShopifyAdmin = async (shop, accessToken, endpoint, method = 'GET', body = {}) => {
  const url = `https://${shop}/admin/api/2024-01/${endpoint}`;

  const headers = {
    'X-Shopify-Access-Token': accessToken,
    'Content-Type': 'application/json',
  };

  return axios({
    method,
    url,
    headers,
    data: method === 'GET' ? undefined : body,
  });
};

module.exports = {
  generateInstallUrl,
  getAccessToken,
  callShopifyAdmin,
};
