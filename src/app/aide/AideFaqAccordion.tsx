'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Faut-il créer un compte ou télécharger une application mobile ?',
    answer:
      'Non, absolument pas ! Tout se fait directement dans le navigateur internet de votre smartphone ou ordinateur. Vous cliquez sur le lien sécurisé 1-clic transmis par le professionnel, vous prenez en photo vos pièces justificatives, et elles sont validées immédiatement par notre IA.',
  },
  {
    question: 'Comment photographier efficacement ma Carte Nationale d’Identité ou mon Passeport ?',
    answer:
      'Posez votre titre d’identité bien à plat sur une table sombre ou un bureau. Éteignez le flash de votre téléphone pour éviter tout reflet de lumière directe. Assurez-vous que les 4 bords du document et la bande de lecture optique au bas du document (les 2 lignes avec des chevrons <<<<<) soient bien nettes et non masquées.',
  },
  {
    question: 'Quels sont les formats de fichiers autorisés et la taille maximale ?',
    answer:
      'Vous pouvez téléverser des fichiers au format PDF, PNG, JPG, JPEG ou WEBP. La taille maximale par document est de 50 Mo, ce qui couvre largement les photos prises en haute définition sur les smartphones récents.',
  },
  {
    question: 'Quelle doit être la date de validité de mon justificatif de domicile ?',
    answer:
      'Les justificatifs de domicile (facture d’électricité, d’eau, de gaz, de téléphone fixe/internet, ou attestation d’assurance habitation) doivent dater de moins de 3 mois (90 jours) au jour du dépôt. Pour les avis d’imposition, transmettez le dernier avis reçu.',
  },
  {
    question: 'Que se passe-t-il si mon fichier est refusé par l’IA de vérification ?',
    answer:
      'Si un document n’est pas conforme (photo floue, document tronqué, flash agressif ou pièce expirée), un message d’explication s’affiche immédiatement sur votre écran pour vous indiquer le motif exact du refus et vous inviter à reprendre une nouvelle photo en 1-clic.',
  },
  {
    question: 'Comment mes données personnelles et pièces sont-elles protégées ?',
    answer:
      'Toutes les pièces déposées sont chiffrées selon les normes militaires AES-256 lors de leur transfert (SSL/TLS 1.3) et de leur stockage. Vos données sont hébergées exclusivement sur des serveurs souverains situés en Europe et sont strictement soumises à la réglementation RGPD.',
  },
];

export default function AideFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {FAQ_ITEMS.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden transition backdrop-blur-xl shadow-lg hover:border-slate-700"
          >
            <button
              onClick={() => toggleIndex(idx)}
              className="w-full p-5 text-left flex items-center justify-between gap-4 font-extrabold text-sm sm:text-base text-white hover:text-brand-300 transition"
            >
              <span className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-brand-400 shrink-0" />
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-slate-400 shrink-0 transform transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-brand-400' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 border-t border-slate-800/60 leading-relaxed animate-in fade-in duration-150">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
