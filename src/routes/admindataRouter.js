const express = require("express");
const router = express.Router();
const agentDataController = require("../controller/adminDataController");

// Route to create a new agent
router.post("/admindatacreate", agentDataController.createAgentData);

// Route to get all agents
router.get("/getadmindata", agentDataController.getAgentData);

// Route to get an agent by ID
router.get("/admindata/:id", agentDataController.getAgentDataById);

// Route to update agent data by ID
router.put("/admindataput/:id", agentDataController.updateAgentData);

// Route to delete an agent by ID
router.delete("/admindatadelete/:id", agentDataController.deleteAgentData);

module.exports = router;
