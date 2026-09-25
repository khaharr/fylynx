import { Metadata } from 'next';
import BlogIndexClient from '@/components/BlogIndexClient';

export const metadata: Metadata = {
  title: 'Blog & Guides SEO - Automatisation & Conformité Documentaire | Fylynx',
  description:
    'Retrouvez tous nos guides pratiques, conseils anti-fraude, tutoriels d\'automatisation Zapier/Notion et bonnes pratiques de collecte documentaire pour agences et cabinets.',
  openGraph: {
    title: 'Blog Fylynx - Guides GED, IA Anti-Fraude & Collecte Client',
    description: 'Articles experts sur la dématérialisation et le contrôle automatique des justificatifs.',
  },
};

export default function BlogIndexPage() {
  return <BlogIndexClient />;
}

