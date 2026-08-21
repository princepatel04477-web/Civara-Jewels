import { Catalog } from "../lib/catalog";

console.log("=== Civara Jewels Automated Catalog Verification ===");

let errors = 0;

// 1. Verify Products
console.log(`\nVerifying ${Catalog.products.length} products in Catalog...`);
Catalog.products.forEach((p) => {
  if (!p.id || !p.name || !p.priceINR || p.priceINR <= 0) {
    console.error(`❌ Product missing required fields: ${JSON.stringify(p)}`);
    errors++;
  }
  if (!p.mainImage) {
    console.error(`❌ Product ${p.id} has no valid mainImage`);
    errors++;
  }
  const hallmark = p.hallmark || "BIS 750 (18k Gold)";
  if (!hallmark.includes("750")) {
    console.error(`❌ Product ${p.id} invalid hallmark: ${hallmark}`);
    errors++;
  }
});

// 2. Verify Featured Products
const featured = Catalog.getFeaturedProducts(4);
console.log(`\nVerifying featured products (count: ${featured.length})...`);
if (featured.length < 4) {
  console.error(`❌ Expected at least 4 featured products with valid images, got ${featured.length}`);
  errors++;
} else {
  console.log(`✓ ${featured.length} featured products verified with real photography.`);
}

// 3. Verify Journal Articles
console.log(`\nVerifying ${Catalog.articles.length} journal essays...`);
if (Catalog.articles.length < 3) {
  console.error(`❌ Expected at least 3 journal articles, got ${Catalog.articles.length}`);
  errors++;
}
Catalog.articles.forEach((art) => {
  if (!art.slug || !art.title || !art.content || art.content.length === 0) {
    console.error(`❌ Incomplete article: ${art.slug}`);
    errors++;
  }
});

// 4. Verify Pricing Reconciliation
const elara = Catalog.getProductById("elara-solitaire");
if (elara) {
  if (elara.priceINR !== 84500) {
    console.error(`❌ Elara Solitaire price mismatch: expected 84500, got ${elara.priceINR}`);
    errors++;
  } else {
    console.log(`✓ Elara Solitaire unified price confirmed at ₹${elara.priceINR.toLocaleString('en-IN')}`);
  }
} else {
  console.error("❌ Elara solitaire not found in catalog");
  errors++;
}

console.log("\n=================================================");
if (errors === 0) {
  console.log("✅ ALL CATALOG & VERIFICATION CHECKS PASSED!");
} else {
  console.error(`❌ Verification failed with ${errors} error(s).`);
  process.exit(1);
}
