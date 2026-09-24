'use client';

import React from 'react';
import { Check, X, Sparkles, ShieldCheck, Zap, Bot, Palette, Layers, Building2 } from 'lucide-react';
import { PLANS } from '@/lib/stripe';

interface ComparisonFeature {
  name: string;
  description?: string;
  starter: boolean | string;
  pro: boolean | string;
  scale: boolean | string;
  enterprise: boolean | string;
}

interface FeatureSection {
  title: string;
  icon: React.ReactNode;
  features: ComparisonFeature[];
}

const COMPARISON_SECTIONS: FeatureSection[] = [
  {
    title: 'Capacités & Volume de Collecte',
    icon: <Layers className="h-4 w-4 text-brand-400" />,
    features: [
      {
        name: 'Portails de Collecte Client actifs',
        description: 'Nombre de liens d\'invitation et de demandes de pièces simultanés',
        starter: '10 portails / mois',
        pro: 'Portails ILLIMITÉS',
        enterprise: 'Portails ILLIMITÉS',
        scale: 'Portails & Contacts ILLIMITÉS (Volume Agence 300+)',
      },
      {
        name: 'Comptes Utilisateurs Collaborateurs',
        description: 'Membres de votre équipe ayant un accès au dashboard admin',
        starter: '1 utilisateur',
        pro: '5 utilisateurs',
        enterprise: '10 utilisateurs',
        scale: '20 utilisateurs d\'équipe',
      },
      {
        name: 'Espace de Stockage Cloud Sécurisé',
        description: 'Espace d\'archivage des documents justificatifs clients',
        starter: '5 Go',
        pro: '500 Go',
        enterprise: '1 To Cloud',
        scale: '2 To + Google Drive Master',
      },
      {
        name: 'Essai gratuit 14 jours sans engagement',
        description: 'Accès immédiat sans saisir de carte bancaire',
        starter: true,
        pro: true,
        enterprise: true,
        scale: true,
      },
      {
        name: 'Exportation ZIP groupée 1-clic',
        description: 'Téléchargement de tous les dossiers classés par nom de client',
        starter: true,
        pro: true,
        enterprise: true,
        scale: true,
      },
    ],
  },
  {
    title: 'Marque Blanche & Personnalisation Entreprise',
    icon: <Palette className="h-4 w-4 text-emerald-400" />,
    features: [
      {
        name: 'Logo d\'entreprise sur liens clients',
        description: 'Affichage direct de votre propre logo PNG/SVG sur la page du client',
        starter: false,
        pro: 'Oui (Téléversement + URL)',
        enterprise: 'Oui (Téléversement + URL)',
        scale: 'Oui (Téléversement + URL)',
      },
      {
        name: 'Message d\'accueil personnalisé',
        description: 'Consignes d\'accueil et texte sur mesure pour vos clients',
        starter: false,
        pro: true,
        enterprise: true,
        scale: true,
      },
      {
        name: 'Palette de couleurs & Thème de marque',
        description: 'Harmonisation des boutons et accents visuels du portail client',
        starter: false,
        pro: '7 palettes + code Hex custom',
        enterprise: '7 palettes + code Hex custom',
        scale: '7 palettes + code Hex custom',
      },
      {
        name: 'Expérience 100% Marque Blanche',
        description: 'Suppression des crédits et mentions Fylynx par défaut',
        starter: false,
        pro: true,
        enterprise: true,
        scale: true,
      },
    ],
  },
  {
    title: 'Relances Automatiques & Suivi',
    icon: <Zap className="h-4 w-4 text-amber-400" />,
    features: [
      {
        name: 'Relances automatiques Email & SMS',
        description: 'Rappels intelligents quotidiens (24h/48h) tant que le dossier est incomplet',
        starter: 'Manuelles (1-clic)',
        pro: 'Automatiques quotidiennes',
        enterprise: 'Automatiques quotidiennes',
        scale: 'Automatiques e-mail, SMS & 24/7',
      },
      {
        name: 'Suivi des dates d\'expiration des pièces',
        description: 'Alertes et recollecte automatique avant l\'expiration des documents',
        starter: false,
        pro: true,
        enterprise: true,
        scale: true,
      },
      {
        name: 'Notifications de dépôt en temps réel',
        description: 'Alerte instantanée dès qu\'un client ajoute un document',
        starter: true,
        pro: true,
        enterprise: true,
        scale: true,
      },
    ],
  },
  {
    title: 'Intégrations, API & Workflow Scale (Exclusif 247 €)',
    icon: <Building2 className="h-4 w-4 text-cyan-400" />,
    features: [
      {
        name: 'Tableau de Validation & Workflows',
        description: 'Dashboard complet d\'acceptation / rejet et gestion des relances',
        starter: false,
        pro: true,
        enterprise: true,
        scale: 'Workflows & Formulaires illimités',
      },
      {
        name: 'Intégrations Zapier, Make, Notion & Webhooks',
        description: 'Synchronisation automatique de vos dossiers avec vos outils favoris',
        starter: false,
        pro: false,
        enterprise: false,
        scale: 'Exclusif Agence Scale (Inclus)',
      },
    ],
  },
  {
    title: 'Inspection par IA Vision & Détection de Fraude',
    icon: <Bot className="h-4 w-4 text-indigo-400" />,
    features: [
      {
        name: 'Vérification IA des CNI & Passeports',
        description: 'Lecture automatique des bandes MRZ ISO 7501 et détection d\'authenticité',
        starter: false,
        pro: false,
        enterprise: 'IA Temps Réel Instantanée',
        scale: 'IA Vision Instantanée Inclus',
      },
      {
        name: 'Contrôle automatique de récence (-3 mois)',
        description: 'Vérification IA de la date d\'émission des justificatifs de domicile',
        starter: false,
        pro: false,
        enterprise: 'Automatique par IA Vision',
        scale: 'Automatique par IA Vision',
      },
      {
        name: 'Extraction & Contrôle des Fiches de Paie',
        description: 'Vérification de cohérence des bulletins de salaire',
        starter: false,
        pro: false,
        enterprise: 'Automatique par IA Vision',
        scale: 'Automatique par IA Vision',
      },
      {
        name: 'Rapport d\'Audit & Score Anti-Fraude',
        description: 'Génération d\'un score de sincérité et rapport d\'audit horodaté',
        starter: false,
        pro: false,
        enterprise: 'Rapport d\'Audit complet',
        scale: 'Rapport d\'Audit complet',
      },
    ],
  },
  {
    title: 'Sécurité, Conformité & Support Client VIP',
    icon: <ShieldCheck className="h-4 w-4 text-cyan-400" />,
    features: [
      {
        name: 'Chiffrement souverain AES-256 & TLS 1.3',
        description: 'Chiffrement de niveau bancaire des fichiers et métadonnées',
        starter: true,
        pro: true,
        enterprise: true,
        scale: true,
      },
      {
        name: 'Hébergement certifié ISO 27001 (France / UE)',
        description: 'Données stockées exclusivement en Europe (Conforme RGPD)',
        starter: true,
        pro: true,
        enterprise: true,
        scale: true,
      },
      {
        name: 'Support Client & Accompagnement',
        description: 'Niveau d\'assistance technique et accompagnement',
        starter: 'Email standard',
        pro: 'Prioritaire 7j/7',
        enterprise: 'Prioritaire 7j/7',
        scale: 'Support VIP 24/7 + Chargé dédié',
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
  const renderValue = (val: boolean | string, isPro = false, isEnterprise = false, isScale = false) => {
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
        {val}
      </span>
    );
  };

  return (
    <div className="w-full mt-16 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-brand-400 flex items-center justify-center gap-1.5">
          <Sparkles className="h-4 w-4" /> Tableau Comparatif des Fonctionnalités
        </span>
        <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Comparez en détail et choisissez l&apos;offre parfaite
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
          Toutes les fonctionnalités comparées ligne par ligne. Changez ou résiliez votre formule à tout moment en 1-clic.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex lg:hidden items-center justify-center gap-1.5 text-[11px] font-extrabold text-brand-400 bg-brand-500/10 py-2 px-4 rounded-xl border border-brand-500/20 text-center">
          <span>👈 Glissez horizontalement pour comparer les 4 formules 👉</span>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-2xl p-1">
          <table className="w-full text-left border-collapse min-w-[900px]">
            {/* Header Row */}
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/90">
                <th className="py-6 px-6 text-sm font-extrabold text-white w-4/12 align-bottom">
                  Fonctionnalités & Services
                </th>

                {/* 1. Starter Column */}
                <th className="py-6 px-3 text-center w-2/12 align-bottom">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Starter
                  </span>
                  <div className="text-2xl font-black text-white">
                    {isAnnual ? '23 €' : '29 €'}
                    <span className="text-[11px] font-normal text-slate-400 block">/mois</span>
                  </div>
                  {isAnnual && (
                    <span className="text-[10px] text-brand-400 font-extrabold block mt-1">
                      276 € / an
                    </span>
                  )}
                  {onSelectPlan && (
                    <button
                      onClick={() => onSelectPlan('STARTER')}
                      className="mt-3 w-full py-2 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-extrabold rounded-xl transition border border-slate-700"
                    >
                      Sélectionner Starter
                    </button>
                  )}
                </th>

                {/* 2. Pro Column */}
                <th className="py-6 px-3 text-center w-2/12 bg-emerald-500/10 border-x border-emerald-500/30 align-bottom">
                  <div className="inline-flex items-center justify-center bg-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-1">
                    POPULAIRE
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    Pro Illimité
                  </span>
                  <div className="text-2xl font-black text-white">
                    {isAnnual ? '63 €' : '79 €'}
                    <span className="text-[11px] font-normal text-slate-400 block">/mois</span>
                  </div>
                  {isAnnual && (
                    <span className="text-[10px] text-emerald-400 font-extrabold block mt-1">
                      756 € / an
                    </span>
                  )}
                  {onSelectPlan && (
                    <button
                      onClick={() => onSelectPlan('PRO')}
                      className="mt-3 w-full py-2 px-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-black rounded-xl shadow-lg transition"
                    >
                      Sélectionner Pro
                    </button>
                  )}
                </th>

                {/* 3. Enterprise Column */}
                <th className="py-6 px-3 text-center w-2/12 bg-indigo-950/40 border-r border-indigo-500/30 align-bottom">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 block mb-1">
                    IA Enterprise
                  </span>
                  <div className="text-2xl font-black text-white">
                    {isAnnual ? '119 €' : '149 €'}
                    <span className="text-[11px] font-normal text-slate-400 block">/mois</span>
                  </div>
                  {isAnnual && (
                    <span className="text-[10px] text-indigo-300 font-extrabold block mt-1">
                      1 428 € / an
                    </span>
                  )}
                  {onSelectPlan && (
                    <button
                      onClick={() => onSelectPlan('AI_ENTERPRISE')}
                      className="mt-3 w-full py-2 px-2 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-extrabold rounded-xl transition shadow-lg shadow-indigo-500/20"
                    >
                      Activer IA
                    </button>
                  )}
                </th>

                {/* 4. Agence Scale Column (FAR RIGHT / LAST COLUMN - HIGHLIGHTED ULTIMATE) */}
                <th className="py-6 px-3 text-center w-2/12 bg-cyan-950/60 border-l border-cyan-500/40 align-bottom">
                  <div className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-lg mb-1 whitespace-nowrap animate-pulse">
                    🏆 ULTIME & INTÉGRATIONS
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 block mb-1">
                    Agence Scale
                  </span>
                  <div className="text-2xl font-black text-white">
                    {isAnnual ? '230 €' : '247 €'}
                    <span className="text-[11px] font-normal text-slate-400 block">/mois</span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-bold block mt-0.5">
                    0,82 € / contact
                  </span>
                  {isAnnual && (
                    <span className="text-[10px] text-cyan-300 font-extrabold block mt-0.5">
                      2 760 € / an
                    </span>
                  )}
                  {onSelectPlan && (
                    <button
                      onClick={() => onSelectPlan('AGENCY_SCALE')}
                      className="mt-3 w-full py-2.5 px-2 bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs font-black rounded-xl shadow-xl shadow-cyan-500/20 transition transform hover:scale-105"
                    >
                      Passer à Scale ({isAnnual ? `${PLANS.AGENCY_SCALE.priceAnnualMonthly}€` : `${PLANS.AGENCY_SCALE.priceMonthly}€`})
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
                      {section.title}
                    </td>
                  </tr>

                  {/* Features Rows */}
                  {section.features.map((feat, fIdx) => (
                    <tr
                      key={fIdx}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30 transition text-xs"
                    >
                      <td className="py-4 px-6 space-y-0.5">
                        <div className="font-bold text-slate-100">{feat.name}</div>
                        {feat.description && (
                          <div className="text-[11px] text-slate-400">{feat.description}</div>
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

                      {/* 4. Agence Scale (FAR RIGHT / LAST COLUMN) */}
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

