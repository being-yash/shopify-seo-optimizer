const mongoose = require("mongoose");

const VendorProductSchema = new mongoose.Schema({
  shop_domain: {
    type: String,
    required: true,
  },
  vendor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  shopify_product_id: {
    type: String,
    required: true,
  },
  assigned_by_admin: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("VendorProduct", VendorProductSchema);