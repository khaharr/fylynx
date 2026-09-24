import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getAllArticles } from '@/lib/blog-data';
import { BookOpen, Sparkles, Clock, ArrowRight, ShieldCheck, Tag, Search } from 'lucide-react';

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
  const articles = getAllArticles();
  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const regularArticles = articles.filter((a) => a.slug !== featuredArticle.slug);

  // JSON-LD Schema for Blog/Resource Center
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog & Resource Center Fylynx',
    description: 'Guides et articles experts sur la collecte documentaire et l\'IA anti-fraude.',
    url: 'https://fylinx.com/blog',
    blogPost: articles.map((article) => ({
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.description,
      datePublished: article.publishedAt,
      url: `https://fylinx.com/blog/${article.slug}`,
      author: {
        '@type': 'Person',
        name: article.author.name,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Header Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 font-extrabold text-xs uppercase tracking-wider shadow-inner">
            <BookOpen className="h-4 w-4 text-brand-400" />
            Centre d'Expertise & Guides SEO
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Automatisation, IA & <span className="text-gradient-cyan">Conformité Documentaire</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Conseils pratiques, méthodes anti-fraude et tutoriels d'intégration pour optimiser la collecte de vos justificatifs clients en 2026.
          </p>
        </div>

        {/* Featured Article Card */}
        {featuredArticle && (
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-brand-950/40 border border-brand-500/30 p-6 sm:p-10 shadow-2xl space-y-6 group hover:border-brand-500/60 transition-all duration-300">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 fill-brand-300" /> Article à la Une
              </span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-500" /> {featuredArticle.readTime}
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white group-hover:text-brand-300 transition-colors leading-tight">
                <Link href={`/blog/${featuredArticle.slug}`}>
                  {featuredArticle.title}
                </Link>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
                {featuredArticle.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredArticle.author.avatar}
                  alt={featuredArticle.author.name}
                  className="h-10 w-10 rounded-full bg-slate-800 p-1 border border-brand-500/30 object-contain"
                />
                <div>
                  <div className="text-xs font-bold text-slate-200">{featuredArticle.author.name}</div>
                  <div className="text-[11px] text-slate-400">{featuredArticle.author.role}</div>
                </div>
              </div>

              <Link
                href={`/blog/${featuredArticle.slug}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs rounded-2xl shadow-lg glow-brand transition-all transform hover:scale-105 shrink-0"
              >
                Lire l'article complet <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}

        {/* Regular Articles Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Tag className="h-5 w-5 text-brand-400" /> Tous nos guides & articles
            </h3>
            <span className="text-xs text-slate-400 font-semibold">
              {articles.length} articles disponibles
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article) => (
              <article
                key={article.slug}
                className="bg-slate-900/70 border border-slate-800 hover:border-brand-500/50 rounded-3xl p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-6 hover:-translate-y-1.5 transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-brand-300 border border-slate-700 text-[11px] font-bold">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3" /> {article.readTime}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors leading-snug">
                    <Link href={`/blog/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {article.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 font-medium">
                    {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>

                  <Link
                    href={`/blog/${article.slug}`}
                    className="text-xs font-extrabold text-brand-400 hover:text-brand-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    Lire suite <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Bottom CTA Card for SaaS Sign up */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-950 via-slate-900 to-indigo-950 border border-brand-500/40 text-center space-y-6 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Prêt à automatiser vos dossiers documentaires ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Testez Fylynx gratuitement pendant 14 jours. Aucune carte bancaire requise. Configuration en 2 minutes chrono.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-gradient-to-r from-brand-500 via-indigo-500 to-cyan-400 hover:brightness-110 text-white font-black text-xs rounded-2xl shadow-xl glow-brand transition transform hover:scale-105"
            >
              Démarrer l'essai gratuit 14j →
            </Link>
            <Link
              href="/aide"
              className="px-6 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-2xl border border-slate-700 transition"
            >
              Consulter le Centre d'aide
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
