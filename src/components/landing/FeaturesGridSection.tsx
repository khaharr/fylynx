'use client';

import { Zap, ShieldCheck, Smartphone, Clock, Download, Bot } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function FeaturesGridSection() {
  const { t } = useLanguage();

  return (
    <section id="fonctionnalites" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {t('features_title')}
        </h2>
        <p className="mt-4 text-base text-slate-400 leading-relaxed">
          {t('features_desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 transition-all duration-300 space-y-4 hover:-translate-y-1 backdrop-blur-xl">
          <div className="h-12 w-12 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center font-bold">
            <Smartphone className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-extrabold text-white">{t('feat_1_title')}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t('feat_1_desc')}
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 space-y-4 hover:-translate-y-1 backdrop-blur-xl">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
            <Bot className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-extrabold text-white">{t('feat_2_title')}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t('feat_2_desc')}
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 space-y-4 hover:-translate-y-1 backdrop-blur-xl">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-extrabold text-white">{t('feat_3_title')}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t('feat_3_desc')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start backdrop-blur-xl">
          <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold shrink-0">
            <Download className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-extrabold text-white">{t('feat_4_title')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('feat_4_desc')}
            </p>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/50 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start backdrop-blur-xl">
          <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-extrabold text-white">{t('feat_5_title')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('feat_5_desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
