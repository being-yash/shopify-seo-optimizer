const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
  shop_domain: {
    type: String,
    required: true,
    unique: true
  },
  access_token: {
    type: String,
    required: true
  },
  installed_at: {
    type: Date,
    default: Date.now
  },
  is_active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Shop', ShopSchema);