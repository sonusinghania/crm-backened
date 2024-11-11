const User = require("../models/user");

const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  // Check for admin credentials (You may want to store this securely)
  const adminUsername = "admin"; // Replace with environment variable
  const adminPassword = "admin123"; // Replace with environment variable

  if (username === adminUsername && password === adminPassword) {
    return res.status(200).json({ message: "Admin logged in successfully" });
  } else {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }
};

module.exports = { adminLogin };
