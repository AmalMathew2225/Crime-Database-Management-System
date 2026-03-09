import { NextResponse } from "next/server";
import { createClient } from "../../lib/supabase";

// simple RSS feed of latest verified news articles across all FIRs
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news_articles")
      .select("id,title,source,publication_date,url,fir_id")
      .eq("is_verified", true)
      .order("publication_date", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

    const itemsXml = (data || [])
      .map((art: any) => {
        const pubDate = new Date(art.publication_date).toUTCString();
        return `
<item>
  <title><![CDATA[${art.title}]]></title>
  <link>${art.url}</link>
  <guid>${art.id}</guid>
  <pubDate>${pubDate}</pubDate>
  <description><![CDATA[Source: ${art.source}]]></description>
</item>`;
      })
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Crime Portal News</title>
  <link>${siteUrl}</link>
  <description>Latest verified news related to cases</description>
  <language>en-us</language>
  ${itemsXml}
</channel>
</rss>`;

    return new NextResponse(xml, {
      headers: { "Content-Type": "application/rss+xml" },
    });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
