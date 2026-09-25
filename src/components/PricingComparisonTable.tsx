'use client';

import React from 'react';
import { Check, X, Sparkles, ShieldCheck, Zap, Bot, Palette, Layers, Building2 } from 'lucide-react';
import { PLANS } from '@/lib/stripe';
import { useLanguage } from '@/context/LanguageContext';
import { fr } from '@/locales/fr';

type TranslationKey = keyof typeof fr;

interface ComparisonFeature {
  nameKey: TranslationKey;
  descKey?: TranslationKey;
  starter: boolean | TranslationKey;
  pro: boolean | TranslationKey;
  scale: boolean | TranslationKey;
  enterprise: boolean | TranslationKey;
}

interface FeatureSection {
  titleKey: TranslationKey;
  icon: React.ReactNode;
  features: ComparisonFeature[];
}

const COMPARISON_SECTIONS: FeatureSection[] = [
  {
    titleKey: 'matrix_sec_capacity',
    icon: <Layers className="h-4 w-4 text-brand-400" />,
    features: [
      {
        nameKey: 'm_feat_1_name',
        descKey: 'm_feat_1_desc',
        starter: 'm_val_10_portals',
        pro: 'm_val_unlimited_portals',
        enterprise: 'm_val_unlimited_portals',
        scale: 'm_val_scale_portals',
      },
      {
        nameKey: 'm_feat_2_name',
        descKey: 'm_feat_2_desc',
        starter: 'm_val_1_user',
        pro: 'm_val_5_users',
        enterprise: 'm_val_10_users',
        scale: 'm_val_20_users',
      },
      {
        nameKey: 'm_feat_3_name',
        descKey: 'm_feat_3_desc',
        starter: 'm_val_5gb',
        pro: 'm_val_500gb',
        enterprise: 'm_val_1tb',
        scale: 'm_val_2tb_gdrive',
      },
      {
        nameKey: 'm_feat_4_name',
        descKey: 'm_feat_4_desc',
        starter: true,
        pro: true,
        enterprise: true,
        scale: true,
      },
      {
        nameKey: 'm_feat_5_name',
        descKey: 'm_feat_5_desc',
        starter: true,
        pro: true,
        enterprise: true,
        scale: true,
      },
    ],
  },
  {
    titleKey: 'matrix_sec_branding',
    icon: <Palette className="h-4 w-4 text-emerald-400" />,
    features: [
      {
        nameKey: 'm_feat_6_name',
        descKey: 'm_feat_6_desc',
        starter: false,
        pro: 'm_val_yes_upload',
        enterprise: 'm_val_yes_upload',
        scale: 'm_val_yes_upload',
      },
      {
        nameKey: 'm_feat_7_name',
        descKey: 'm_feat_7_desc',
        starter: false,
        pro: true,
        enterprise: true,
        scale: true,
      },
      {
        nameKey: 'm_feat_8_name',
        descKey: 'm_feat_8_desc',
        starter: false,
        pro: 'm_val_7_palettes',
        enterprise: 'm_val_7_palettes',
        scale: 'm_val_7_palettes',
      },
      {
        nameKey: 'm_feat_9_name',
        descKey: 'm_feat_9_desc',
        starter: false,
        pro: true,
        enterprise: true,
        scale: true,
      },
    ],
  },
  {
    titleKey: 'matrix_sec_reminders',
    icon: <Zap className="h-4 w-4 text-amber-400" />,
    features: [
      {
        nameKey: 'm_feat_10_name',
        descKey: 'm_feat_10_desc',
        starter: 'm_val_manual_relances',
        pro: 'm_val_auto_daily',
        enterprise: 'm_val_auto_daily',
        scale: 'm_val_auto_247',
      },
      {
        nameKey: 'm_feat_11_name',
        descKey: 'm_feat_11_desc',
        starter: false,
        pro: true,
        enterprise: true,
        scale: true,
      },
      {
        nameKey: 'm_feat_12_name',
        descKey: 'm_feat_12_desc',
        starter: true,
        pro: true,
        enterprise: true,
        scale: true,
      },
    ],
  },
  {
    titleKey: 'matrix_sec_integrations',
    icon: <Building2 className="h-4 w-4 text-cyan-400" />,
    features: [
      {
        nameKey: 'm_feat_13_name',
        descKey: 'm_feat_13_desc',
        starter: false,
        pro: true,
        enterprise: true,
        scale: 'm_val_unlimited_workflows',
      },
      {
        nameKey: 'm_feat_14_name',
        descKey: 'm_feat_14_desc',
        starter: false,
        pro: false,
        enterprise: false,
        scale: 'm_val_exclusive_scale',
      },
    ],
  },
  {
    titleKey: 'matrix_sec_ai',
    icon: <Bot className="h-4 w-4 text-indigo-400" />,
    features: [
      {
        nameKey: 'm_feat_15_name',
        descKey: 'm_feat_15_desc',
        starter: false,
        pro: false,
        enterprise: 'm_val_ai_realtime',
        scale: 'm_val_ai_instant',
      },
      {
        nameKey: 'm_feat_16_name',
        descKey: 'm_feat_16_desc',
        starter: false,
        pro: false,
        enterprise: 'm_val_auto_ai_vision',
        scale: 'm_val_auto_ai_vision',
      },
      {
        nameKey: 'm_feat_17_name',
        descKey: 'm_feat_17_desc',
        starter: false,
        pro: false,
        enterprise: 'm_val_auto_ai_vision',
        scale: 'm_val_auto_ai_vision',
      },
      {
        nameKey: 'm_feat_18_name',
        descKey: 'm_feat_18_desc',
        starter: false,
        pro: false,
        enterprise: 'm_val_full_audit',
        scale: 'm_val_full_audit',
      },
    ],
  },
  {
    titleKey: 'matrix_sec_security',
    icon: <ShieldCheck className="h-4 w-4 text-cyan-400" />,
    features: [
      {
        nameKey: 'm_feat_19_name',
        descKey: 'm_feat_19_desc',
        starter: true,
        pro: true,
        enterprise: true,
        scale: true,
      },
      {
        nameKey: 'm_feat_20_name',
        descKey: 'm_feat_20_desc',
        starter: true,
        pro: true,
        enterprise: true,
        scale: true,
      },
      {
        nameKey: 'm_feat_21_name',
        descKey: 'm_feat_21_desc',
        starter: 'm_val_std_email',
        pro: 'm_val_priority_77',
        enterprise: 'm_val_priority_77',
        scale: 'm_val_vip_247',
      },
    ],
  },
];

