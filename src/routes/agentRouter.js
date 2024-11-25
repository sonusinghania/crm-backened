// src/routes/agentRouter.js
const express = require("express");
// const { createAgent } = require("../controller/agentController");

const {
  createAgent,
  loginAgent,
  getLoggedInUserData,
  getAllAgents,
  toggleAgentStatus,
  sendDataInChunks,
  getSentDataForAgent,
  // sendDataToAgent,
} = require("../controller/agentController");
const router = express.Router();

// Route for creating a new agent
router.post("/create", createAgent);

// Route for logging in an agent
router.post("/login", loginAgent);

// Route for fetching all agents
router.get("/allagents", getAllAgents);

// Define the route to toggle agent activation status
router.patch("/toggle-active/:id", toggleAgentStatus);

// Route for fetching logged-in user data
router.post("/getLoggedInUserData", getLoggedInUserData);

// Route to send data to a specific agent
// router.post("/send-data/:id", sendDataToAgent);
// Route to send data to a specific agent
// router.post("/send-data/:id", sendDataToAgent);

// Route to send bulk data to an agent in chunks
router.post("/send-bulk-data/:id", sendDataInChunks);

// Route for fetching sent data for an individual agent
router.get("/sent-data/:id", getSentDataForAgent);

module.exports = router;
