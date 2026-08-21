import { NextResponse } from "next/server";
import { Catalog } from "../../../lib/catalog";

export async function GET() {
  const baseUrl = "https://civara-jewels.vercel.app";
  const articles = Catalog.articles;

  const rssItems = articles
    .map((art) => `
    <item>
      <title><![CDATA[${art.title}]]></title>
      <link>${baseUrl}/journal/${art.slug}</link>
      <guid>${baseUrl}/journal/${art.slug}</guid>
      <description><![CDATA[${art.excerpt}]]></description>
      <pubDate>${new Date(art.date).toUTCString() || new Date().toUTCString()}</pubDate>
      <author>concierge@civarajewels.com (${art.author})</author>
      <category>${art.category}</category>
    </item>`)
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Civara Jewels — Atelier Journal</title>
    <link>${baseUrl}/journal</link>
    <description>Notes on restraint, craft, and gemmology from Civara Jewels.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/journal/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rss.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate",
    },
  });
}
