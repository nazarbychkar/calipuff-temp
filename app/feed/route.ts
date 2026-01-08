import { NextResponse } from 'next/server';
import { prisma } from '@/lib/sql';
import { BRAND } from '@/lib/brand';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://calishops.com';

  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 20,
      select: {
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        publishedAt: true,
        created_at: true,
        imageUrl: true,
      },
    });

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${BRAND.name} - Блог про CBD, HHC, THC канабіс</title>
    <link>${baseUrl}/blog</link>
    <description>Останні статті про CBD канабіс, HHC, THC вейпи, легальні коноплі в Україні. Корисна інформація про вейпи, дудки та картриджі від ${BRAND.name}.</description>
    <language>uk-UA</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed" rel="self" type="application/rss+xml"/>
    <copyright>Copyright ${new Date().getFullYear()} ${BRAND.name}</copyright>
    <managingEditor>${BRAND.contact.email} (${BRAND.name})</managingEditor>
    <webMaster>${BRAND.contact.email} (${BRAND.name})</webMaster>
    <image>
      <url>${baseUrl}/images/light-theme/calipuff-logo-header-light.svg</url>
      <title>${BRAND.name}</title>
      <link>${baseUrl}</link>
    </image>
    ${posts
      .map((post) => {
        const pubDate = post.publishedAt || post.created_at;
        const imageUrl = post.imageUrl 
          ? (post.imageUrl.startsWith('http') ? post.imageUrl : `${baseUrl}${post.imageUrl}`)
          : `${baseUrl}/images/hero-bg.png`;
        
        return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt || post.title}]]></description>
      <content:encoded><![CDATA[${post.content || post.excerpt || post.title}]]></content:encoded>
      <pubDate>${new Date(pubDate).toUTCString()}</pubDate>
      <enclosure url="${imageUrl}" type="image/jpeg"/>
      <category><![CDATA[CBD канабіс]]></category>
      <category><![CDATA[HHC]]></category>
      <category><![CDATA[THC]]></category>
      <category><![CDATA[вейпи]]></category>
      <category><![CDATA[коноплі Україна]]></category>
      <category><![CDATA[легальний канабіс]]></category>
    </item>`;
      })
      .join('\n')}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}

