const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../config/jwt");
const defaultPermissions = require("../utils/permissions");

// Register
exports.register = [
  body("name").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("role").isIn(["ADMIN", "MANAGER", "USER"]),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "User exists" });

      user = new User({ name, email, password, role });
      user.permissions = [
        ...defaultPermissions[role],
        ...(req.body.extraPermissions || []),
      ];
      await user.save();
      res.status(201).json({ message: "User registered" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
];

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const refreshDoc = new RefreshToken({
      token: refreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await refreshDoc.save();

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Refresh
exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token required" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      userId: decoded.id,
    });
    if (!storedToken)
      return res.status(401).json({ message: "Invalid refresh token" });

    const user = await User.findById(decoded.id);
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Rotate refresh token
    storedToken.token = newRefreshToken;
    storedToken.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await storedToken.save();

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Logout
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ message: "Refresh token required" });

  await RefreshToken.deleteOne({ token: refreshToken });
  res.json({ message: "Logged out" });
};
