'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  XCircle,
  CheckCircle2,
  ArrowRight,
  Zap,
  Mail,
  Clock,
  FileX,
  FileCheck2,
  Bot,
  ShieldCheck,
  Smartphone,
  Sliders,
  Scale,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function BeforeAfterSection() {
  const { t } = useLanguage();
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging && e.buttons !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPosition(percent);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-brand-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-brand-500/20 to-indigo-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold shadow-sm">
          <Sliders className="h-4 w-4 text-brand-400" />
          <span>Comparatif Interactif Avant / Après</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Passez des relances chaotiques à l&apos;automatisation totale.
        </h2>

        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Faites glisser le curseur ci-dessous pour mesurer la différence entre la gestion classique par e-mail et la puissance de Fylynx.
        </p>

        {/* Quick Presets Toggle */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setSliderPosition(15)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
              sliderPosition < 30
                ? 'bg-rose-950/80 border-rose-500/60 text-rose-300 shadow-md shadow-rose-950/40'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            ❌ Sans Fylynx (Méthode Classique)
          </button>
          <button
            type="button"
            onClick={() => setSliderPosition(50)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
              sliderPosition >= 30 && sliderPosition <= 70
                ? 'bg-brand-600/30 border-brand-500/60 text-brand-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5 text-brand-400" /> Vue 50/50
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSliderPosition(85)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
              sliderPosition > 70
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-md shadow-emerald-950/40'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            ✅ Avec Fylynx (100% Automatique)
          </button>
        </div>
      </div>

      {/* Main Interactive Comparison Card Box */}
      <div
        className="relative bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden select-none cursor-ew-resize min-h-[540px] backdrop-blur-2xl"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* RIGHT SIDE (AFTER - FYLYNX) - Full Width Background Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/30 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                AVEC FYLYNX — MÉTHODE MODERNE & IA
              </span>
              <span className="hidden sm:inline-block text-xs text-emerald-400 font-bold">
                100% Zéro Relance Manuelle
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1.5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Smartphone className="h-4 w-4 text-emerald-400 shrink-0" />
                  Lien Unique 1-Clic Sans Compte
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Vos clients photographient leurs pièces justificatives en 30 secondes depuis leur smartphone sans créer de mot de passe.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1.5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Zap className="h-4 w-4 text-indigo-400 shrink-0" />
                  Relances automatiques quotidiennes
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Rappels e-mail automatiques programmés (24h/48h) tant que le dossier n&apos;est pas complet. 0 minute de travail manuel.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-brand-950/40 border border-brand-500/30 space-y-1.5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Bot className="h-4 w-4 text-brand-400 shrink-0" />
                  Inspection & Certification IA
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  L&apos;IA vérifie les bandes MRZ (CNI/Passeport), la récence des factures (-3 mois) et rejette instantanément les fichiers flous.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-1.5 backdrop-blur-md">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <FileCheck2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  Exportation ZIP 1-Clic Structurée
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Téléchargez tous les dossiers clients en archive ZIP ordonnée avec la nomenclature normalisée de votre entreprise.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-emerald-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Conforme RGPD • Hébergement France ISO 27001
            </div>
            <Link
              href="/register"
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 via-brand-500 to-indigo-600 hover:brightness-110 text-white font-extrabold rounded-2xl text-xs shadow-xl shadow-emerald-500/20 flex items-center gap-2 transition glow-brand"
            >
              Essayer Fylynx Gratuitement <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* LEFT SIDE (BEFORE - TRADITIONAL) - Clipped Overlay Layer */}
        <div
          className="absolute inset-y-0 left-0 bg-slate-950 border-r border-slate-800 p-6 sm:p-10 flex flex-col justify-between overflow-hidden transition-all duration-75"
          style={{ width: `${sliderPosition}%` }}
        >
          <div className="w-[1000px] max-w-none">
            <div className="flex items-center justify-between mb-6">
              <span className="px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-rose-500/10">
                <XCircle className="h-4 w-4 text-rose-400" />
                AVANT FYLYNX — MÉTHODE MANUELLE CLASSIQUE
              </span>
              <span className="hidden sm:inline-block text-xs text-rose-400 font-bold">
                ~ 4 Heures Perdues / Semaine
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left opacity-90">
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-900/50 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-bold text-rose-200">
                  <Mail className="h-4 w-4 text-rose-400 shrink-0" />
                  E-mails chaotiques & Pièces bloquées
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Discussions par mail interminables, pièces jointes trop lourdes refusées par le serveur (25 Mo max).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-900/50 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-bold text-rose-200">
                  <Clock className="h-4 w-4 text-rose-400 shrink-0" />
                  Relances manuelles chronophages
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Oublis fréquents, appels de relance répétés et perte de dossiers importants faute de suivi rigoureux.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-900/50 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-bold text-rose-200">
                  <FileX className="h-4 w-4 text-rose-400 shrink-0" />
                  Documents flous & inutilisables
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Reconstitution tardive des dossiers car les clients envoient des photos illisibles ou des justificatifs périmés.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-900/50 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-bold text-rose-200">
                  <FileX className="h-4 w-4 text-rose-400 shrink-0" />
                  Classement manuel désordonné
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Téléchargement fichier par fichier, renommage manuel et perte de temps administrative considérable.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-rose-950/60 w-[1000px] max-w-none">
            <p className="text-xs text-rose-300/80 italic">
              &quot;92% des cabinets perdent entre 3 et 5 heures par collaborateur chaque semaine en relances manuelle par e-mail.&quot;
            </p>
          </div>
        </div>

        {/* Central Vertical Slider Handle Divider */}
        <div
          className="absolute top-0 bottom-0 z-20 w-1 bg-gradient-to-b from-brand-400 via-white to-brand-400 shadow-[0_0_15px_rgba(99,102,241,0.8)] pointer-events-none"
          style={{ left: `calc(${sliderPosition}% - 2px)` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-11 w-11 rounded-2xl bg-slate-950 border-2 border-brand-400 text-white shadow-2xl flex items-center justify-center font-black text-xs pointer-events-auto cursor-ew-resize hover:scale-110 transition">
            ⇄
          </div>
        </div>
      </div>
    </section>
  );
}
