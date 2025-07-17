const mongoose = require("mongoose");

const VendorOrderSchema = new mongoose.Schema(
  {
    shop_domain: {
      type: String,
      required: true,
    },
    order_id: {
      type: String,
      required: true,
    },
    line_item_id: {
      type: String,
      required: true,
    },
    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    product_id: {
      type: String,
      required: true,
    },
    quantity: Number,
    price: Number,
    commission_rate: Number,
    payout_due: Number,
    fulfillment_status: {
      type: String,
      enum: ["pending", "fulfilled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VendorOrder", VendorOrderSchema);