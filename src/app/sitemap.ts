import { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/blog-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://fylynx.com';
  const languages = ['fr', 'en', 'ar', 'de', 'es', 'zh'];

  const getLanguageAlternates = (path: string) => {
    const langObj: Record<string, string> = {
      'x-default': `${baseUrl}/fr${path}`,
    };
    languages.forEach((lang) => {
      langObj[lang] = `${baseUrl}/${lang}${path}`;
    });
    return { languages: langObj };
  };

  const baseRoutes = ['', '/blog', '/aide', '/login', '/register', '/forgot-password'];
  const articles = getAllArticles();

  const entries: MetadataRoute.Sitemap = [];

  // Generate explicit localized URLs for base routes
  baseRoutes.forEach((route) => {
    languages.forEach((lang) => {
      entries.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1.0 : 0.9,
        alternates: getLanguageAlternates(route),
      });
    });
  });

  // Generate explicit localized URLs for blog articles
  articles.forEach((article) => {
    languages.forEach((lang) => {
      entries.push({
        url: `${baseUrl}/${lang}/blog/${article.slug}`,
        lastModified: new Date(article.publishedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        alternates: getLanguageAlternates(`/blog/${article.slug}`),
      });
    });
  });

  return entries;
}
