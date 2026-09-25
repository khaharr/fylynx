'use client';

import { useState } from 'react';
import { Sparkles, FileText, FileCheck2, CheckCircle2, AlertTriangle, Check, X, Zap } from 'lucide-react';

const SAMPLE_DOCS = [
  {
    id: 'cni',
    name: 'Carte Nationale d\'Identité (CNI)',
    fileName: 'CNI_Recto_Marc_Martin.png',
    score: 98,
    status: 'PASSED',
    category: 'Pièce d\'Identité Officielle (France/UE)',
    summary: 'Filigranes officiels détectés. Bandes MRZ valides et nom "Marc Martin" certifié à 98%.',
    checks: [
      { label: 'Présence des bandes MRZ & filigranes', passed: true },
      { label: 'Nom "Marc Martin" détecté', passed: true },
      { label: 'Date d\'expiration valide (2032)', passed: true },
    ],
  },
  {
    id: 'avis',
    name: 'Avis d\'Imposition',
    fileName: 'Avis_Imposition_2025.pdf',
    score: 96,
    status: 'PASSED',
    category: 'Avis d\'Imposition DGFIP',
    summary: 'En-tête Ministère des Finances Publiques authentifié. Revenu fiscal et nom concordants.',
    checks: [
      { label: 'En-tête officiel DGFIP', passed: true },
      { label: 'Rapprochement d\'identité titulaire', passed: true },
      { label: 'Document récent (-12 mois)', passed: true },
    ],
  },
  {
    id: 'facture',
    name: 'Facture EDF / Justificatif (-3 mois)',
    fileName: 'Facture_EDF_Juillet_2026.pdf',
    score: 94,
    status: 'PASSED',
    category: 'Justificatif de Domicile Officiel',
    summary: 'Organisme émetteur (EDF) certifié. Adresse du logement et date de facturation conformes (-3 mois).',
    checks: [
      { label: 'Organisme émetteur certifié (EDF)', passed: true },
      { label: 'Date de facturation < 3 mois', passed: true },
      { label: 'Adresse de livraison détectée', passed: true },
    ],
  },
  {
    id: 'invalid_photo',
    name: 'Photo Hors-Sujet (Exemple Rejet)',
    fileName: 'Photo_Immeuble_Batiment.jpeg',
    score: 0,
    status: 'REJECTED',
    category: 'Photo de Bâtiment / Façade',
    summary: 'REJETÉ (0% de confiance). Le fichier importé est une photo de bâtiment/immeuble sans document officiel.',
    checks: [
      { label: 'Détection de document officiel', passed: false },
      { label: 'Presence de texte administratif', passed: false },
      { label: 'Conformité avec la demande', passed: false },
    ],
  },
];

import { useLanguage } from '@/context/LanguageContext';

export default function AiDemoSection() {
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const { t } = useLanguage();
  const activeDoc = SAMPLE_DOCS[selectedDocIndex];

  return (
    <section id="demo-ia" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-bold mb-4">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>{t('ai_demo_badge')}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {t('ai_demo_title')}
        </h2>
        <p className="mt-4 text-base text-slate-400 leading-relaxed">
          {t('ai_demo_desc')}
        </p>
      </div>

      {/* Live Inspection Showcase Box with Tabs */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl space-y-0">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 px-6 py-4 bg-slate-950 gap-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-rose-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-xs font-mono text-slate-300">
              Live Simulator — Inspecteur IA Fylynx v2.5
            </span>
          </div>
          <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 font-bold self-start sm:self-auto">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" /> {t('ai_demo_sim_badge')}
          </span>
        </div>

        {/* Interactive Document Selector Tabs */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center gap-2">
          {SAMPLE_DOCS.map((doc, idx) => (
            <button
              key={doc.id}
              onClick={() => setSelectedDocIndex(idx)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                selectedDocIndex === idx
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              {doc.name}
            </button>
          ))}
        </div>

        {/* Active Inspection Result Box */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-b from-slate-950 to-slate-900">
          {/* Left: Document Card Simulator */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4 relative overflow-hidden">
              {/* Laser scan line animation effect */}
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-brand-400 via-emerald-400 to-indigo-400 animate-laser-scan pointer-events-none" />

              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400">Fichier : {activeDoc.fileName}</span>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                    activeDoc.status === 'PASSED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  Score IA : {activeDoc.score}%
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-brand-400 block tracking-wider">
                  Catégorie Détectée
                </span>
                <p className="text-sm font-extrabold text-white">{activeDoc.category}</p>
              </div>

              <div
                className={`p-4 rounded-xl border space-y-2 ${
                  activeDoc.status === 'PASSED'
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold">
                  {activeDoc.status === 'PASSED' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                  )}
                  <span>Résultat de l&apos;Analyse IA</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed italic">« {activeDoc.summary} »</p>
              </div>
            </div>
          </div>

          {/* Right: Detailed Checklist */}
          <div className="lg:col-span-6 space-y-5">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-brand-400" /> Contrôles d&apos;Authenticité Effectués
            </h3>

            <div className="space-y-3">
              {activeDoc.checks.map((chk, i) => (
                <div
                  key={i}
                  className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-200">{chk.label}</span>
                  {chk.passed ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold flex items-center gap-1">
                      <Check className="h-3 w-3 text-emerald-400" /> Validé
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-extrabold flex items-center gap-1">
                      <X className="h-3 w-3 text-rose-400" /> Rejeté
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs text-slate-400 leading-relaxed">
              <p className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-400 fill-amber-400 shrink-0 inline" /> <strong className="text-white">Validation en 3 secondes :</strong> Si le client transmet une mauvaise pièce, l&apos;IA rejette automatiquement le document avec une explication claire et l&apos;invite à soumettre la bonne pièce.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
