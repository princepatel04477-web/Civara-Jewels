import db, { runMigrations } from "../lib/db/client";

console.log("=== Civara Jewels Database Migration ===");
try {
  runMigrations(db);
  console.log("✅ All migrations applied successfully.");
} catch (error) {
  console.error("❌ Migration failed:", error);
  process.exit(1);
}
