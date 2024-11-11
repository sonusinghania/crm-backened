// // src/models/model.js
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
// });

// const User = mongoose.model("User", userSchema);

// module.exports = User;
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Consider using hashed passwords
  role: { type: String, default: "user" }, // 'admin' or 'user'
});

const User = mongoose.model("User", userSchema);
module.exports = User;
