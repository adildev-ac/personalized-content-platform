import { NextResponse } from "next/server";
import { getArticles, STRAPI_API_URL } from "@/lib/api";

export const revalidate = 300;

export async function GET() {
  const items = await getArticles();
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>Personalized Content Platform</title>
      <link>${site}</link>
      <description>Latest articles</description>
      ${items
        .map(
          (a) => `
        <item>
          <title><![CDATA[${a.title}]]></title>
          <link>${site}/articles/${a.slug}</link>
          <guid isPermaLink="true">${site}/articles/${a.slug}</guid>
          <description><![CDATA[${a.excerpt || ""}]]></description>
          <pubDate>${new Date(a.publication_date).toUTCString()}</pubDate>
        </item>`
        )
        .join("")}
    </channel>
  </rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
    },
  });
}
