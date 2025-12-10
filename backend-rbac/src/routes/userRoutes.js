const express = require("express");
const userController = require("../controllers/userController");
const requireAuth = require("../middlewares/authMiddleware");
const requirePermission = require("../middlewares/permissionMiddleware");

const router = express.Router();

// USER: Get/Edit me (MUST come before /:id routes)
router.get(
  "/me",
  requireAuth,
  requirePermission("read:profile"),
  userController.getMe
);
router.patch(
  "/me",
  requireAuth,
  requirePermission("edit:profile"),
  userController.updateUser
);

// ADMIN/MANAGER: Get users
router.get(
  "/",
  requireAuth,
  requirePermission("read:users"),
  userController.getUsers
);

// ADMIN: Create user
router.post(
  "/",
  requireAuth,
  requirePermission("manage:users"),
  userController.createUser
);

// ADMIN/MANAGER: Update user
router.patch(
  "/:id",
  requireAuth,
  requirePermission("edit:users"),
  userController.updateUser
);

// ADMIN: Delete user
router.delete(
  "/:id",
  requireAuth,
  requirePermission("delete:users"),
  userController.deleteUser
);

module.exports = router;
