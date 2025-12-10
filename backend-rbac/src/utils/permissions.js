const defaultPermissions = {
  ADMIN: [
    "manage:users",
    "read:users",
    "edit:users",
    "delete:users",
    "view:reports",
    "read:profile",
    "edit:profile",
  ],
  MANAGER: [
    "read:users",
    "edit:users",
    "view:reports",
    "read:profile",
    "edit:profile",
  ],
  USER: ["read:profile", "edit:profile"],
};

module.exports = defaultPermissions;
