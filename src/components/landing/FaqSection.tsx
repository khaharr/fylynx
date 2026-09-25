'use client';

import { useState } from 'react';
import { HelpCircle, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const FAQS = [
  {
    q: 'Comment mes clients déposent-ils leurs pièces justificatives ?',
    a: 'Vos clients reçoivent un lien sécurisé par e-mail. En cliquant sur le lien depuis leur smartphone, ils ouvrent directement l\'interface sans mot de passe ni application à télécharger. Ils prennent en photo leurs pièces ou sélectionnent leurs PDF.',
  },
  {
    q: 'Comment fonctionnent les relances automatiques ?',
    a: 'Vous définissez la fréquence des relances (ex: quotidiennes ou tous les 2 jours). Fylynx envoie automatiquement des rappels courtois par e-mail ciblant uniquement les pièces encore manquantes jusqu\'à ce que le dossier soit complet.',
  },
  {
    q: 'L\'IA Fylynx garantit-elle la conformité des documents ?',
    a: 'Oui. Notre moteur d\'IA Vision inspecte la lisibilité des pièces d\'identité (bandes MRZ), vérifie la date des justificatifs de domicile (-3 mois), authentifie les en-têtes d\'avis d\'imposition et rejette instantanément les photos floues ou non conformes.',
  },
  {
    q: 'Mes données sont-elles hébergées en France et conformes au RGPD ?',
    a: 'Absolument. Toutes les données et documents sont chiffrés selon la norme militaire (AES-256) et conservés sur des serveurs souverains sécurisés certifiés ISO 27001 situés en France / UE.',
  },
  {
    q: 'Puis-je personnaliser l\'interface aux couleurs de mon entreprise ?',
    a: 'Oui. Dès la formule Pro Illimité, vous pouvez téléverser votre propre logo, personnaliser le message d\'accueil et utiliser votre propre charte graphique (Marque Blanche).',
  },
];

export default function FaqSection() {
  const { t } = useLanguage();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
          <HelpCircle className="h-4 w-4 text-indigo-400" />
          <span>{t('faq_badge')}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {t('faq_title')}
        </h2>
        <p className="text-base text-slate-400">
          {t('faq_desc')}
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, index) => (
          <div
            key={index}
            className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-brand-300 transition"
            >
              <span>{faq.q}</span>
              <ChevronRight
                className={`h-5 w-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                  activeFaq === index ? 'rotate-90 text-brand-400' : ''
                }`}
              />
            </button>
            {activeFaq === index && (
              <div className="px-6 pb-6 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4 animate-in fade-in duration-200">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
