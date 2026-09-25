'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import LandingFooter from '@/components/landing/LandingFooter';
import { getArticleBySlug, getAllArticles } from '@/lib/blog-data';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft, Clock, Calendar, ShieldCheck, Zap } from 'lucide-react';
import { notFound } from 'next/navigation';

export default function ArticleDetailClient({ slug }: { slug: string }) {
  const { language, t } = useLanguage();
  const article = getArticleBySlug(slug, language);

  if (!article) {
    notFound();
  }

  const allArticles = getAllArticles(language);
  const relatedArticles = allArticles.filter((a) => a.slug !== article.slug).slice(0, 2);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Fylynx',
      logo: {
        '@type': 'ImageObject',
        url: 'https://fylynx.com/fylynx-logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://fylynx.com/blog/${article.slug}?lang=${language}`,
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Navigation Back Link */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-brand-300 transition-colors bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800"
          >
            {t('blog_back')}
          </Link>
        </div>

        {/* Header Header Info */}
        <header className="space-y-6 border-b border-slate-800 pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/40 text-xs font-extrabold uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-500" /> {article.readTime}
            </span>
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />{' '}
              {new Date(article.publishedAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'de' ? 'de-DE' : language === 'es' ? 'es-ES' : language === 'zh' ? 'zh-CN' : 'fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed italic border-l-4 border-brand-500 pl-4 py-1">
            {article.description}
          </p>

          {/* Author info card */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="h-12 w-12 rounded-full bg-slate-900 p-1 border border-brand-500/30 object-contain"
              />
              <div>
                <div className="text-sm font-bold text-white">{article.author.name}</div>
                <div className="text-xs text-slate-400">{article.author.role}</div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> {t('blog_certified')}
              </span>
            </div>
          </div>
        </header>

        {/* Main Article Body HTML Content */}
        <article className="prose prose-invert max-w-none prose-headings:font-black prose-headings:text-white prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-sm sm:prose-p:text-base prose-li:text-slate-300 prose-li:text-sm prose-strong:text-white prose-a:text-brand-400 prose-a:underline">
          <div dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
        </article>

        {/* Dynamic CTA Box inside Article */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950/60 to-slate-900 border-2 border-brand-500/40 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 text-brand-400 font-extrabold text-xs uppercase tracking-wider">
            <Zap className="h-4 w-4 text-brand-400" /> {t('blog_try_free')}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Passez à la collecte documentaire automatisée en 1-clic
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t('blog_try_subtitle')}
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:brightness-110 text-white font-extrabold text-xs rounded-2xl shadow-xl glow-brand transition transform hover:scale-105"
            >
              {t('blog_cta_btn')}
            </Link>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="space-y-6 pt-8 border-t border-slate-800">
            <h3 className="text-lg font-extrabold text-white">{t('blog_recommended')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.slug}
                  className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3 hover:border-brand-500/40 transition"
                >
                  <span className="text-[10px] uppercase font-bold text-brand-400">{rel.category}</span>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    <Link href={`/blog/${rel.slug}`} className="hover:text-brand-300">
                      {rel.title}
                    </Link>
                  </h4>
                  <Link
                    href={`/blog/${rel.slug}`}
                    className="text-xs text-brand-400 font-extrabold flex items-center gap-1 pt-1"
                  >
                    {t('blog_read_more')}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <LandingFooter />
    </div>
  );
}
