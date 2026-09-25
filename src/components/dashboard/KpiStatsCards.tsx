'use client';

import { Folder, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface KpiStatsCardsProps {
  totalCount: number;
  pendingCount: number;
  inReviewCount: number;
  completedCount: number;
  activeTab: 'ALL' | 'PENDING' | 'IN_REVIEW' | 'COMPLETED';
  onSelectTab: (tab: 'ALL' | 'PENDING' | 'IN_REVIEW' | 'COMPLETED') => void;
}

export default function KpiStatsCards({
  totalCount,
  pendingCount,
  inReviewCount,
  completedCount,
  activeTab,
  onSelectTab,
}: KpiStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div
        onClick={() => onSelectTab('ALL')}
        className={`p-4 sm:p-5 rounded-3xl border shadow-xl flex items-center justify-between transition-all cursor-pointer ${
          activeTab === 'ALL'
            ? 'bg-slate-900 border-brand-500/80 ring-2 ring-brand-500/20 shadow-brand-500/10'
            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div>
          <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Dossiers</span>
          <p className="text-2xl sm:text-3xl font-black text-white mt-0.5 sm:mt-1">{totalCount}</p>
          <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 hidden sm:block mt-0.5">Tous les dossiers gérés</span>
        </div>
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center font-bold shrink-0">
          <Folder className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>

      <div
        onClick={() => onSelectTab('PENDING')}
        className={`p-4 sm:p-5 rounded-3xl border shadow-xl flex items-center justify-between transition-all cursor-pointer ${
          activeTab === 'PENDING'
            ? 'bg-slate-900 border-amber-500/80 ring-2 ring-amber-500/20 shadow-amber-500/10'
            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div>
          <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-amber-400">Incomplets</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-300 mt-0.5 sm:mt-1">{pendingCount}</p>
          <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 hidden sm:block mt-0.5">En attente des clients</span>
        </div>
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold shrink-0">
          <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>

      <div
        onClick={() => onSelectTab('IN_REVIEW')}
        className={`p-4 sm:p-5 rounded-3xl border shadow-xl flex items-center justify-between transition-all cursor-pointer ${
          activeTab === 'IN_REVIEW'
            ? 'bg-slate-900 border-cyan-500/80 ring-2 ring-cyan-500/20 shadow-cyan-500/10'
            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div>
          <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-cyan-400">À Inspecter</span>
          <p className="text-2xl sm:text-3xl font-black text-cyan-300 mt-0.5 sm:mt-1">{inReviewCount}</p>
          <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 hidden sm:block mt-0.5">Pièces récents reçues</span>
        </div>
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold shrink-0">
          <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>

      <div
        onClick={() => onSelectTab('COMPLETED')}
        className={`p-4 sm:p-5 rounded-3xl border shadow-xl flex items-center justify-between transition-all cursor-pointer ${
          activeTab === 'COMPLETED'
            ? 'bg-slate-900 border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-emerald-500/10'
            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div>
          <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">Complétés & Certifiés</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-300 mt-0.5 sm:mt-1">{completedCount}</p>
          <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 hidden sm:block mt-0.5">Prêts pour export ZIP</span>
        </div>
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold shrink-0">
          <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>
    </div>
  );
}
