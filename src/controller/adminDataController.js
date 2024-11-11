// controllers/agentDataController.js
const AgentData = require("../models/AdmindataModel");

// Create a new agent
const createAgentData = async (req, res) => {
  const { name, email, phoneNumber, description } = req.body;

  try {
    const newAgent = new AgentData({
      name,
      email,
      phoneNumber,
      description,
    });
    await newAgent.save();
    res.status(201).json(newAgent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all agents
const getAgentData = async (req, res) => {
  try {
    const agents = await AgentData.find();
    res.status(200).json(agents);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a specific agent by ID
const getAgentDataById = async (req, res) => {
  try {
    const agent = await AgentData.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    res.status(200).json(agent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update agent data by ID
const updateAgentData = async (req, res) => {
  try {
    const updatedAgent = await AgentData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAgent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    res.status(200).json(updatedAgent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete agent data by ID
const deleteAgentData = async (req, res) => {
  try {
    const deletedAgent = await AgentData.findByIdAndDelete(req.params.id);
    if (!deletedAgent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    res.status(200).json({ message: "Agent deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createAgentData,
  getAgentData,
  getAgentDataById,
  updateAgentData,
  deleteAgentData,
};
