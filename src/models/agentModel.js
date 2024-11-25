// // src/models/agentModel.js
// const mongoose = require("mongoose");

// const agentSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   name: {
//     type: String,
//     required: true,
//   },
//   mobileNumber: {
//     type: String,
//     required: true,
//   },
// });

// const Agent = mongoose.model("Agent", agentSchema);

// module.exports = Agent;
// src/models/agentModel.js

// Model.js

// const mongoose = require("mongoose");

// const agentSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   name: {
//     type: String,
//     required: true,
//   },
//   mobileNumber: {
//     type: String,
//     required: true,
//   },
//   isActive: {
//     type: Boolean,
//     default: false, // Default to false, meaning inactive
//   },
// });

// const Agent = mongoose.model("Agent", agentSchema);

// module.exports = Agent;

const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  // messagesSent: { type: Array, default: [] },
  messagesSent: [
    {
      name: String,
      mobileNumber: String,
      companyName: String,
      productOrService: String,
      sentAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Agent = mongoose.model("Agent", agentSchema);

module.exports = Agent;