export default function PricingComparisonTable({
  isAnnual = false,
  onSelectPlan,
}: {
  isAnnual?: boolean;
  onSelectPlan?: (plan: 'STARTER' | 'PRO' | 'AI_ENTERPRISE' | 'AGENCY_SCALE') => void;
}) {
  const { t } = useLanguage();

  const renderValue = (val: boolean | TranslationKey, isPro = false, isEnterprise = false, isScale = false) => {
    if (typeof val === 'boolean') {
      return val ? (
        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
          <Check className="h-4 w-4" />
        </span>
      ) : (
        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-800 text-slate-500">
          <X className="h-3.5 w-3.5" />
        </span>
      );
    }

    return (
      <span
        className={`text-xs font-semibold ${
          isScale
            ? 'text-cyan-300 font-extrabold'
            : isEnterprise
            ? 'text-indigo-300 font-bold'
            : isPro
            ? 'text-emerald-300 font-bold'
            : 'text-slate-300'
        }`}
      >
        {t(val)}
      </span>
    );
  };

  return (
    <div className="w-full mt-16 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-brand-400 flex items-center justify-center gap-1.5">
          <Sparkles className="h-4 w-4" /> {t('matrix_badge')}
        </span>
        <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {t('matrix_title')}
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
          {t('matrix_desc')}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex lg:hidden items-center justify-center gap-1.5 text-[11px] font-extrabold text-brand-400 bg-brand-500/10 py-2 px-4 rounded-xl border border-brand-500/20 text-center">
          <span>{t('matrix_scroll_hint')}</span>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-2xl p-1">
          <table className="w-full text-left border-collapse min-w-[900px]">
            {/* Header Row */}
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/90">
                <th className="py-6 px-6 text-sm font-extrabold text-white w-4/12 align-bottom">
                  {t('matrix_col_features')}
                </th>

                {/* 1. Starter Column */}
                <th className="py-6 px-3 text-center w-2/12 align-bottom">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    {t('plan_starter_name')}
                  </span>
                  <div className="text-2xl font-black text-white">
                    {isAnnual ? `${PLANS.STARTER.priceAnnualMonthly} €` : `${PLANS.STARTER.priceMonthly} €`}
                    <span className="text-[11px] font-normal text-slate-400 block">{t('per_month')}</span>
                  </div>
                  {isAnnual && (
                    <span className="text-[10px] text-brand-400 font-extrabold block mt-1">
                      {PLANS.STARTER.priceAnnualTotal} € {t('per_year')}
                    </span>
                  )}
                  {onSelectPlan && (
                    <button
                      onClick={() => onSelectPlan('STARTER')}
                      className="mt-3 w-full py-2 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-extrabold rounded-xl transition border border-slate-700"
                    >
                      {t('select_plan')} Starter
                    </button>
                  )}
                </th>

                {/* 2. Pro Column */}
                <th className="py-6 px-3 text-center w-2/12 bg-emerald-500/10 border-x border-emerald-500/30 align-bottom">
                  <div className="inline-flex items-center justify-center bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-1">
                    {t('popular_badge')}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    {t('plan_pro_name')}
                  </span>
                  <div className="text-2xl font-black text-white">
                    {isAnnual ? `${PLANS.PRO.priceAnnualMonthly} €` : `${PLANS.PRO.priceMonthly} €`}
                    <span className="text-[11px] font-normal text-slate-400 block">{t('per_month')}</span>
                  </div>
                  {isAnnual && (
                    <span className="text-[10px] text-emerald-400 font-extrabold block mt-1">
                      {PLANS.PRO.priceAnnualTotal} € {t('per_year')}
                    </span>
                  )}
                  {onSelectPlan && (
                    <button
                      onClick={() => onSelectPlan('PRO')}
                      className="mt-3 w-full py-2 px-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-black rounded-xl shadow-lg transition"
                    >
                      {t('btn_select_pro')}
                    </button>
                  )}
                </th>

                {/* 3. Enterprise Column */}
                <th className="py-6 px-3 text-center w-2/12 bg-indigo-950/40 border-r border-indigo-500/30 align-bottom">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 block mb-1">
                    {t('plan_ai_name')}
                  </span>
                  <div className="text-2xl font-black text-white">
                    {isAnnual ? `${PLANS.AI_ENTERPRISE.priceAnnualMonthly} €` : `${PLANS.AI_ENTERPRISE.priceMonthly} €`}
                    <span className="text-[11px] font-normal text-slate-400 block">{t('per_month')}</span>
                  </div>
                  {isAnnual && (
                    <span className="text-[10px] text-indigo-300 font-extrabold block mt-1">
                      {PLANS.AI_ENTERPRISE.priceAnnualTotal} € {t('per_year')}
                    </span>
                  )}
                  {onSelectPlan && (
                    <button
                      onClick={() => onSelectPlan('AI_ENTERPRISE')}
                      className="mt-3 w-full py-2 px-2 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-extrabold rounded-xl transition shadow-lg shadow-indigo-500/20"
                    >
                      {t('btn_select_ai')}
                    </button>
                  )}
                </th>

                {/* 4. Agence Scale Column */}
                <th className="py-6 px-3 text-center w-2/12 bg-cyan-950/60 border-l border-cyan-500/40 align-bottom">
                  <div className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-lg mb-1 whitespace-nowrap animate-pulse">
                    {t('scale_badge')}
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 block mb-1">
                    {t('plan_scale_name')}
                  </span>
                  <div className="text-2xl font-black text-white">
                    {isAnnual ? `${PLANS.AGENCY_SCALE.priceAnnualMonthly} €` : `${PLANS.AGENCY_SCALE.priceMonthly} €`}
                    <span className="text-[11px] font-normal text-slate-400 block">{t('per_month')}</span>
                  </div>
                  {isAnnual && (
                    <span className="text-[10px] text-cyan-300 font-extrabold block mt-0.5">
                      {PLANS.AGENCY_SCALE.priceAnnualTotal} € {t('per_year')}
                    </span>
                  )}
                  {onSelectPlan && (
                    <button
                      onClick={() => onSelectPlan('AGENCY_SCALE')}
                      className="mt-3 w-full py-2.5 px-2 bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs font-black rounded-xl shadow-xl shadow-cyan-500/20 transition transform hover:scale-105"
                    >
                      {t('btn_select_scale')} ({isAnnual ? `${PLANS.AGENCY_SCALE.priceAnnualMonthly}€` : `${PLANS.AGENCY_SCALE.priceMonthly}€`})
                    </button>
                  )}
                </th>
              </tr>
            </thead>

            <tbody>
              {COMPARISON_SECTIONS.map((section, sIdx) => (
                <React.Fragment key={sIdx}>
                  {/* Section Header Row */}
                  <tr className="bg-slate-950/60 border-y border-slate-800/80">
                    <td colSpan={5} className="py-3 px-6 text-xs font-black uppercase tracking-wider text-brand-300 flex items-center gap-2">
                      {section.icon}
                      {t(section.titleKey)}
                    </td>
                  </tr>

                  {/* Features Rows */}
                  {section.features.map((feat, fIdx) => (
                    <tr
                      key={fIdx}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30 transition text-xs"
                    >
                      <td className="py-4 px-6 space-y-0.5">
                        <div className="font-bold text-slate-100">{t(feat.nameKey)}</div>
                        {feat.descKey && (
                          <div className="text-[11px] text-slate-400">{t(feat.descKey)}</div>
                        )}
                      </td>

                      {/* 1. Starter */}
                      <td className="py-4 px-3 text-center align-middle">
                        {renderValue(feat.starter)}
                      </td>

                      {/* 2. Pro */}
                      <td className="py-4 px-3 text-center align-middle bg-emerald-500/5 border-x border-emerald-500/20">
                        {renderValue(feat.pro, true, false, false)}
                      </td>

                      {/* 3. IA Enterprise */}
                      <td className="py-4 px-3 text-center align-middle bg-indigo-950/20 border-r border-indigo-500/20">
                        {renderValue(feat.enterprise, false, true, false)}
                      </td>

                      {/* 4. Agence Scale */}
                      <td className="py-4 px-3 text-center align-middle bg-cyan-950/40 border-l border-cyan-500/30">
                        {renderValue(feat.scale, false, false, true)}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


