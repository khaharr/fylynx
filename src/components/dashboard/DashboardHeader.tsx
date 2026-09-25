'use client';

import Link from 'next/link';
import { Sparkle, BellRing, Plus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface DashboardHeaderProps {
  userName: string;
  isRemindingAll: boolean;
  onTriggerCronRemind: () => void;
  onOpenModal: () => void;
}

export default function DashboardHeader({
  userName,
  isRemindingAll,
  onTriggerCronRemind,
  onOpenModal,
}: DashboardHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/90 p-5 sm:p-8 rounded-3xl border border-slate-800/80 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="space-y-2 relative z-10">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t('nav_dashboard')}
          </h1>
          <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/40 shadow-sm flex items-center gap-1.5">
            <Sparkle className="h-3.5 w-3.5 text-brand-400 fill-brand-400" /> Espace Professionnel
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Bienvenue <strong className="text-white">{userName}</strong>. Générez vos liens de dépôt 1-clic et suivez l&apos;avancement de vos pièces justificatives.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10">
        <button
          onClick={onTriggerCronRemind}
          disabled={isRemindingAll}
          className="px-4 py-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition border border-slate-700 shadow-md"
        >
          <BellRing className={`h-4 w-4 ${isRemindingAll ? 'animate-bounce text-amber-400' : 'text-slate-400'}`} />
          {isRemindingAll ? 'Relances en cours...' : 'Relancer Incomplets'}
        </button>

        <button
          onClick={onOpenModal}
          className="px-5 py-3 bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:brightness-110 text-white font-extrabold rounded-2xl text-xs shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition glow-brand"
        >
          <Plus className="h-4 w-4" /> + Nouveau Dossier Client (1-Clic)
        </button>
      </div>
    </div>
  );
}
