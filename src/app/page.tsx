'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import BrandsMarquee from '@/components/landing/BrandsMarquee';
import RoiCalculator from '@/components/RoiCalculator';
import AiDemoSection from '@/components/landing/AiDemoSection';
import BeforeAfterSection from '@/components/landing/BeforeAfterSection';
import FeaturesGridSection from '@/components/landing/FeaturesGridSection';
import UseCasesSection from '@/components/landing/UseCasesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import PricingComparisonTable from '@/components/PricingComparisonTable';
import FaqSection from '@/components/landing/FaqSection';
import LandingFooter from '@/components/landing/LandingFooter';
import { PLANS } from '@/lib/stripe';
import { CheckCircle2, Bot, Building2, Zap, ArrowRight, BookOpen, Rocket } from 'lucide-react';
import { BLOG_ARTICLES } from '@/lib/blog-data';
import { useLanguage } from '@/context/LanguageContext';

const STARTER_FEATURE_KEYS = ['f_starter_1', 'f_starter_2', 'f_starter_3', 'f_starter_4', 'f_starter_5', 'f_starter_6'] as const;
const PRO_FEATURE_KEYS = ['f_pro_1', 'f_pro_2', 'f_pro_3', 'f_pro_4', 'f_pro_5', 'f_pro_6', 'f_pro_7', 'f_pro_8'] as const;
const AI_FEATURE_KEYS = ['f_ai_1', 'f_ai_2', 'f_ai_3', 'f_ai_4', 'f_ai_5', 'f_ai_6', 'f_ai_7', 'f_ai_8'] as const;
const SCALE_FEATURE_KEYS = ['f_scale_1', 'f_scale_2', 'f_scale_3', 'f_scale_4', 'f_scale_5', 'f_scale_6', 'f_scale_7'] as const;

