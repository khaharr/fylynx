'use client';

import { useState } from 'react';
import { Briefcase, Building2, Calculator, UserCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const USE_CASES = [
  {
    id: 'immo',
    nameKey: 'uc_immo',
    defaultName: 'Agences & Bailleurs',
    icon: Building2,
    badge: 'Immobilier & Gestion Locative',
    title: 'Constituez les dossiers locataires & acquéreurs 5x plus vite',
    description: 'Fini les pièces manquantes avant la signature des baux ou des compromis de vente. Fylynx s\'assure que chaque dossier locatif ou acquéreur est complet et certifié avant transmission au bailleur.',
    docsNeeded: ['CNI / Passeport (MRZ)', '3 Dernières Fiches de Paie', 'Avis d\'Imposition', 'Justificatif de Domicile (-3 mois)'],
  },
  {
    id: 'compta',
    nameKey: 'uc_compta',
    defaultName: 'Comptabilité & Paie',
    icon: Calculator,
    badge: 'Cabinets d\'Expertise Comptable',
    title: 'Automatisez la collecte des pièces mensuelles et bilans',
    description: 'Fini le marathon des relances de fin de mois pour récupérer les factures et relevés bancaires manquants. Vos clients reçoivent un rappel automatique clair et déposent leurs pièces en 1 clic.',
    docsNeeded: ['Relevés Bancaires', 'Factures Ventes & Achats', 'Kbis (-3 mois)', 'Pièce d\'Identité Gérant'],
  },
  {
    id: 'courtage',
    nameKey: 'uc_courtage',
    defaultName: 'Courtiers & Banques',
    icon: Briefcase,
    badge: 'Crédit & Assurance',
    title: 'Sécurisez l\'onboarding KYC et les dossiers de financement',
    description: 'Accélérez les accords de principe bancaires en éliminant les pièces illisibles ou périmées dès le premier dépôt. L\'IA Vision contrôle l\'authenticité des documents d\'identité.',
    docsNeeded: ['Pièce d\'Identité (Anti-Fraude)', '3 Derniers Relevés de Compte', '2 Derniers Avis d\'Imposition', 'Justificatif d\'Apport'],
  },
  {
    id: 'rh',
    nameKey: 'uc_rh',
    defaultName: 'Services RH & Recrutement',
    icon: UserCheck,
    badge: 'Ressources Humaines',
    title: 'Simplifiez l\'onboarding documentaire des nouveaux salariés',
    description: 'Collectez la carte vitale, le RIB, le diplôme et la CNI de vos nouveaux collaborateurs avant leur premier jour de travail, sans échanger de mails non sécurisés.',
    docsNeeded: ['Carte Nationale d\'Identité', 'Attestation Carte Vitale', 'RIB Officiel', 'Justificatif de Domicile'],
  },
];

export default function UseCasesSection() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);
  const activeUseCase = USE_CASES[activeTab];
  const Icon = activeUseCase.icon;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {t('use_case_title')}
        </h2>
        <p className="text-base text-slate-400">
          {t('use_case_desc')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {USE_CASES.map((uc, index) => {
          const TabIcon = uc.icon;
          return (
            <button
              key={uc.id}
              onClick={() => setActiveTab(index)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                activeTab === index
                  ? 'bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 text-white shadow-xl glow-brand scale-105'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <TabIcon className="h-4 w-4" />
              {t(uc.nameKey as Parameters<typeof t>[0]) || uc.defaultName}
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="px-3.5 py-1.5 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/30 text-xs font-bold inline-flex items-center gap-2">
            <Icon className="h-4 w-4 text-brand-400" />
            {activeUseCase.badge}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {activeUseCase.title}
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {activeUseCase.description}
          </p>
        </div>

        <div className="lg:col-span-5 bg-slate-950/90 border border-slate-800 p-6 rounded-2xl space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block border-b border-slate-800 pb-3">
            Exemple de pièces collectées automatiquement :
          </span>
          <ul className="space-y-3">
            {activeUseCase.docsNeeded.map((doc, i) => (
              <li key={i} className="flex items-center gap-3 text-xs font-semibold text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                {doc}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
