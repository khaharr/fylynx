'use client';

import { Star, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const REVIEWS = [
  {
    author: 'Mathieu Bertrand',
    role: 'Directeur d\'Agence Immobilière (Century 21)',
    text: 'Avant Fylynx, nous passions un temps fou à relancer les locataires pour avoir leurs fiches de paie et avis d\'imposition. Aujourd\'hui, nos dossiers sont complets en 48h sans aucun appel de relance.',
    stars: 5,
  },
  {
    author: 'Sophie Lemoine',
    role: 'Expert-Comptable Associée (Cabinet Lemoine & Associés)',
    text: 'La vérification automatique par IA des pièces d\'identité et le contrôle des récoles de justificatifs de domicile nous épargnent un travail de contrôle fastidieux et éliminent les erreurs.',
    stars: 5,
  },
  {
    author: 'Marc Durand',
    role: 'Courtier en Prêt Immobilier (Durand Finance)',
    text: 'Nos clients apprécient énormément la simplicité du lien mobile. Ils prennent en photo leur passeport et leurs relevés directement sur leur smartphone et tout est certifié instantanément.',
    stars: 5,
  },
];

export default function TestimonialsSection() {
  const { t } = useLanguage();

  return (
    <section id="temoignages" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-amber-400" />
          ))}
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {t('testimonials_title')}
        </h2>
        <p className="text-base text-slate-400">
          {t('testimonials_desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {REVIEWS.map((r, i) => (
          <div
            key={i}
            className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/40 transition-all duration-300 flex flex-col justify-between space-y-6 backdrop-blur-xl"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(r.stars)].map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">« {r.text} »</p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-brand-500/20 text-brand-300 font-black text-xs flex items-center justify-center border border-brand-500/30">
                {r.author.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  {r.author} <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                </h4>
                <span className="text-[11px] text-slate-400 font-medium block">{r.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
