const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("=== Resetting Civara Database ===");

const dbPath = path.join(process.cwd(), "data", "civara.db");
const dbWalPath = path.join(process.cwd(), "data", "civara.db-wal");
const dbShmPath = path.join(process.cwd(), "data", "civara.db-shm");

[dbPath, dbWalPath, dbShmPath].forEach((file) => {
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
      console.log(`Removed: ${file}`);
    } catch (e) {
      console.warn(`Could not remove ${file}: ${e.message}`);
    }
  }
});

console.log("\nRunning migrations...");
execSync("npx tsx scripts/migrate.ts", { stdio: "inherit" });

console.log("\nRunning seeder...");
execSync("npx tsx scripts/seed.ts", { stdio: "inherit" });

console.log("\nCreating default admin account...");
execSync("npx tsx scripts/create-admin.ts admin@civarajewels.com civara18k! \"Atelier Director\"", { stdio: "inherit" });

console.log("\n✅ Database reset & reseed completed successfully!");
