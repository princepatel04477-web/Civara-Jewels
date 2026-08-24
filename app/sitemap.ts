import { MetadataRoute } from "next";
import { Catalog } from "../lib/catalog";
import { Taxonomy } from "../lib/taxonomy";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://civara-jewels.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/jewellery`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/collections`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/craft`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/bespoke`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/viewings`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/size-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/certification`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/care`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/journal`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/education/4cs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/education/diamond-shapes`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/education/metals`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/education/care`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  // Occasions routes
  const occasionRoutes: MetadataRoute.Sitemap = [
    "engagement",
    "wedding",
    "anniversary",
    "milestone",
    "everyday",
  ].map((occ) => ({
    url: `${baseUrl}/occasions/${occ}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Collection routes
  const collectionRoutes: MetadataRoute.Sitemap = Object.values(Catalog.collections).map((col) => ({
    url: `${baseUrl}/collections/${col.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Individual Product routes
  const productRoutes: MetadataRoute.Sitemap = Catalog.products.map((p) => ({
    url: `${baseUrl}/products/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  // Journal article routes
  const journalRoutes: MetadataRoute.Sitemap = Catalog.articles.map((art) => ({
    url: `${baseUrl}/journal/${art.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Taxonomy category & subcategory routes
  const taxonomyRoutes: MetadataRoute.Sitemap = [];
  Taxonomy.getAllCategories().forEach((cat) => {
    taxonomyRoutes.push({
      url: `${baseUrl}/jewellery/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    });

    cat.subcategories.forEach((sub) => {
      if (sub.enabled) {
        taxonomyRoutes.push({
          url: `${baseUrl}/jewellery/${cat.slug}/${sub.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    });
  });

  return [
    ...staticRoutes,
    ...occasionRoutes,
    ...collectionRoutes,
    ...productRoutes,
    ...journalRoutes,
    ...taxonomyRoutes,
  ];
}
