import { Metadata } from 'next';
import ArticleDetailClient from '@/components/ArticleDetailClient';
import { getArticleBySlug, getAllArticles } from '@/lib/blog-data';

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://fylynx.com';

  return {
    title: `${article.title} | Blog Fylynx`,
    description: article.description,
    keywords: article.keywords,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      url: `${appUrl}/blog/${article.slug}`,
      publishedTime: article.publishedAt,
      authors: [article.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  };
}

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  return <ArticleDetailClient slug={params.slug} />;
}

