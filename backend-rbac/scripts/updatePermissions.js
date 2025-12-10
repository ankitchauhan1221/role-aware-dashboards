const connectDB = require("../src/config/db");
const User = require("../src/models/User");
const defaultPermissions = require("../src/utils/permissions");

async function updatePermissions() {
  try {
    await connectDB();
    console.log("Connected to database");

    // Update all users with default permissions based on their role
    const users = await User.find();

    for (const user of users) {
      user.permissions = [...defaultPermissions[user.role]];
      await user.save();
      console.log(`Updated permissions for ${user.email} (${user.role})`);
      console.log(`  Permissions: ${user.permissions.join(", ")}`);
    }

    console.log("\nPermissions updated successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error updating permissions:", error);
    process.exit(1);
  }
}

updatePermissions();
