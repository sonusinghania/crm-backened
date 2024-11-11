const User = require("../models/user");

// Create a new user
const createUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const newUser = new User({ username, password }); // Hash password before saving
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

module.exports = { createUser, adminLogin };
