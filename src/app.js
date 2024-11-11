// src/app.js
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/conn");
const routes = require("./routes/route");
const app = express();
const PORT = 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // to parse JSON request body

// Use routes
app.use(routes);
const agentRouter = require("./routes/agentRouter");

// Admin data routes
const adminDataRouter = require("./routes/admindataRouter");
app.use("/api/admin-data", adminDataRouter);

app.use("/api/agents", agentRouter);
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