export default function LandingPage() {
  const { t } = useLanguage();
  const [isAnnual, setIsAnnual] = useState(false);

  // Structured JSON-LD Schema Markup for SEO
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        'name': 'Fylynx',
        'operatingSystem': 'Web, iOS, Android',
        'applicationCategory': 'BusinessApplication',
        'offers': {
          '@type': 'Offer',
          'price': '23.00',
          'priceCurrency': 'EUR',
        },
      },
      {
        '@type': 'Organization',
        'name': 'Fylynx',
        'url': 'https://fylynx.com',
        'logo': 'https://fylynx.com/fylynx-logo.png',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white antialiased overflow-x-hidden">
      {/* SEO Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Top Banner Promotional Bar */}
      {/* <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 text-white text-[11px] font-extrabold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2 shadow-md relative z-50">
        <span className="px-2 py-0.5 rounded-full bg-white/20 text-white uppercase text-[9px] font-black tracking-widest">
          Offre Lancement 2026
        </span>
        <span>🔥 Offre d&apos;essai 14 jours gratuits sans CB + Remise -20% en facturation annuelle</span>
        <Link
          href="/register"
          className="underline hover:text-cyan-200 transition ml-1 inline-flex items-center font-black"
        >
          Profiter de l&apos;offre →
        </Link>
      </div> */}

      {/* Main Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Partner Brands Marquee */}
      <BrandsMarquee />

      {/* Interactive ROI & Savings Calculator (Single Clean Instance) */}
      <RoiCalculator />

      {/* Interactive AI Inspection Live Demo */}
      <AiDemoSection />

      {/* Interactive Before / After Comparison Slider */}
      <BeforeAfterSection />

      {/* Key Features & Value Proposition */}
      <FeaturesGridSection />

      {/* Sector Use Cases (Immobilier, Compta, Courtage, RH) */}
      <UseCasesSection />

      {/* Pricing Section */}
      <section id="tarifs" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-bold inline-block">
            {t('pricing_badge')}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {t('pricing_title')}
          </h2>
          <p className="text-base text-slate-400">
            {t('pricing_desc')}
          </p>
        </div>

        {/* Annual / Monthly Toggle Switch */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold transition ${!isAnnual ? 'text-white font-black' : 'text-slate-400'}`}>
              {t('monthly_billing')}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-16 h-9 rounded-full bg-slate-900 border border-slate-700 p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Changer de mode de facturation"
          >
            <div
              className={`w-7 h-7 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 shadow-md transform transition-transform duration-300 ${
                isAnnual ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold transition ${isAnnual ? 'text-emerald-400 font-extrabold scale-105' : 'text-slate-400'}`}>
              {t('annual_billing')}
            </span>
            <span className="px-2.5 py-1 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black rounded-full animate-pulse shadow-sm shadow-emerald-500/10">
              🔥 -20%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {/* Starter Plan */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl space-y-6 flex flex-col justify-between hover:border-slate-700 transition">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('plan_starter_name')}</span>
                <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-full flex items-center gap-1">
                  <Rocket className="h-3 w-3 text-amber-400" /> 14j
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  {isAnnual ? `${PLANS.STARTER.priceAnnualMonthly} €` : `${PLANS.STARTER.priceMonthly} €`}
                </span>
                <span className="text-xs text-slate-400 font-medium">{t('per_month')}</span>
              </div>
              <p className="text-xs text-brand-400 font-bold mt-1">
                {isAnnual
                  ? `${t('billed_annually_prefix')}${PLANS.STARTER.priceAnnualTotal} €${t('billed_annually_suffix')}`
                  : t('trial_notice')}
              </p>

              <ul className="mt-8 space-y-3 text-xs text-slate-300">
                {STARTER_FEATURE_KEYS.map((key, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-3.5 rounded-2xl text-xs font-extrabold text-white bg-brand-600 hover:bg-brand-500 text-center shadow-lg shadow-brand-500/20 transition block"
            >
              {t('btn_test_starter')}
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="p-6 rounded-3xl border-2 border-emerald-400 bg-slate-900/90 backdrop-blur-xl space-y-6 flex flex-col justify-between relative shadow-2xl shadow-emerald-500/10 transition">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-full shadow-md whitespace-nowrap">
              {t('popular_badge')}
            </div>

            <div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">{t('plan_pro_name')}</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold rounded-full">
                  Pro
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  {isAnnual ? `${PLANS.PRO.priceAnnualMonthly} €` : `${PLANS.PRO.priceMonthly} €`}
                </span>
                <span className="text-xs text-slate-400 font-medium">{t('per_month')}</span>
              </div>
              <p className="text-xs text-emerald-400 font-semibold mt-1">
                {isAnnual
                  ? `${t('billed_annually_prefix')}${PLANS.PRO.priceAnnualTotal} €${t('billed_annually_suffix')}`
                  : 'Logo & Relances'}
              </p>

              <ul className="mt-8 space-y-3 text-xs text-slate-200">
                {PRO_FEATURE_KEYS.map((key, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-4 rounded-2xl text-xs font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 text-center shadow-xl shadow-emerald-500/20 transition block"
            >
              {t('btn_select_pro')} ({isAnnual ? `${PLANS.PRO.priceAnnualMonthly} €${t('per_month')}` : `${PLANS.PRO.priceMonthly} €${t('per_month')}`}) <ArrowRight className="h-3.5 w-3.5 inline ml-1" />
            </Link>
          </div>

          {/* AI Enterprise Plan */}
          <div className="p-6 rounded-3xl border border-indigo-900/80 bg-gradient-to-b from-indigo-950/90 to-slate-900/90 backdrop-blur-xl space-y-6 flex flex-col justify-between hover:border-indigo-700 transition">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                  <Bot className="h-4 w-4 text-indigo-400" /> {t('plan_ai_name')}
                </span>
                <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold rounded-full">
                  IA
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  {isAnnual ? `${PLANS.AI_ENTERPRISE.priceAnnualMonthly} €` : `${PLANS.AI_ENTERPRISE.priceMonthly} €`}
                </span>
                <span className="text-xs text-indigo-300 font-medium">{t('per_month')}</span>
              </div>
              <p className="text-xs text-indigo-300 font-bold mt-1">
                {isAnnual
                  ? `${t('billed_annually_prefix')}${PLANS.AI_ENTERPRISE.priceAnnualTotal} €${t('billed_annually_suffix')}`
                  : 'Vérification IA'}
              </p>

              <ul className="mt-8 space-y-3 text-xs text-slate-200">
                {AI_FEATURE_KEYS.map((key, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-3.5 rounded-2xl text-xs font-extrabold text-white bg-indigo-500 hover:bg-indigo-400 text-center shadow-lg shadow-indigo-500/30 transition block"
            >
              {t('btn_select_ai')} ({isAnnual ? `${PLANS.AI_ENTERPRISE.priceAnnualMonthly} €${t('per_month')}` : `${PLANS.AI_ENTERPRISE.priceMonthly} €${t('per_month')}`}) <ArrowRight className="h-3.5 w-3.5 inline ml-1" />
            </Link>
          </div>

          {/* Agence Scale Plan */}
          <div className="p-6 rounded-3xl border-2 border-cyan-400 bg-gradient-to-b from-cyan-950 via-slate-900 to-slate-950 backdrop-blur-xl space-y-6 flex flex-col justify-between relative shadow-2xl shadow-cyan-500/20 hover:scale-[1.02] transition">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg whitespace-nowrap animate-pulse">
              {t('scale_badge')}
            </div>

            <div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-cyan-400" /> {t('plan_scale_name')}
                </span>
                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold rounded-full">
                  Scale
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white tracking-tight">
                  {isAnnual ? `${PLANS.AGENCY_SCALE.priceAnnualMonthly} €` : `${PLANS.AGENCY_SCALE.priceMonthly} €`}
                </span>
                <span className="text-xs text-cyan-300 font-medium">{t('per_month')}</span>
              </div>
              <p className="text-xs text-cyan-300 font-bold mt-1">
                {isAnnual
                  ? `${t('billed_annually_prefix')}${PLANS.AGENCY_SCALE.priceAnnualTotal} €${t('billed_annually_suffix')}`
                  : 'Webhooks & API'}
              </p>

              <ul className="mt-8 space-y-3 text-xs text-slate-200">
                {SCALE_FEATURE_KEYS.map((key, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-4 rounded-2xl text-xs font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-center shadow-xl shadow-cyan-500/30 transition block transform hover:scale-[1.02]"
            >
              {t('btn_select_scale')} ({isAnnual ? `${PLANS.AGENCY_SCALE.priceAnnualMonthly} €${t('per_month')}` : `${PLANS.AGENCY_SCALE.priceMonthly} €${t('per_month')}`}) <ArrowRight className="h-3.5 w-3.5 inline ml-1" />
            </Link>
          </div>
        </div>

        {/* Complete Feature Comparison Table */}
        <PricingComparisonTable isAnnual={isAnnual} />
      </section>

      {/* Customer Testimonials */}
      <TestimonialsSection />

      {/* Blog & Resources Preview */}
      <section id="blog-preview" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-400 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" /> Centre de Ressources & Guides SEO
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Derniers articles & conseils d&apos;experts
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-brand-400 hover:text-brand-300 transition group"
          >
            Voir tous nos guides & articles <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_ARTICLES.slice(0, 3).map((art) => (
            <article
              key={art.slug}
              className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-brand-500/50 transition flex flex-col justify-between space-y-4 group backdrop-blur-xl hover:-translate-y-1"
            >
              <div className="space-y-3">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-brand-300 border border-slate-700 text-[10px] font-bold">
                  {art.category}
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors leading-snug">
                  <Link href={`/blog/${art.slug}`}>
                    {art.title}
                  </Link>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {art.description}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[11px]">{art.readTime}</span>
                <Link href={`/blog/${art.slug}`} className="text-brand-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Lire l&apos;article <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <FaqSection />

      {/* Bottom Conversion CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 border border-brand-500/40 rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Prêt à éliminer définitivement les relances manuelles de vos dossiers ?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Rejoignez des centaines de professionnels et créez votre premier dossier en moins d&apos;une minute.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-500 to-indigo-600 hover:brightness-110 text-white font-extrabold text-sm rounded-2xl shadow-xl transition glow-brand hover:scale-105"
            >
              Démarrer mon Essai Gratuit 14 Jours <ArrowRight className="h-4 w-4 inline ml-1" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-4 bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white font-bold text-sm rounded-2xl transition"
            >
              Déjà un compte ? Connexion
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
