const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
  shop_domain: {
    type: String,
    required: true
  },
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: String,
  password: {
    type: String,
    required: true
  },
  commission_rate: {
    type: Number,
    default: 0.15
  },
  is_active: {
    type: Boolean,
    default: true
  },
  can_add_products: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Vendor", VendorSchema);
