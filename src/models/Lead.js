// models/Lead.js

const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  mobileNumber: { type: String },
  companyName: { type: String },
  statename: { type: String },
  cityname: { type: String },
  productOrService: { type: String },
  whatsappConfirmed: { type: Boolean, default: false },
  leadsViewed: { type: Number, default: 0 },
  plan: { type: String, default: "Free" },
  leadsResetDate: { type: Date },
  viewedLeads: { type: Array, default: [] },
});

module.exports = mongoose.model("Lead", leadSchema);
