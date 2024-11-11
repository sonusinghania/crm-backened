// // src/controllers/controller.js
// const User = require("../models/model");

// exports.loginUser = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // Directly check the password (not secure)
//     if (user.password !== password) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // Return the user data without any tokens
//     res.json({ user: { id: user._id, username: user.username } });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
// src/controllers/controller.js
const User = require("../models/model");

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Directly check the password (not secure)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Return the user data without any tokens
    res.json({
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// New function to create a user
exports.createUser = async (req, res) => {
  const { username, password, role } = req.body;

  // Here you may want to check if the logged-in user is an admin.
  // Since this is a simple project without JWT, we assume that the request is from an admin.
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      username,
      password, // Make sure to hash passwords in a real application!
      role: role || "user", // Default to user role
    });

    await newUser.save();
    res
      .status(201)
      .json({
        message: "User created successfully",
        user: { id: newUser._id, username: newUser.username },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
