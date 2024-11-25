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
const mongoose = require("mongoose");
const Agent = require("../models/agentModel");
const Lead = require("../models/Lead");
const fs = require("fs");
const path = require("path");
// Helper function to read JSON file and parse it
const readJSONFile = () => {
  try {
    const filePath = path.join(__dirname, "..", "userData.json"); // Correct path to userData.json
    console.log("File path: ", filePath);
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading or parsing JSON file:", error);
    throw new Error("Failed to read or parse the JSON file.");
  }
};

// Schema for tracking sent leads
const SentLeadSchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
});

const SentLead = mongoose.model("SentLead", SentLeadSchema);

const sendDataInChunks = async (req, res) => {
  try {
    // Read the data from the JSON file
    const leadsData = readJSONFile();

    // Ensure the data is an array
    if (!Array.isArray(leadsData)) {
      return res
        .status(500)
        .json({ message: "Invalid data format in userData.json" });
    }

    // Get the agent's ID from the URL parameter
    const agentId = req.params.id;

    // Find the agent in the database
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Find all already sent leads
    const sentLeads = await SentLead.find({}, { leadId: 1 });

    // Extract the IDs of already sent leads
    const sentLeadIds = sentLeads.map((item) => item.leadId.toString());

    // Filter out already sent leads from the data
    const unsentLeads = leadsData.filter(
      (lead) => !sentLeadIds.includes(lead._id.$oid)
    );

    // Determine the next chunk of unsent leads to send (20 at a time)
    const leadsToSend = unsentLeads.slice(0, 20);

    // If there are no more unsent leads
    if (leadsToSend.length === 0) {
      return res.status(200).json({ message: "No more leads to send" });
    }

    // Filter the data to include only the required fields
    const filteredLeads = leadsToSend.map((lead) => ({
      name: lead.name,
      mobileNumber: lead.mobileNumber,
      productOrService: lead.productOrService,
      companyName: lead.companyName,
    }));

    // Save the filtered leads to the database
    await Lead.insertMany(filteredLeads);

    // Track these leads as sent
    const sentLeadRecords = leadsToSend.map((lead) => ({
      leadId: new mongoose.Types.ObjectId(lead._id.$oid),
    }));
    await SentLead.insertMany(sentLeadRecords);

    // Update the agent's messagesSent array
    agent.messagesSent.push(...filteredLeads);
    await agent.save();

    // Send the response back to the client
    res.status(200).json({
      message: `Sent ${filteredLeads.length} leads to agent`,
      data: filteredLeads,
    });
  } catch (error) {
    console.error("Error sending leads:", error);
    res
      .status(500)
      .json({ message: "Failed to send leads", error: error.message });
  }
};

// In this added data IN chunk

// const sendDataInChunks = async (req, res) => {
//   try {
//     // Read the data from the JSON file
//     const leadsData = readJSONFile();

//     if (!Array.isArray(leadsData)) {
//       return res
//         .status(500)
//         .json({ message: "Invalid data format in userData.json" });
//     }

//     // Get the agent's ID from the URL parameter
//     const agentId = req.params.id;

//     // Find the agent in the database
//     const agent = await Agent.findById(agentId);
//     if (!agent) {
//       return res.status(404).json({ message: "Agent not found" });
//     }

//     // Find all leads already sent by this agent
//     const sentLeads = await SentLead.find(
//       { agentId: agent._id },
//       { leadId: 1 }
//     );

//     // Extract the IDs of already sent leads
//     const sentLeadIds = sentLeads.map((item) => item.leadId.toString());

//     // Filter out already sent leads from the data
//     const unsentLeads = leadsData.filter(
//       (lead) => !sentLeadIds.includes(lead._id.$oid)
//     );

//     // Determine the next chunk of unsent leads to send (20 at a time)
//     const leadsToSend = unsentLeads.slice(0, 20);

//     if (leadsToSend.length === 0) {
//       return res.status(200).json({ message: "No more leads to send" });
//     }

//     // Filter the data to include only the required fields and add timestamp
//     const filteredLeads = leadsToSend.map((lead) => ({
//       name: lead.name,
//       mobileNumber: lead.mobileNumber,
//       productOrService: lead.productOrService,
//       companyName: lead.companyName,
//       sentAt: new Date(), // Add a timestamp for when the lead is sent
//     }));

//     // Save the filtered leads to the database
//     await Lead.insertMany(filteredLeads);

//     // Track these leads as sent, associated with the agent
//     const sentLeadRecords = leadsToSend.map((lead) => ({
//       leadId: new mongoose.Types.ObjectId(lead._id.$oid),
//       agentId: agent._id,
//     }));
//     await SentLead.insertMany(sentLeadRecords);

//     // Update the agent's messagesSent array
//     agent.messagesSent.push(...filteredLeads);
//     await agent.save();

//     // Send the response back to the client
//     res.status(200).json({
//       message: `Sent ${filteredLeads.length} leads to agent`,
//       data: filteredLeads,
//     });
//   } catch (error) {
//     console.error("Error sending leads:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to send leads", error: error.message });
//   }
// };

// Controller to get sent data for an agent
const getSentDataForAgent = async (req, res) => {
  try {
    // Get the agent's ID from the URL parameter
    const agentId = req.params.id;

    // Find the agent in the database
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Respond with the sent data
    res.status(200).json({
      message: "Retrieved sent data successfully",
      data: agent.messagesSent, // Assuming messagesSent contains the sent leads
    });
  } catch (error) {
    console.error("Error fetching sent data:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch sent data", error: error.message });
  }
};

