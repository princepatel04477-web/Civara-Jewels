import db, { runMigrations } from "../lib/db/client";
import { ProductRepo } from "../lib/db/repo/products";
import { CollectionRepo } from "../lib/db/repo/collections";

async function insertAurelia() {
  console.log("=== Inserting Aurelia Pavé Solitaire Diamond Ring ===");
  runMigrations(db);

  // 1. Get or create Rings category
  let ringsCol = CollectionRepo.getCollectionBySlug("rings");
  if (!ringsCol) {
    ringsCol = CollectionRepo.createCollection({
      slug: "rings",
      name: "Rings",
      description: "Solitaires cut to catch the room rather than the camera. Handcrafted in 18k gold.",
      cover_image: "/images/home-cc/Rings-cc.png",
      sort_order: 1,
      is_active: 1,
    });
  }

  const ringSizes = [
    "3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5", "13", "13.5", "14", "14.5", "15"
  ];

  // 2. Check if product already exists
  const slug = "aurelia-pave-solitaire-diamond-ring";
  const existing = ProductRepo.getProductBySlug(slug);

  const productData = {
    slug,
    sku: "CIV-RNG-SOL-088",
    name: "Aurelia Pavé Solitaire Diamond Ring",
    collection_id: ringsCol.id,
    description: "Handcrafted in luminous 18k yellow gold, this exquisite ring features a brilliant center diamond secured in an elevated four-prong basket, beautifully enhanced by shimmering French micropavé diamonds along the shank. Designed with timeless elegance and meticulous craftsmanship, it serves as a stunning engagement ring or refined luxury statement.",
    short_description: "A radiant solitaire perched above a delicate micropavé diamond band.",
    price_inr: 185000 * 100, // ₹185,000 in paise
    sale_price_inr: 165000 * 100, // ₹165,000 in paise
    pricing_mode: "MANUAL" as const,
    metal: "18k Yellow Gold",
    purity: "18 KT",
    metal_weight_g: 3.40,
    stone_type: "Natural Diamond",
    stone_weight_ct: 1.25,
    diamond_carat: 1.25,
    diamond_clarity: "VS1",
    diamond_colour: "G-H",
    making_charges: 8500 * 100, // ₹8,500 in paise
    other_charges: 1500 * 100, // ₹1,500 in paise
    metal_rate_ref: "18 KT",
    gst_percent: 3,
    available_sizes: ringSizes,
    stock_quantity: 10,
    stock_status: "made-to-order" as const,
    is_featured: 1,
    is_published: 1,
    sort_order: 1,
  };

  let productId: number;

  if (existing) {
    console.log(`• Updating existing piece: ${existing.name} (ID: ${existing.id})`);
    ProductRepo.updateProduct(existing.id, productData);
    productId = existing.id;
    // Clear old images so we cleanly insert the 6 new photos
    db.prepare("DELETE FROM product_images WHERE product_id = ?").run(productId);
  } else {
    console.log(`+ Creating new piece: ${productData.name}`);
    const created = ProductRepo.createProduct(productData);
    productId = created.id;
  }

  // 3. Add all 6 photos
  const photos = [
    { path: "/images/products/aurelia/aurelia-1.jpg", alt: "Aurelia Pavé Solitaire Diamond Ring — Elevated 4-Prong Basket & Solitaire View", isPrimary: 1 },
    { path: "/images/products/aurelia/aurelia-2.jpg", alt: "Aurelia Pavé Solitaire Diamond Ring — Front Profile & French Micropavé Band", isPrimary: 0 },
    { path: "/images/products/aurelia/aurelia-3.jpg", alt: "Aurelia Pavé Solitaire Diamond Ring — Diagonal Atelier Perspective", isPrimary: 0 },
    { path: "/images/products/aurelia/aurelia-4.jpg", alt: "Aurelia Pavé Solitaire Diamond Ring — Macro Diamond Table & Pavilion Study", isPrimary: 0 },
    { path: "/images/products/aurelia/aurelia-5.jpg", alt: "Aurelia Pavé Solitaire Diamond Ring — Hand Model Scale & Scintillation", isPrimary: 0 },
    { path: "/images/products/aurelia/aurelia-6.jpg", alt: "Aurelia Pavé Solitaire Diamond Ring — Side Gallery & Gold Hallmark Detail", isPrimary: 0 },
  ];

  photos.forEach((photo, idx) => {
    ProductRepo.addProductImage(productId, photo.path, photo.alt, photo.isPrimary, idx);
    console.log(`  └─ Added photo #${idx + 1}: ${photo.path}`);
  });

  console.log("\n✅ Aurelia Pavé Solitaire Diamond Ring successfully listed with all 6 photos!");
}

insertAurelia().catch((err) => {
  console.error("❌ Insertion failed:", err);
  process.exit(1);
});
