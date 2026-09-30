const { createClient } = require('@libsql/client');

const TURSO_URL = process.env.TURSO_DATABASE_URL || 'libsql://civara-jewels-princepatel04477-web.aws-ap-south-1.turso.io';
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTA2NzY4OTUsImlkIjoiMDFhMGVjYTUtNTQwMS03YjMzLWFjOGQtYjRiMTM0YzViMzMyIiwia2lkIjoiOWoyZkVvNUVJR1FXa1dvcTVXOGtqVTZxaWI2SzJWdFFYeGgzNUVCSWJ2dyIsInJpZCI6ImVkMjA2ZTdjLTFmNWQtNDEzOC04ZjJmLWU1YTAyYzgzOTdmYSJ9._FwAJ4e6rFooJQlgLIZLaXRdJOJ4zo1Tputnmmr2I4q28WsnAoMb43XuVxW_AzREncWxrY2a-d-eTK6avxZmCw';

const client = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN,
});

async function main() {
  console.log('Seeding essentials to Turso...');

  // 1. Users
  await client.execute({
    sql: `INSERT INTO users (email, password_hash, name, role, created_at)
          VALUES 
            ('varunyatechnologies@gmail.com', '$2b$10$g4LBdnGHbdj.5QVTMKOZ.udR7Vcmm2gqRss2i3doHrfykjCW1bTA6', 'Varunya Technologies Admin', 'admin', datetime('now')),
            ('admin@civarajewels.com', '$2b$10$Awxmbk4wqCLHGRA.aGnnj.PiHmymKkfxvGgCOl6ekCD.qzOF8bLIu', 'Civara Master Admin', 'admin', datetime('now')),
            ('seller@civarajewels.com', '$2b$10$MKuetQcBMyMRqlLeG2Ib3ur.Wd1AOpEXabFqD5NPMyXD.ndLKrjBy', 'Civara Atelier Seller', 'seller', datetime('now'))
          ON CONFLICT(email) DO UPDATE SET 
            password_hash = excluded.password_hash,
            name = excluded.name,
            role = excluded.role;`,
  });
  console.log('✅ Users seeded successfully.');

  // 2. Collections
  const defaultCollections = [
    { slug: 'rings', name: 'Rings', description: 'Solitaires cut to catch the room rather than the camera. Handcrafted in 18k gold.', cover_image: '/images/home-cc/Rings-cc.png', sort_order: 1 },
    { slug: 'earrings', name: 'Earrings', description: 'Hollow-core ergonomic hoops and diamond waterfall drops.', cover_image: '/images/home-cc/Earrings-cc.png', sort_order: 2 },
    { slug: 'bracelets', name: 'Bracelets', description: 'Hinged bangles and open diamond cuffs with tempered gold memory core.', cover_image: '/images/home-cc/Bracelets-cc.png', sort_order: 3 },
    { slug: 'necklaces', name: 'Necklaces', description: 'Liquid diamond tennis strands and architectural gold collars.', cover_image: '/images/home-cc/Necklaces-cc.png', sort_order: 4 },
    { slug: 'pendants', name: 'Pendants', description: 'Geometric cages and constellation lockets suspended in 18k gold chains.', cover_image: '/images/home-cc/Pendants=cc.png', sort_order: 5 },
  ];

  for (const col of defaultCollections) {
    await client.execute({
      sql: `INSERT INTO collections (slug, name, description, cover_image, sort_order, is_active)
            VALUES (?, ?, ?, ?, ?, 1)
            ON CONFLICT(slug) DO UPDATE SET
              name = excluded.name,
              description = excluded.description,
              cover_image = excluded.cover_image,
              sort_order = excluded.sort_order;`,
      args: [col.slug, col.name, col.description, col.cover_image, col.sort_order],
    });
  }
  console.log('✅ Collections seeded successfully.');

  // 3. Metal Rates
  const rates = [
    { metal: 'Gold', purity: '24 KT', rate_inr: 76500 },
    { metal: 'Gold', purity: '22 KT', rate_inr: 70150 },
    { metal: 'Gold', purity: '18 KT', rate_inr: 69999 },
    { metal: 'Gold', purity: '16 KT', rate_inr: 62221 },
    { metal: 'Gold', purity: '14 KT', rate_inr: 55999 },
    { metal: 'Gold', purity: '10 KT', rate_inr: 42999 },
    { metal: 'Silver', purity: 'Silver', rate_inr: 26999 },
    { metal: 'Diamond', purity: 'Natural Diamond (Per Carat)', rate_inr: 85000 },
    { metal: 'Diamond', purity: 'Lab Grown Diamond (Per Carat)', rate_inr: 28000 },
  ];

  for (const r of rates) {
    const existing = await client.execute({
      sql: 'SELECT id FROM metal_rates WHERE purity = ?',
      args: [r.purity],
    });
    if (existing.rows.length === 0) {
      await client.execute({
        sql: `INSERT INTO metal_rates (metal, purity, rate_inr, updated_by, updated_at)
              VALUES (?, ?, ?, ?, datetime('now'))`,
        args: [r.metal, r.purity, r.rate_inr, 'System Initializer'],
      });
    }
  }
  console.log('✅ Metal rates seeded successfully.');

  // 4. Ring Sizes
  await client.execute({
    sql: `INSERT INTO ring_sizes (id, min_size, max_size, increment, pricing_mode, chart_image_url, updated_at)
          VALUES (1, 3.0, 15.0, 0.5, 'SAME_PRICE', '/images/Civaraa_Ring_size.png', datetime('now'))
          ON CONFLICT(id) DO UPDATE SET chart_image_url = '/images/Civaraa_Ring_size.png';`,
  });
  console.log('✅ Ring sizes seeded successfully.');

  // 5. Settings
  await client.execute({
    sql: `INSERT OR REPLACE INTO settings (key, value, updated_at)
          VALUES ('catalog_seeded', 'true', datetime('now'));`,
  });
  console.log('✅ Settings saved.');

  // Check products count
  const prodCount = await client.execute('SELECT COUNT(*) as count FROM products');
  console.log(`Current products in Turso: ${prodCount.rows[0].count}`);
  console.log('🎉 Turso cloud database initialization complete!');
}

main().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