// +++++++++++++++ Working Data+++++++++++++++++++++++++++++++++++
// Function to send data in chunks
// const sendDataInChunks = async (req, res) => {
//   try {
//     // Read the data from the JSON file
//     const leadsData = readJSONFile();

//     // Ensure the data is an array
//     if (!Array.isArray(leadsData)) {
//       return res
//         .status(500)
//         .json({ message: "Invalid data format in userData.json" });
//     }

//     // Get the agent's ID from the URL parameter
//     const agentId = req.params.id;

//     // Find the agent in the database
//     const agent = await Agent.findById(agentId);
//     if (!agent) {
//       return res.status(404).json({ message: "Agent not found" });
//     }

//     // Find out how many leads are already sent
//     let sentLeadsCount = agent.messagesSent ? agent.messagesSent.length : 0;

//     // Determine the next chunk of leads to send (20 at a time)
//     const leadsToSend = leadsData.slice(sentLeadsCount, sentLeadsCount + 20);

//     // If there are no more leads to send
//     if (leadsToSend.length === 0) {
//       return res.status(200).json({ message: "No more leads to send" });
//     }

//     // Filter the data to include only the required fields
//     const filteredLeads = leadsToSend.map((lead) => ({
//       name: lead.name,
//       mobileNumber: lead.mobileNumber,
//       productOrService: lead.productOrService,
//       companyName: lead.companyName,
//     }));

//     // Save the filtered leads to the database
//     await Lead.insertMany(filteredLeads);

//     // Update the agent's messagesSent array
//     agent.messagesSent.push(...filteredLeads);
//     await agent.save();

//     // Send the response back to the client
//     res.status(200).json({
//       message: `Sent ${filteredLeads.length} leads to agent`,
//       data: filteredLeads,
//     });
//   } catch (error) {
//     console.error("Error sending leads:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to send leads", error: error.message });
//   }
// };

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
// const getLoggedInUserData = async (req, res) => {
//   const { username } = req.body; // Assuming you send the username in the body

//   if (!username) {
//     return res.status(400).json({ message: "Username is required" });
//   }

//   try {
//     // Find the agent by username
//     const agent = await Agent.findOne({ username });

//     if (!agent) {
//       return res.status(404).json({ message: "Agent not found" });
//     }

//     // Send back user details (name and mobile number)
//     const { name, mobileNumber } = agent;
//     return res.status(200).json({
//       message: "User data fetched successfully",
//       data: { name, mobileNumber }, // Avoid sending the password for security
//     });
//   } catch (err) {
//     return res.status(500).json({ message: "Server error", error: err });
//   }
// };
// Controller to fetch logged-in user data with messagesSent array
// const getLoggedInUserData = async (req, res) => {
//   const { username } = req.body;

//   if (!username) {
//     return res.status(400).json({ message: "Username is required" });
//   }

//   try {
//     // Find the agent by username
//     const agent = await Agent.findOne({ username });

//     if (!agent) {
//       return res.status(404).json({ message: "Agent not found" });
//     }

//     // Log the agent object to check if messagesSent is there
//     // This is for debugging
//     // console.log(agent);

//     // Check if messagesSent exists and is an array
//     const { name, mobileNumber, messagesSent } = agent;

//     if (!Array.isArray(messagesSent) || messagesSent.length === 0) {
//       // If messagesSent is empty or not an array, handle accordingly
//       console.log("No messages found for this agent.");
//     }

//     // Return the response with name, mobileNumber, and messagesSent
//     return res.status(200).json({
//       message: "User data fetched successfully",
//       data: { name, mobileNumber, messagesSent },
//     });
//   } catch (err) {
//     return res.status(500).json({ message: "Server error", error: err });
//   }
// };

// ========= Sorted here +++++++++++++++
const getLoggedInUserData = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    // Find the agent by username
    const agent = await Agent.findOne({ username });

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Extract necessary fields
    const { name, mobileNumber, messagesSent } = agent;

    if (!Array.isArray(messagesSent) || messagesSent.length === 0) {
      console.log("No messages found for this agent.");
    }

    // Sort messagesSent array by sentAt in descending order to get latest data first
    const sortedMessages = messagesSent.sort((a, b) => {
      // Ensure sentAt exists and is a valid date
      const dateA = new Date(a.sentAt);
      const dateB = new Date(b.sentAt);

      // Sort in descending order (latest first)
      return dateB - dateA;
    });

    // Return the response with sorted data
    return res.status(200).json({
      message: "User data fetched successfully",
      data: { name, mobileNumber, messagesSent: sortedMessages },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

// Controller to get all agents
const getAllAgents = async (req, res) => {
  try {
    // Retrieve all agents name
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
// const sendDataToAgent = async (req, res) => {
//   try {
//     const agent = await Agent.findById(req.params.id);
//     if (!agent) {
//       return res.status(404).json({ message: "Agent not found" });
//     }

//     // Extract data from request body
//     const { name, email, phoneNumber, description } = req.body;

//     // Add message to agent's messagesSent array
//     agent.messagesSent.push({ name, email, phoneNumber, description });
//     await agent.save();

//     res.status(200).json({ message: "Data sent to agent successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to send data to agent", error });
//   }
// };

module.exports = {
  createAgent,
  loginAgent,
  getLoggedInUserData,
  getAllAgents,
  toggleAgentStatus,
  sendDataInChunks,
  getSentDataForAgent,
  // sendDataToAgent,
};
