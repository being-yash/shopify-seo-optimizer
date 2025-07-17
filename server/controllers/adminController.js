const Vendor = require("../models/Vendor");
const bcrypt = require("bcrypt");

exports.createVendor = async (req, res) => {
  try {
    const { shop_domain, name, email, phone, password, commission_rate } = req.body;

    if (!shop_domain || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Vendor.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Vendor with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const vendor = await Vendor.create({
      shop_domain,
      name,
      email,
      phone,
      password: hashedPassword,
      commission_rate: commission_rate || 0.15
    });

    return res.status(201).json({
      message: "Vendor created successfully",
      vendor: {
        _id: vendor._id,
        name: vendor.name,
        email: vendor.email
      }
    });
  } catch (err) {
    console.error("Create vendor error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
