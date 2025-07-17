const express = require('express');
const router = express.Router();
const {
  initiateOAuth,
  handleCallback
} = require('../controllers/shopifyController');

router.get('/auth', initiateOAuth);
router.get('/auth/callback', handleCallback);

module.exports = router;
