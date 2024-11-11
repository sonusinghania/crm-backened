// // src/routes/route.js
// const express = require("express");
// const { loginUser } = require("../controller/controller");

// const router = express.Router();

// // Login route
// router.post("/api/user/login", loginUser);

// module.exports = router;
// src/routes/route.js
const express = require("express");
const { loginUser, createUser } = require("../controller/controller");

const router = express.Router();
const agentRouter = require("./agentRouter");
// Login route
router.post("/api/user/login", loginUser);

module.exports = router;
