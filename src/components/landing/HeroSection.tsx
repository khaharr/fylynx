'use client';

import Link from 'next/link';
import { Bot, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
      {/* Ambient Glow Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 text-brand-300 text-xs font-bold mb-8 shadow-inner animate-pulse-subtle">
        <Bot className="h-4 w-4 text-brand-400" />
        <span>{t('hero_badge')}</span>
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
          {t('hero_auto_badge')}
        </span>
      </div>

      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.12] max-w-5xl mx-auto">
        {t('hero_title_1')}{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-emerald-400">
          {t('hero_title_highlight')}
        </span>
      </h1>

      <p className="mt-8 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
        {t('hero_description')}
      </p>

      {/* CTA Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/register"
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-500 via-brand-600 to-indigo-600 hover:brightness-110 text-white rounded-2xl font-extrabold text-base shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2 transition glow-brand hover:scale-105"
        >
          {t('hero_cta_test')} <ArrowRight className="h-5 w-5" />
        </Link>
        <a
          href="#demo-ia"
          className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition backdrop-blur-md"
        >
          {t('hero_cta_demo')} <Bot className="h-5 w-5 text-brand-400" />
        </a>
      </div>

      {/* Key Metrics / Reassurance Badges */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md hover:border-brand-500/50 transition">
          <div className="text-2xl font-black text-white">+150 000</div>
          <div className="text-xs text-slate-400 mt-1">{t('metric_docs')}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md hover:border-emerald-500/50 transition">
          <div className="text-2xl font-black text-emerald-400">&lt; 2 s</div>
          <div className="text-xs text-slate-400 mt-1">{t('metric_speed')}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md hover:border-indigo-500/50 transition">
          <div className="text-2xl font-black text-white">100% RGPD</div>
          <div className="text-xs text-slate-400 mt-1">{t('metric_rgpd')}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md hover:border-amber-500/50 transition">
          <div className="text-2xl font-black text-amber-400">98,6%</div>
          <div className="text-xs text-slate-400 mt-1">{t('metric_satisfaction')}</div>
        </div>
      </div>
    </section>
  );
}
