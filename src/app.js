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

// src / app.js;
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./db/conn");
// const routes = require("./routes/route");
// const multer = require("multer");
// const csvtojson = require("csvtojson");
// const path = require("path");
// const fs = require("fs");
// const { MongoClient } = require("mongodb");

// const app = express();
// const PORT = 5000;

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json()); // to parse JSON request body

// // File upload setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage });

// // Route for uploading CSV file and inserting data into MongoDB
// app.post("/upload-csv", upload.single("file"), async (req, res) => {
//   try {
//     const csvFilePath = path.join(__dirname, "uploads", req.file.filename);
//     const jsonData = await csvtojson().fromFile(csvFilePath);

//     // Insert data into MongoDB
//     const client = await MongoClient.connect("mongodb://localhost:27017");
//     const db = client.db("crmdb");
//     await db.collection("importedData").insertMany(jsonData);

//     // Clean up uploaded file
//     fs.unlinkSync(csvFilePath);

//     res.status(200).json({ message: "CSV data imported successfully" });
//   } catch (error) {
//     console.error("Error importing data:", error);
//     res.status(500).json({ message: "Failed to import CSV data" });
//   }
// });

// // Use routes for other API routes
// app.use(routes);

// // Admin data routes
// const adminDataRouter = require("./routes/admindataRouter");
// app.use("/api/admin-data", adminDataRouter);

// // Agents routes
// const agentRouter = require("./routes/agentRouter");
// app.use("/api/agents", agentRouter);

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
