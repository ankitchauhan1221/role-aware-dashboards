const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const defaultPermissions = require('../src/utils/permissions');

const initialUsers = [
  {"name":"System Administrator","email":"admin@example.com","password":"Admin@123","role":"ADMIN","extraPermissions":[]},
  {"name":"Project Manager","email":"manager@example.com","password":"Manager@123","role":"MANAGER","extraPermissions":[]},
  {"name":"John User","email":"john@example.com","password":"User@123","role":"USER","extraPermissions":[]},
  {"name":"Jane Analyst","email":"jane@example.com","password":"Analyst@123","role":"USER","extraPermissions":["view:reports"]}
];

async function seed() {
  await connectDB();
  for (const data of initialUsers) {
    let user = await User.findOne({ email: data.email });
    if (!user) {
      user = new User(data);
      user.permissions = [...defaultPermissions[data.role], ...data.extraPermissions];
      await user.save();
      console.log(`Seeded: ${data.email}`);
    }
  }
  process.exit(0);
}

seed();