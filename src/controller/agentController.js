// // src/controllers/agentController.js
// const Agent = require("../models/agentModel");

// // Controller to create a new agent
// const createAgent = async (req, res) => {
//   const { username, password, name, mobileNumber } = req.body;

//   // Validate request
//   if (!username || !password || !name || !mobileNumber) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     // Check if the agent already exists
//     const existingAgent = await Agent.findOne({ username });
//     if (existingAgent) {
//       return res.status(400).json({ message: "Agent already exists" });
//     }

//     // Create a new agent
//     const newAgent = new Agent({ username, password, name, mobileNumber });
//     await newAgent.save();

//     return res.status(201).json({ message: "Agent created successfully" });
//   } catch (err) {
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // Login Agent function
// exports.loginAgent = async (req, res) => {
//     const { username, password } = req.body;
//     try {
//       // Check if the agent exists
//       const agent = await Agent.findOne({ username });
//       if (!agent) {
//         return res.status(404).json({ message: "Agent not found" });
//       }

//       // Verify password
//       if (agent.password !== password) {
//         return res.status(401).json({ message: "Invalid credentials" });
//       }

//       // If login successful
//       res.status(200).json({ message: "Login successful", agent });
//     } catch (error) {
//       res.status(500).json({ message: "Login failed", error });
//     }
//   };
// module.exports = { createAgent, loginAgent };
const Agent = require("../models/agentModel");

// Controller to create a new agent
const createAgent = async (req, res) => {
  const { username, password, name, mobileNumber } = req.body;

  // Validate request
  if (!username || !password || !name || !mobileNumber) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the agent already exists
    const existingAgent = await Agent.findOne({ username });
    if (existingAgent) {
      return res.status(400).json({ message: "Agent already exists" });
    }

    // Create a new agent
    const newAgent = new Agent({ username, password, name, mobileNumber });
    await newAgent.save();

    return res.status(201).json({ message: "Agent created successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Controller to login an agent
// const loginAgent = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Check if the agent exists
//     const agent = await Agent.findOne({ username });
//     if (!agent) {
//       return res.status(404).json({ message: "Agent not found" });
//     }

//     // Verify password
//     if (agent.password !== password) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // If login is successful
//     res.status(200).json({ message: "Login successful", agent });
//   } catch (error) {
//     res.status(500).json({ message: "Login failed", error });
//   }
// };

// src/controllers/agentController.js
const loginAgent = async (req, res) => {
  try {
    const { username, password } = req.body;
    const agent = await Agent.findOne({ username });

    // Check if the agent exists
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Check if the account is approved
    if (!agent.isActive) {
      return res.status(403).json({
        message: "Your account is not approved by admin. Please contact admin.",
      });
    }

    // Check password
    if (agent.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Successful login
    res.status(200).json({ message: "Login successful", agent });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

module.exports = { loginAgent /* other functions */ };

// Controller to fetch logged-in user data without authentication
const getLoggedInUserData = async (req, res) => {
  const { username } = req.body; // Assuming you send the username in the body

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    // Find the agent by username
    const agent = await Agent.findOne({ username });

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Send back user details (name and mobile number)
    const { name, mobileNumber } = agent;
    return res.status(200).json({
      message: "User data fetched successfully",
      data: { name, mobileNumber }, // Avoid sending the password for security
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

// Controller to get all agents
const getAllAgents = async (req, res) => {
  try {
    // Retrieve all agents
    const agents = await Agent.find({}, { password: 0 }); // Exclude passwords for security

    return res.status(200).json({
      message: "Agents retrieved successfully",
      data: agents,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

// Toggle agent activation status
// Toggle agent activation status (Activate/Deactivate)
const toggleAgentStatus = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Toggle the isActive status
    agent.isActive = !agent.isActive;
    await agent.save();

    return res.status(200).json({
      message: "Agent status updated",
      agent,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update agent status", error });
  }
};

// Controller to send data to a specific agent
const sendDataToAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Extract data from request body
    const { name, email, phoneNumber, description } = req.body;

    // Add message to agent's messagesSent array
    agent.messagesSent.push({ name, email, phoneNumber, description });
    await agent.save();

    res.status(200).json({ message: "Data sent to agent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send data to agent", error });
  }


  
};

module.exports = {
  createAgent,
  loginAgent,
  getLoggedInUserData,
  getAllAgents,
  toggleAgentStatus,
  sendDataToAgent,
};
