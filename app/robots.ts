import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin*",
        "/api/admin*",
        "/studio/rates*",
        "/*?*metal=*",
        "/*?*purity=*",
        "/*?*stone=*",
      ],
    },
    sitemap: "https://civara-jewels.vercel.app/sitemap.xml",
  };
}
