'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ArrowLeft, X, CheckCircle2, Link2, Building2, BellRing, Compass, Zap } from 'lucide-react';

interface OnboardingTourProps {
  onOpenCreateModal: () => void;
}

export default function OnboardingTour({ onOpenCreateModal }: OnboardingTourProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);

  useEffect(() => {
    const isCompleted = localStorage.getItem('fylynx_onboarding_completed');
    if (!isCompleted) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('fylynx_onboarding_completed', 'true');
    setIsOpen(false);
  };

  const handleRestart = () => {
    setStep(1);
    setIsOpen(true);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={handleRestart}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-brand-600/30 to-indigo-600/30 border border-brand-500/50 text-brand-300 hover:text-white hover:border-brand-400 transition shadow-lg backdrop-blur-md text-xs font-extrabold"
      >
        <Compass className="h-4 w-4 text-brand-400 animate-pulse" />
        Visite Guidée 💡
      </button>
    );
  }

  const stepsData = [
    {
      step: 1,
      badge: 'Étape 1 / 3 — Lien de Dépôt 1-Clic',
      title: 'Créez votre premier dossier client en 1-Clic',
      subtitle: 'Envoyez un lien unique sans obliger votre client à créer de compte ou télécharger d\'application.',
      desc: 'Cliquez sur le bouton violet "+ Nouveau Dossier Client (1-Clic)" dans votre tableau de bord. Saisissez les pièces demandées (ex: CNI, justificatif de domicile, bulletins de paie) et partagez le lien généré par WhatsApp ou E-mail.',
      icon: Link2,
      iconColor: 'text-brand-400',
      badgeBg: 'bg-brand-500/20 text-brand-300 border-brand-500/40',
      actionText: 'Tester la création immédiate (1-Clic)',
      action: () => {
        handleComplete();
        onOpenCreateModal();
      },
    },
    {
      step: 2,
      badge: 'Étape 2 / 3 — Marque Blanche & Logo',
      title: 'Personnalisez votre portail client à vos couleurs',
      subtitle: 'Offrez une expérience 100% professionnelle aux couleurs de votre entreprise.',
      desc: 'Accédez à la rubrique "Paramètres" (en haut dans la barre de navigation). Téléversez votre logo d\'entreprise, choisissez votre palette de couleurs préférée et rédigez un message d\'accueil sur mesure pour vos clients.',
      icon: Building2,
      iconColor: 'text-indigo-400',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      actionText: 'Aller configurer mon Logo dans les Paramètres',
      actionLink: '/dashboard/settings',
    },
    {
      step: 3,
      badge: 'Étape 3 / 3 — Relances Automatiques',
      title: 'Activez le suivi et les relances automatiques',
      desc: 'Fylynx relance automatiquement vos clients par e-mail toutes les 24h/48h tant que les pièces n\'ont pas été transmises. Vous pouvez également déclencher une relance manuelle immédiate en 1 clic grâce au bouton "Relancer Incomplets".',
      icon: BellRing,
      iconColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      actionText: '✨ Terminer la visite et démarrer',
      action: () => {
        handleComplete();
      },
    },
  ];

  const currentStep = stepsData[step - 1];
  const StepIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 font-sans selection:bg-brand-500 selection:text-white">
      {/* Central Modal Card */}
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 relative space-y-6 p-6 sm:p-8 backdrop-blur-3xl animate-in zoom-in-95 duration-200">
        {/* Glow ambient background lights */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between relative z-10">
          <span className={`px-3.5 py-1.5 rounded-full border text-xs font-bold flex items-center gap-2 shadow-sm ${currentStep.badgeBg}`}>
            <Sparkles className="h-4 w-4" />
            {currentStep.badge}
          </span>
          <button
            type="button"
            onClick={handleComplete}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Quitter la visite guidée"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Content Body */}
        <div className="space-y-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 shadow-lg shadow-black/40">
              <StepIcon className={`h-7 w-7 ${currentStep.iconColor}`} />
            </div>
            <div className="space-y-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                {currentStep.title}
              </h2>
              <p className="text-xs font-semibold text-brand-300">
                {currentStep.subtitle}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed shadow-inner">
            {currentStep.desc}
          </div>
        </div>

        {/* Action Button CTA */}
        <div className="relative z-10">
          {currentStep.actionLink ? (
            <Link
              href={currentStep.actionLink}
              onClick={handleComplete}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-brand-600 hover:brightness-110 text-white text-xs font-extrabold rounded-2xl shadow-xl flex items-center justify-center gap-2 transition"
            >
              {currentStep.actionText} <ArrowRight className="h-4 w-4" />
            </Link>
          ) : currentStep.action ? (
            <button
              type="button"
              onClick={currentStep.action}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-600 hover:brightness-110 text-white text-xs font-extrabold rounded-2xl shadow-xl flex items-center justify-center gap-2 transition glow-brand"
            >
              {currentStep.actionText}
            </button>
          ) : null}
        </div>

        {/* Navigation Dots & Prev/Next Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 relative z-10">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStep(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === step
                    ? 'w-8 bg-gradient-to-r from-brand-500 to-indigo-400 shadow-md shadow-brand-500/50'
                    : i < step
                    ? 'w-2.5 bg-emerald-400'
                    : 'w-2.5 bg-slate-800'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" /> Précédent
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 hover:brightness-110 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-brand-600/30 flex items-center gap-1.5 transition"
            >
              {step === 3 ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> J&apos;ai compris !
                </>
              ) : (
                <>
                  Suivant <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
