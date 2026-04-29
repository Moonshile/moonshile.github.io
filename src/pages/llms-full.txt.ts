import { getCollection, render } from 'astro:content';
import type { APIContext } from 'astro';

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&middot;/g, '·')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const siteUrl = context.site!.href.replace(/\/$/, '');
  const sections: string[] = [
    '# 凯强的百草园 — 完整内容',
    '',
    '> 悟已往之不谏 知来者之可追',
    '',
  ];

  for (const post of posts) {
    const { Content } = await render(post);
    const date = post.data.date.toISOString().split('T')[0];
    const tags = post.data.tags.join(', ');

    sections.push(`---`);
    sections.push('');
    sections.push(`## ${post.data.title}`);
    sections.push('');
    sections.push(`日期: ${date} | 作者: ${post.data.author} | 标签: ${tags}`);
    sections.push(`链接: ${siteUrl}/posts/${post.id}`);
    sections.push('');

    if (post.body) {
      sections.push(post.body);
    }
    sections.push('');
  }

  return new Response(sections.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
