import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Smartphone,
  Sparkles,
  HelpCircle,
  Zap,
  ArrowRight,
  Sun,
  Crop,
  FileText,
  Clock,
  Lock,
} from 'lucide-react';
import AideFaqAccordion from './AideFaqAccordion';

export const metadata: Metadata = {
  title: "Centre d'Aide & Guide Photo Client | fylinx.com",
  description:
    "Guide pratique pas à pas et FAQ pour guider les clients lors de la prise de photo de leurs pièces justificatives (CNI, passeport, avis d'imposition, fiches de paie) sur smartphone.",
  keywords: [
    'Guide photo CNI',
    'Comment photographier passeport',
    'Justificatif de domicile smartphone',
    'Aide dépôt documentaire',
    'Dossier client sécurisé',
    'Fylynx aide',
  ],
  openGraph: {
    title: "Guide & Prise de Vue Smartphone | Centre d'Aide Fylynx",
    description:
      "Conseils et astuces pour réussir la photo de vos pièces justificatives en 1-clic depuis votre téléphone.",
    type: 'website',
  },
};

export default function AidePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Faut-il installer une application ou créer un compte ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Non. Vous n’avez besoin de télécharger aucune application ni de créer de compte. Cliquez simplement sur le lien 1-clic reçu par email ou SMS pour ouvrir directement l’appareil photo de votre smartphone.',
        },
      },
      {
        '@type': 'Question',
        name: 'Comment réussir la photo de ma Carte Nationale d’Identité ou Passeport ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Posez votre carte d’identité ou passeport à plat sur une table bien éclairée, éloignez les reflets de lumière directe, et vérifiez que les 4 coins du document ainsi que la bande MRZ au bas de la pièce soient parfaitement lisibles.',
        },
      },
      {
        '@type': 'Question',
        name: 'Mes données et documents sont-ils protégés et sécurisés ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolument. Vos fichiers sont chiffrés avec la norme bancaire AES-256 et stockés exclusivement sur des serveurs hautement sécurisés situés en Europe, conformément au RGPD.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quels formats et dates de validité sont acceptés ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Les formats PDF, PNG, JPG, JPEG et WEBP sont acceptés. Pour les justificatifs de domicile et fiches de paie, veillez à transmettre des documents émis il y a moins de 3 mois.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Structured SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* HERO SECTION */}
        <div className="text-center space-y-6 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-extrabold shadow-sm">
            <Smartphone className="h-4 w-4 text-brand-400" /> Guide Pratique & Assistance Client
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Comment photographier et déposer vos pièces justificatives ?
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Suivez ce guide rapide étape par étape pour transmettre vos pièces en moins de 2 minutes depuis votre smartphone, sans téléchargement d&apos;application ni mot de passe.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 font-semibold pt-2">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="h-4 w-4" /> Chiffrement AES-256
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-indigo-300">
              <Zap className="h-4 w-4" /> Validation IA Instantanée
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <Lock className="h-4 w-4" /> Conforme RGPD UE
            </span>
          </div>
        </div>

        {/* 4 STEPS GUIDE GRID */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-3xl font-black text-white flex items-center justify-center gap-2">
              <Camera className="h-6 w-6 text-brand-400" /> Les 4 Étapes pour une Photo Conforme
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Des conseils simples pour éviter les refus et accélérer la validation de votre dossier par l&apos;IA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1 */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4 hover:border-brand-500/50 transition">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-brand-600 text-white font-black text-sm flex items-center justify-center shadow-lg shadow-brand-500/20">
                  1
                </div>
                <h3 className="font-extrabold text-white text-base">Éclairage & Surface sans Reflet</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Posez votre document à plat sur une table sombre ou contrastée. Privilégiez une lumière naturelle et évitez le flash direct qui crée des reflets blancs masquant votre nom ou date d&apos;expiration.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 p-2.5 rounded-2xl border border-emerald-500/20">
                <Sun className="h-4 w-4 text-emerald-400 shrink-0" /> Conseil : Éteignez le flash de votre téléphone
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4 hover:border-brand-500/50 transition">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  2
                </div>
                <h3 className="font-extrabold text-white text-base">Conservez les 4 Bords Visibles</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Reculez légèrement votre appareil photo pour garder l&apos;intégralité de la pièce dans le cadre. Veillez à ce qu&apos;aucun doigt ne recouvre le texte ou la bande d&apos;authenticité au bas du passeport/CNI.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-300 bg-indigo-500/10 p-2.5 rounded-2xl border border-indigo-500/20">
                <Crop className="h-4 w-4 text-indigo-400 shrink-0" /> Conseil : Ne coupez pas les coins du document
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4 hover:border-brand-500/50 transition">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg shadow-amber-500/20">
                  3
                </div>
                <h3 className="font-extrabold text-white text-base">Récence & Documents Complètes</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pour les justificatifs de domicile (facture d&apos;électricité, eau, télécom) et bulletins de paie, assurez-vous qu&apos;ils datent de moins de 3 mois et transmettez toutes les pages de l&apos;avis d&apos;imposition.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-bold text-amber-300 bg-amber-500/10 p-2.5 rounded-2xl border border-amber-500/20">
                <Clock className="h-4 w-4 text-amber-400 shrink-0" /> Exigence : Moins de 90 jours pour les factures
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4 hover:border-brand-500/50 transition">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  4
                </div>
                <h3 className="font-extrabold text-white text-base">Dépôt 1-Clic & IA Instantanée</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cliquez sur le lien unique reçu par e-mail ou SMS. Sélectionnez le fichier depuis votre galerie ou prenez la photo directement. Notre IA inspecte la conformité en moins de 2 secondes.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-300 bg-emerald-500/10 p-2.5 rounded-2xl border border-emerald-500/20">
                <FileCheck className="h-4 w-4 text-emerald-400 shrink-0" /> Formats autorisés : PDF, PNG, JPG, WEBP
              </div>
            </div>
          </div>
        </div>

        {/* COMPARISON CARDS: BONNE VS MAUVAISE PHOTO */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-3xl font-black text-white">
              Exemples : Ce qu&apos;il faut faire vs Erreurs fréquentes
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Vérifiez visuellement la qualité de votre cliché avant de cliquer sur valider.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Good Example Card */}
            <div className="bg-slate-900/90 border-2 border-emerald-500/40 p-6 rounded-3xl space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm uppercase tracking-wider">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Photo Parfaite & Conforme
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="h-32 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-emerald-500/30 flex items-center justify-center text-center p-4">
                  <div>
                    <span className="text-emerald-400 font-bold block">✓ Document cadré à 100%</span>
                    <span className="text-[11px] text-slate-400 mt-1 block">Lumière uniforme • Textes nets • Bande MRZ visible</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Aucun reflet lumineux ne masque le texte</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Les 4 bords de la carte sont entièrement visibles</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Mise au point nette et haute résolution</span>
                </li>
              </ul>
            </div>

            {/* Bad Example Card */}
            <div className="bg-slate-900/90 border-2 border-rose-500/40 p-6 rounded-3xl space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-2 text-rose-400 font-extrabold text-sm uppercase tracking-wider">
                <AlertTriangle className="h-5 w-5 text-rose-400" /> Erreurs à Éviter (Refus IA)
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="h-32 rounded-xl bg-gradient-to-br from-slate-900 to-rose-950/40 border border-rose-500/30 flex items-center justify-center text-center p-4">
                  <div>
                    <span className="text-rose-400 font-bold block">✕ Flash agressif / Flou de bougé</span>
                    <span className="text-[11px] text-slate-400 mt-1 block">Coins coupés • Doigt sur le prénom • Document périmé</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2 text-rose-300">
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>Flash direct rendant les chiffres d&apos;identité illisibles</span>
                </li>
                <li className="flex items-center gap-2 text-rose-300">
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>Doigt ou ombre masquant la date de naissance</span>
                </li>
                <li className="flex items-center gap-2 text-rose-300">
                  <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>Justificatif de domicile de plus de 3 mois</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ACCORDION FAQ FOR CLIENTS */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-3xl font-black text-white flex items-center justify-center gap-2">
              <HelpCircle className="h-6 w-6 text-brand-400" /> Foire Aux Questions Clients (FAQ)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Des réponses claires à vos questions lors du dépôt de vos pièces justificatives.
            </p>
          </div>

          <AideFaqAccordion />
        </div>

        {/* SECURITY & TRUST BANNER */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center justify-center md:justify-start gap-1.5">
              <ShieldCheck className="h-4 w-4" /> Protection Totale des Données Personnelles
            </span>
            <h3 className="text-xl font-extrabold text-white">Vos pièces justificatives sont chiffrées</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Vos documents sont exclusivement transmis au professionnel qui vous a sollicité et sont automatiquement détruits à la fin du délai légal de conservation (Conformité RGPD européenne).
            </p>
          </div>

          <Link
            href="/login"
            className="px-6 py-3.5 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl text-xs font-extrabold shadow-xl shadow-brand-500/20 flex items-center gap-2 shrink-0 transition"
          >
            Accès Espace Pro <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
