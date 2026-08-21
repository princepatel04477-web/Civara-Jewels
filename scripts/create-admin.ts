import { UserRepo } from "../lib/db/repo/users";
import { hashPassword } from "../lib/auth/password";
import readline from "readline";

async function createAdmin() {
  console.log("=== Civara Jewels Admin Provisioning ===");

  const args = process.argv.slice(2);
  let email = args[0];
  let password = args[1];
  let name = args[2] || "Civara Admin";

  if (!email || !password) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const question = (query: string): Promise<string> =>
      new Promise((resolve) => rl.question(query, resolve));

    try {
      email = await question("Enter Admin Email (default: admin@civarajewels.com): ");
      if (!email.trim()) email = "admin@civarajewels.com";

      name = await question("Enter Admin Name (default: Atelier Director): ");
      if (!name.trim()) name = "Atelier Director";

      password = await question("Enter Admin Password (min 8 chars, default: civara18k!): ");
      if (!password.trim()) password = "civara18k!";
    } finally {
      rl.close();
    }
  }

  if (password.length < 6) {
    console.error("❌ Password must be at least 6 characters.");
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  const user = UserRepo.upsertAdmin({
    email: email.trim().toLowerCase(),
    passwordHash,
    name: name.trim(),
  });

  console.log("\n✅ Admin user created/updated successfully:");
  console.log(`• ID: ${user.id}`);
  console.log(`• Email: ${user.email}`);
  console.log(`• Name: ${user.name}`);
  console.log(`• Role: ${user.role}`);
  console.log("\nYou can now log in at /admin/login.");
}

createAdmin().catch((err) => {
  console.error("❌ Error provisioning admin:", err);
  process.exit(1);
});
