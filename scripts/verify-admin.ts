import db from "../lib/db/client";
import { UserRepo } from "../lib/db/repo/users";
import { ProductRepo } from "../lib/db/repo/products";
import { CollectionRepo } from "../lib/db/repo/collections";
import { hashPassword, verifyPassword } from "../lib/auth/password";
import { Catalog } from "../lib/catalog";

async function verifyAdminSystem() {
  console.log("=== Civara Jewels Admin System Verification ===");
  let errors = 0;

  // 1. Verify DB Tables
  console.log("\n1. Verifying SQLite Database Tables...");
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as { name: string }[];
  const tableNames = tables.map((t) => t.name);
  const requiredTables = ["users", "collections", "products", "product_images", "_migrations"];

  for (const req of requiredTables) {
    if (!tableNames.includes(req)) {
      console.error(`❌ Missing table: ${req}`);
      errors++;
    } else {
      console.log(`✓ Table exists: ${req}`);
    }
  }

  // 2. Verify User Auth & Password Hash
  console.log("\n2. Verifying Admin Authentication...");
  const admin = UserRepo.findByEmail("admin@civarajewels.com");
  if (!admin) {
    console.error("❌ Admin user not found in database");
    errors++;
  } else {
    const isPasswordValid = await verifyPassword("civara18k!", admin.password_hash);
    if (!isPasswordValid) {
      console.error("❌ Admin password verification failed");
      errors++;
    } else {
      console.log(`✓ Admin user verified: ${admin.email} (ID: ${admin.id}, Role: ${admin.role})`);
    }
  }

  // 3. Verify Collections CRUD
  console.log("\n3. Testing Collection Repository CRUD...");
  const testColSlug = `test-col-${Date.now()}`;
  const newCol = CollectionRepo.createCollection({
    name: "Test Atelier Edit",
    slug: testColSlug,
    description: "Temporary testing collection",
    sort_order: 99,
  });

  if (!newCol || newCol.slug !== testColSlug) {
    console.error("❌ Failed to create test collection");
    errors++;
  } else {
    console.log(`✓ Created collection: ${newCol.name} (ID: ${newCol.id})`);
    const fetched = CollectionRepo.getCollectionById(newCol.id);
    if (!fetched || fetched.name !== "Test Atelier Edit") {
      console.error("❌ Failed to fetch created collection");
      errors++;
    } else {
      console.log(`✓ Fetched collection by ID: ${fetched.name}`);
    }
    CollectionRepo.deleteCollection(newCol.id);
    console.log(`✓ Cleaned up test collection`);
  }

  // 4. Verify Products CRUD & Image Linkage
  console.log("\n4. Testing Product Repository & Image Linkage...");
  const testProdSlug = `test-solitaire-${Date.now()}`;
  const newProd = ProductRepo.createProduct({
    name: "Test Solitaire Diamond Ring",
    slug: testProdSlug,
    price_inr: 9500000, // ₹95,000 in paise
    metal: "18k Yellow Gold",
    metal_weight_g: 5.2,
    diamond_carat: 1.2,
    is_published: 1,
    is_featured: 1,
  });

  if (!newProd) {
    console.error("❌ Failed to create test product");
    errors++;
  } else {
    console.log(`✓ Created test product: ${newProd.name} (₹${newProd.price_inr / 100})`);

    // Add Image
    const img1 = ProductRepo.addProductImage(newProd.id, "/images/home-cc/Rings-cc.png", "Test Front", 1);
    const img2 = ProductRepo.addProductImage(newProd.id, "/images/home-m-cc/Rings-m.png", "Test Angle", 0);

    const images = ProductRepo.listProductImages(newProd.id);
    if (images.length !== 2) {
      console.error(`❌ Expected 2 images, got ${images.length}`);
      errors++;
    } else {
      console.log(`✓ Linked 2 product images (Primary: ${images[0].path})`);
    }

    // Verify Catalog mapping
    const mapped = Catalog.getProductById(testProdSlug);
    if (!mapped || mapped.priceINR !== 95000) {
      console.error("❌ Catalog dynamic DB read failed for test product");
      errors++;
    } else {
      console.log(`✓ Public Catalog successfully read product from SQLite: ₹${mapped.priceINR}`);
    }

    // Delete Product (cascade test)
    ProductRepo.deleteProduct(newProd.id);
    const deletedImages = ProductRepo.listProductImages(newProd.id);
    if (deletedImages.length > 0) {
      console.error("❌ Product image cascade deletion failed");
      errors++;
    } else {
      console.log(`✓ Product and images cascaded deletion successfully`);
    }
  }

  // 5. Verify IP Allowlist Parsing
  console.log("\n5. Verifying IP Allowlist Environment Configuration...");
  const allowed = (process.env.ADMIN_ALLOWED_IPS || "192.168.29.44,127.0.0.1,::1,localhost").split(",");
  if (!allowed.includes("192.168.29.44")) {
    console.error("❌ 192.168.29.44 not in ADMIN_ALLOWED_IPS");
    errors++;
  } else {
    console.log(`✓ Verified target LAN IP 192.168.29.44 is in allowlist: [${allowed.join(", ")}]`);
  }

  console.log("\n=================================================");
  if (errors === 0) {
    console.log("✅ ALL ADMIN SYSTEM VERIFICATION CHECKS PASSED (100%)!");
  } else {
    console.error(`❌ Admin verification failed with ${errors} error(s).`);
    process.exit(1);
  }
}

verifyAdminSystem().catch((err) => {
  console.error("Verification crashed:", err);
  process.exit(1);
});
