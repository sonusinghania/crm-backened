// models/AgentData.js
const mongoose = require("mongoose");

// Define the schema for AgentData
const agentDataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create a model from the schema
const AgentData = mongoose.model("AgentData", agentDataSchema);

module.exports = AgentData;
