import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const siteUrl = context.site!.href.replace(/\/$/, '');

  const lines = [
    '# 凯强的百草园',
    '',
    '> 悟已往之不谏 知来者之可追',
    '',
    '个人技术博客，内容涵盖深度学习、Git、Linux 等领域。',
    '',
    `## 文章列表 (${posts.length} 篇)`,
    '',
    ...posts.map(
      (p) =>
        `- [${p.data.title}](${siteUrl}/posts/${p.id}): ${p.data.description || ''}`,
    ),
    '',
    `## 更多`,
    '',
    `- [完整内容](${siteUrl}/llms-full.txt)`,
    `- [RSS](${siteUrl}/rss.xml)`,
    `- [Sitemap](${siteUrl}/sitemap-index.xml)`,
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
