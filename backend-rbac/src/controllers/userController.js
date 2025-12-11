const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const defaultPermissions = require("../utils/permissions");

// Get all users (ADMIN sees all, MANAGER sees only USER/MANAGER)
exports.getUsers = async (req, res) => {
  try {
    let query = {};
    // MANAGER cannot see ADMIN users
    if (req.user.role === "MANAGER") {
      query.role = { $ne: "ADMIN" };
    }
    const users = await User.find(query).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create user (ADMIN)
exports.createUser = [
  body("name").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("role").isIn(["ADMIN", "MANAGER", "USER"]),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const user = new User(req.body);
      user.permissions = [
        ...defaultPermissions[req.body.role],
        ...(req.body.extraPermissions || []),
      ];
      await user.save();
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
];

// Update user (ADMIN can edit anyone, MANAGER can only edit USER/MANAGER, not ADMIN)
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Authorization: only ADMIN can edit ADMINs; MANAGER can only edit USER/MANAGER (not ADMIN)
    if (req.user.role === "MANAGER" && user.role === "ADMIN") {
      return res
        .status(403)
        .json({ message: "MANAGER cannot edit ADMIN users" });
    }

    // Update fields (exclude role change for MANAGER/USER)
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = req.body.password; // Hashed in pre-save
    if (req.user.role === "ADMIN" && req.body.role) user.role = req.body.role;
    if (req.user.role === "ADMIN" && req.body.extraPermissions) {
      user.permissions = [
        ...defaultPermissions[user.role],
        ...req.body.extraPermissions,
      ];
    }

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user (ADMIN)
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get self (USER)
exports.getMe = async (req, res) => {
  res.json(req.user);
};
