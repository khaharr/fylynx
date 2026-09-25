'use client';

import Link from 'next/link';
import FylynxLogo from '@/components/FylynxLogo';
import { ShieldCheck, Lock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LandingFooter() {
  const { t, getLocalizedHref } = useLanguage();

  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12 text-xs text-slate-400">
        <div className="col-span-2 md:col-span-4 space-y-4">
          <FylynxLogo size="lg" variant="dark" href="/" />
          <p className="leading-relaxed">
            Plateforme SaaS de collecte et vérification automatisée de pièces justificatives B2B. Conforme RGPD et certifié souverain.
          </p>
          <div className="flex items-center gap-3 pt-2 text-[11px] font-bold text-slate-300">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> RGPD Compliant
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full">
              <Lock className="h-3.5 w-3.5 text-brand-400" /> AES-256
            </span>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 space-y-3">
          <h4 className="font-extrabold uppercase tracking-wider text-slate-200">Produit</h4>
          <ul className="space-y-2">
            <li><a href={getLocalizedHref('/#fonctionnalites')} className="hover:text-white transition">{t('nav_features')}</a></li>
            <li><a href={getLocalizedHref('/#demo-ia')} className="hover:text-white transition">{t('nav_ai')}</a></li>
            <li><a href={getLocalizedHref('/#tarifs')} className="hover:text-white transition">{t('nav_pricing')}</a></li>
            <li><Link href={getLocalizedHref('/register')} className="hover:text-white transition">{t('nav_register')}</Link></li>
          </ul>
        </div>

        <div className="col-span-1 md:col-span-3 space-y-3">
          <h4 className="font-extrabold uppercase tracking-wider text-slate-200">Ressources & Guides</h4>
          <ul className="space-y-2">
            <li><Link href={getLocalizedHref('/blog')} className="hover:text-white transition">Blog & Articles</Link></li>
            <li><Link href={getLocalizedHref('/aide')} className="hover:text-white transition">Guide Prise de Vue Smartphone</Link></li>
            <li><Link href={getLocalizedHref('/aide')} className="hover:text-white transition">Centre d&apos;Aide & FAQ</Link></li>
          </ul>
        </div>

        <div className="col-span-2 md:col-span-3 space-y-3 border-t border-slate-900 md:border-t-0 pt-6 md:pt-0">
          <h4 className="font-extrabold uppercase tracking-wider text-slate-200">Mentions & Sécurité</h4>
          <p className="leading-relaxed">
            Hébergement sécurisé ISO 27001 en France (Union Européenne). Chiffrement de bout en bout des données clients.
          </p>
          <p className="text-[11px] text-slate-500 pt-2">
            © {new Date().getFullYear()} Fylynx. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
