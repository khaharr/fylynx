'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calculator, TrendingUp, Clock, Euro, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function RoiCalculator() {
  const [requestsPerMonth, setRequestsPerMonth] = useState<number>(45);
  const [hourlyRate, setHourlyRate] = useState<number>(40);

  // Math calculations
  // Average manual processing & follow-up time per file: 45 minutes = 0.75 hours
  const hoursPerRequest = 0.75;
  const totalHoursSpent = Math.round(requestsPerMonth * hoursPerRequest);
  // Fylynx reduces processing & follow-up time by 90%
  const hoursSavedPerMonth = Math.round(totalHoursSpent * 0.9);
  const moneySavedPerMonth = Math.round(hoursSavedPerMonth * hourlyRate);
  const moneySavedPerYear = moneySavedPerMonth * 12;

  // Pro plan cost = 79€/month
  const fylynxPlanCost = 79;
  const netMonthlyGain = moneySavedPerMonth - fylynxPlanCost;
  const roiMultiplier = Math.max(1, Math.round((moneySavedPerMonth / fylynxPlanCost) * 10) / 10);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Radial Ambient Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-4">
          <Calculator className="h-4 w-4 text-emerald-400" />
          <span>Calculateur de ROI & Économies</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Combien d'heures et d'argent allez-vous économiser ?
        </h2>
        <p className="mt-4 text-base text-slate-400 leading-relaxed">
          Simulez en direct le gain de temps et les bénéfices financiers réalisés par votre équipe grâce aux relances automatiques et à l'inspection par IA Fylynx.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/60 border border-slate-800 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 shadow-2xl">
        {/* Left Column: Sliders & Controls */}
        <div className="lg:col-span-7 space-y-8">
          {/* Slider 1: Requests per month */}
          <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-3">
              <label htmlFor="requests-slider" className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-400" />
                Dossiers clients à collecter / mois
              </label>
              <span className="px-3 py-1 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30 font-black text-sm">
                {requestsPerMonth} dossiers
              </span>
            </div>
            <input
              id="requests-slider"
              type="range"
              min="5"
              max="300"
              step="5"
              value={requestsPerMonth}
              onChange={(e) => setRequestsPerMonth(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-semibold mt-2">
              <span>5 dossiers</span>
              <span>150 dossiers</span>
              <span>300+ dossiers</span>
            </div>
          </div>

          {/* Slider 2: Team Hourly Rate */}
          <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-3">
              <label htmlFor="rate-slider" className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Euro className="h-4 w-4 text-emerald-400" />
                Coût horaire moyen de votre collaborateur
              </label>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-black text-sm">
                {hourlyRate} € / heure
              </span>
            </div>
            <input
              id="rate-slider"
              type="range"
              min="20"
              max="120"
              step="5"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-semibold mt-2">
              <span>20 €/h</span>
              <span>70 €/h</span>
              <span>120 €/h</span>
            </div>
          </div>

          {/* Quick Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Zéro relance e-mail/téléphone manuelle</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl">
              <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>Vérification IA instantanée en &lt; 3s</span>
            </div>
          </div>
        </div>

        {/* Right Column: ROI Output Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950/40 border border-brand-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl flex flex-col justify-between h-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                Vos gains estimés
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black">
                <TrendingUp className="h-3.5 w-3.5 text-amber-400" /> ROI {roiMultiplier}x
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-xs text-slate-400 font-semibold mb-1">Temps économisé par mois</div>
                <div className="text-4xl font-black text-white flex items-baseline gap-2">
                  <span>{hoursSavedPerMonth} heures</span>
                  <span className="text-xs font-bold text-slate-400">/ mois</span>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-400 font-semibold mb-1">Gain financier mensuel net</div>
                <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-300">
                  +{netMonthlyGain > 0 ? netMonthlyGain.toLocaleString('fr-FR') : 0} €
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                  soit {moneySavedPerYear.toLocaleString('fr-FR')} € / an économisés
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <Link
              href="/register"
              className="w-full py-3.5 px-6 bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 hover:brightness-110 text-white font-extrabold text-sm rounded-2xl shadow-lg glow-brand transition flex items-center justify-center gap-2 group"
            >
              <span>Économisez {netMonthlyGain > 0 ? netMonthlyGain.toLocaleString('fr-FR') : 0} € dès maintenant</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-center text-[11px] text-slate-400 font-semibold mt-3">
              14 jours d'essai offerts • Sans carte bancaire • Configuration en 2 min
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
