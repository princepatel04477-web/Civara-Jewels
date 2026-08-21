import db, { runMigrations } from "../lib/db/client";
import { CollectionRepo } from "../lib/db/repo/collections";
import { ProductRepo } from "../lib/db/repo/products";
import { MetalRatesRepo } from "../lib/db/repo/metal-rates";
import { RingSizesRepo } from "../lib/db/repo/ring-sizes";
import { Catalog } from "../lib/catalog";
import fs from "fs";
import path from "path";

async function seedDatabase() {
  console.log("=== Civara Jewels Database Seeder ===");
  runMigrations(db);

  // 1. Ensure /data/uploads exists
  const uploadsDir = path.join(process.cwd(), "data", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // 2. Seed Initial 6 Categories
  console.log("\n1. Seeding categories (6 core categories)...");
  const collectionSlugToId: Record<string, number> = {};

  const defaultCollections = [
    {
      slug: "rings",
      name: "Rings",
      description: "Solitaires cut to catch the room rather than the camera. Handcrafted in 18k gold.",
      cover_image: "/images/home-cc/Rings-cc.png",
      sort_order: 1,
    },
    {
      slug: "bracelets",
      name: "Bracelets",
      description: "Hinged bangles and open diamond cuffs with tempered gold memory core.",
      cover_image: "/images/home-cc/Bracelets-cc.png",
      sort_order: 2,
    },
    {
      slug: "necklaces",
      name: "Necklace",
      description: "Liquid diamond tennis strands and architectural gold collars.",
      cover_image: "/images/home-cc/Necklaces-cc.png",
      sort_order: 3,
    },
    {
      slug: "pendants",
      name: "Pendant",
      description: "Geometric cages and constellation lockets suspended in 18k gold chains.",
      cover_image: "/images/home-cc/Pendants=cc.png",
      sort_order: 4,
    },
    {
      slug: "bridal",
      name: "Bridal",
      description: "Heirloom wedding sets and kundan choker suites crafted for generations.",
      cover_image: "/images/home-cc/bridal-cc.png",
      sort_order: 5,
    },
    {
      slug: "earrings",
      name: "Earrings",
      description: "Hollow-core ergonomic hoops and diamond waterfall drops.",
      cover_image: "/images/home-cc/Earrings-cc.png",
      sort_order: 6,
    },
  ];

  for (const c of defaultCollections) {
    let existing = CollectionRepo.getCollectionBySlug(c.slug);
    if (!existing) {
      existing = CollectionRepo.createCollection({
        slug: c.slug,
        name: c.name,
        description: c.description,
        cover_image: c.cover_image,
        sort_order: c.sort_order,
        is_active: 1,
      });
      console.log(`+ Created category: ${c.name} (${c.slug})`);
    } else {
      console.log(`• Category already exists: ${c.name}`);
    }
    collectionSlugToId[c.slug] = existing.id;
  }

  // 3. Seed Metal Rates (Per civara-admin.md requirement)
  console.log("\n2. Seeding metal rates...");
  const initialRates = [
    { metal: "Gold", purity: "18 KT", rate_inr: 69999 },
    { metal: "Gold", purity: "14 KT", rate_inr: 55999 },
    { metal: "Gold", purity: "10 KT", rate_inr: 42999 },
    { metal: "Silver", purity: "Silver", rate_inr: 26999 },
  ];

  for (const r of initialRates) {
    const existing = MetalRatesRepo.getRateByPurity(r.purity);
    if (!existing) {
      MetalRatesRepo.createRate({
        metal: r.metal,
        purity: r.purity,
        rate_inr: r.rate_inr,
        updated_by: "System Initializer",
      });
      console.log(`+ Seeded metal rate: ${r.purity} = ₹${r.rate_inr.toLocaleString("en-IN")}`);
    } else {
      console.log(`• Metal rate already exists: ${r.purity} (₹${existing.rate_inr.toLocaleString("en-IN")})`);
    }
  }

  // 4. Seed Ring Size Configuration
  console.log("\n3. Seeding ring size configuration...");
  const ringConfig = RingSizesRepo.getConfig();
  console.log(`• Ring sizes: Min ${ringConfig.min_size} to Max ${ringConfig.max_size} in ${ringConfig.increment} increments (Pricing: ${ringConfig.pricing_mode})`);

  // 5. Seed Products with 6 to 8 Photos Per Design
  console.log("\n4. Seeding products with 6–8 photos per design...");
  for (const p of Catalog.products) {
    let existing = ProductRepo.getProductBySlug(p.id);
    const collectionId = collectionSlugToId[p.category] || null;

    // Convert price to paise (₹1 = 100 paise)
    const pricePaise = p.priceINR * 100;
    const ringSizes = RingSizesRepo.generateSizeList();

    if (!existing) {
      const created = ProductRepo.createProduct({
        slug: p.id,
        sku: `CIV-${p.id.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10)}`,
        name: p.name,
        collection_id: collectionId,
        description: p.description,
        short_description: p.tagline || null,
        price_inr: pricePaise,
        sale_price_inr: null,
        pricing_mode: "MANUAL",
        metal: p.metalOptions?.[0] || "18k Yellow Gold",
        purity: "18 KT",
        metal_weight_g: 4.8,
        stone_type: p.stoneType || "Natural Diamond",
        stone_weight_ct: p.id.includes("solitaire") ? 1.0 : 0.5,
        diamond_carat: p.id.includes("solitaire") ? 1.0 : 0.5,
        diamond_clarity: "VS1",
        diamond_colour: "E-F",
        making_charges: Math.round(pricePaise * 0.12),
        other_charges: 150000, // ₹1,500 in paise
        metal_rate_ref: "18 KT",
        gst_percent: 3,
        available_sizes: p.sizeType === "ring" ? ringSizes : p.sizeOptions || ["10", "11", "12", "13", "14", "15", "16"],
        stock_quantity: 12,
        stock_status: "made-to-order",
        is_featured: ["elara-solitaire", "nira-stacking-band", "aethel-emerald-ring", "celeste-diamond-tennis-necklace"].includes(p.id) ? 1 : 0,
        is_published: 1,
        sort_order: 0,
      });

      console.log(`+ Created product: ${created.name} (₹${(created.price_inr / 100).toLocaleString("en-IN")})`);

      // Seed 6 to 8 photos for every design
      const baseImages = p.thumbnails || [p.mainImage || "/images/home-cc/Rings-cc.png"];
      const galleryPool = [
        p.mainImage || "/images/elara-solitaire-main.jpg",
        p.altImage || "/images/home-cc/Rings-cc.png",
        "/images/home-m-cc/Rings-m.png",
        "/images/home-cc/Necklaces-cc.png",
        "/images/home-cc/Earrings-cc.png",
        "/images/home-cc/Bracelets-cc.png",
        "/images/home-cc/bridal-cc.png",
        "/images/home-cc/Pendants=cc.png",
      ];

      // Assemble 6-8 distinct photo views
      const photosToSeed: string[] = [];
      for (const img of baseImages) {
        if (img && !photosToSeed.includes(img)) photosToSeed.push(img);
      }
      for (const poolImg of galleryPool) {
        if (photosToSeed.length >= 6) break;
        if (!photosToSeed.includes(poolImg)) photosToSeed.push(poolImg);
      }

      photosToSeed.forEach((imgPath, idx) => {
        const photoLabels = ["Main / Cover", "Front Angle", "Side Profile", "Macro Detail", "Setting Study", "Atelier Scale", "Lifestyle", "Packaging"];
        ProductRepo.addProductImage(
          created.id,
          imgPath,
          `${created.name} — ${photoLabels[idx] || `Photo ${idx + 1}`}`,
          idx === 0 ? 1 : 0,
          idx
        );
      });
      console.log(`  └─ Seeded ${photosToSeed.length} photos in gallery`);
    } else {
      console.log(`• Product already exists: ${p.name}`);
    }
  }

  console.log("\n✅ Database seeding complete!");
}

seedDatabase().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
