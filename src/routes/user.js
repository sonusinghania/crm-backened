const express = require("express");
const { createUser, adminLogin } = require("../controllers/userController");
const router = express.Router();

// Admin Login Route
router.post("/admin/login", adminLogin);

// Create User Route
router.post("/create", createUser);

module.exports = router;
