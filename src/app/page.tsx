'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  ShieldCheck,
  Smartphone,
  Clock,
  Download,
  ArrowRight,
  CheckCircle2,
  Building2,
  Mail,
  Sparkles,
  Lock,
  Bot,
  FileCheck2,
  Search,
  ExternalLink,
  ChevronRight,
  Star,
  Users,
  AlertTriangle,
  FileText,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Award,
  Check,
  Menu,
  X,
  Calculator,
  Briefcase,
  Scale,
  UserCheck,
  Landmark,
  Truck,
  FileCheck,
} from 'lucide-react';
import FylynxLogo from '@/components/FylynxLogo';
import PricingComparisonTable from '@/components/PricingComparisonTable';
import RoiCalculator from '@/components/RoiCalculator';
import { PLANS } from '@/lib/stripe';
import { BLOG_ARTICLES } from '@/lib/blog-data';

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

const BRANDS = [
  'CENTURY 21',
  'FONCIA',
  'ORPI IMMO',
  'DELOITTE',
  'KPMG AUDIT',
  'NEXITY',
  'CABINET MARTIN',
  'BRED BANQUE',
  'INEXTENSO',
  'ELEOM-AVOCATS',
  'K&C CARS'
];

export default function LandingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [dossiersPerMonth, setDossiersPerMonth] = useState(25);

  const activeDoc = SAMPLE_DOCS[selectedDocIndex];

  // Calculated ROI values
  const hoursSaved = Math.round(dossiersPerMonth * 0.8);
  const moneySaved = dossiersPerMonth * 18;

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Structured JSON-LD Schema Markup for SEO
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        'name': 'Fylynx',
        'operatingSystem': 'Web, iOS, Android',
        'applicationCategory': 'BusinessApplication',
        'offers': {
          '@type': 'Offer',
          'price': '29.00',
          'priceCurrency': 'EUR',
        },
        'description':
          'Plateforme SaaS de collecte documentaire automatisée, relances intelligentes et vérification par IA des pièces justificatives B2B.',
      },
      {
        '@type': 'Organization',
        'name': 'Fylynx',
        'url': 'https://fylynx.com',
        'logo': 'https://fylynx.com/fylynx-logo.png',
        'sameAs': [],
      },
      {
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'Comment fonctionne l\'essai gratuit 14 jours de Fylynx ?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Vous créez votre compte en 10 secondes sans saisir de carte bancaire. Vous bénéficiez de 14 jours complets avec relances automatiques et vérification IA.',
            },
          },
          {
            '@type': 'Question',
            'name': 'Mes clients ont-ils besoin de créer un compte pour envoyer leurs pièces ?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Non, zéro friction ! Vos clients reçoivent un lien sécurisé unique qu\'ils peuvent ouvrir depuis leur smartphone pour photographier et déposer leurs justificatifs.',
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Inject Structured SEO JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Top Conversion Bar */}
      <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-emerald-600 px-4 py-2.5 text-center text-xs sm:text-sm font-extrabold text-white shadow-md flex items-center justify-center gap-2 tracking-wide">
        <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
        <span>Offre Spéciale : 14 jours d&apos;essai gratuit offerts sans carte bancaire !</span>
        <Link
          href="/register"
          className="ml-2 underline font-black hover:text-amber-200 transition hidden sm:inline"
        >
          Profiter de l&apos;offre →
        </Link>
      </div>

      {/* Header / Navbar Ultra-Clean */}
      <header className="border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-2xl sticky top-0 z-50 transition-all">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <FylynxLogo size="lg" variant="dark" href="/" />

          {/* Streamlined Nav Links (Only 4 essential items) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#fonctionnalites" className="hover:text-white transition">
              Fonctionnalités
            </a>
            <a href="#demo-ia" className="hover:text-white transition flex items-center gap-1.5">
              <Bot className="h-4 w-4 text-brand-400" />
              Inspection IA
            </a>
            <a href="#tarifs" className="hover:text-white transition">
              Tarifs
            </a>
            <a href="#temoignages" className="hover:text-white transition">
              Avis Clients
            </a>
          </nav>

          {/* CTA Header Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-white transition"
            >
              Se Connecter
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 rounded-xl transition shadow-lg shadow-brand-500/25 flex items-center gap-2 glow-brand hover:scale-105"
            >
              Essai Gratuit 14j <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-950 p-6 space-y-4 animate-in slide-in-from-top-4">
            <nav className="flex flex-col space-y-3 text-sm font-bold text-slate-300">
              <a
                href="#fonctionnalites"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-900"
              >
                Fonctionnalités
              </a>
              <a
                href="#demo-ia"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-900 flex items-center gap-2"
              >
                <Bot className="h-4 w-4 text-brand-400" /> Inspection IA
              </a>
              <a
                href="#tarifs"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-900"
              >
                Tarifs
              </a>
              <a
                href="#temoignages"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-900"
              >
                Avis Clients
              </a>
            </nav>
            <div className="pt-4 border-t border-slate-900 flex flex-col gap-3">
              <Link
                href="/login"
                className="w-full py-3 text-center rounded-xl bg-slate-900 text-sm font-bold text-slate-200 border border-slate-800"
              >
                Se Connecter
              </Link>
              <Link
                href="/register"
                className="w-full py-3.5 text-center rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-extrabold text-sm shadow-xl shadow-brand-500/25"
              >
                Démarrer l&apos;essai gratuit 14j →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Ambient Glow Lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[110px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 text-brand-300 text-xs font-bold mb-8 shadow-inner animate-pulse-subtle">
          <Bot className="h-4 w-4 text-brand-400" />
          <span>Vérification & Certification Documentaire par l&apos;IA Fylynx v2.5</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
            100% Automatique
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.12] max-w-5xl mx-auto">
          Collectez et certifiez vos dossiers clients{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-emerald-400">
            sans relancer manuellement.
          </span>
        </h1>

        <p className="mt-8 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Pour les agences immobilières, bailleurs, banquiers et cabinets comptables. Envoyez un{' '}
          <strong className="text-white font-semibold">lien unique de dépôt sécurisé</strong>. Vos clients prennent en photo leurs pièces sur leur smartphone. L&apos;IA Fylynx analyse la conformité et relance automatiquement.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-500 via-brand-600 to-indigo-600 hover:brightness-110 text-white rounded-2xl font-extrabold text-base shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2 transition glow-brand hover:scale-105"
          >
            Créer un Dossier de Test Gratuit <ArrowRight className="h-5 w-5" />
          </Link>
          <a
            href="#demo-ia"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition backdrop-blur-md"
          >
            Voir la Démo IA <Bot className="h-5 w-5 text-brand-400" />
          </a>
        </div>

        {/* Key Metrics / Reassurance Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md hover:border-brand-500/50 transition">
            <div className="text-2xl font-black text-white">+150 000</div>
            <div className="text-xs text-slate-400 mt-1">Pièces justificatives vérifiées</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md hover:border-emerald-500/50 transition">
            <div className="text-2xl font-black text-emerald-400">99.4%</div>
            <div className="text-xs text-slate-400 mt-1">Taux de précision de l&apos;IA</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md hover:border-brand-400/50 transition">
            <div className="text-2xl font-black text-brand-400">-80%</div>
            <div className="text-xs text-slate-400 mt-1">De temps passé sur les relances</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md hover:border-indigo-400/50 transition">
            <div className="text-2xl font-black text-indigo-400">100% RGPD</div>
            <div className="text-xs text-slate-400 mt-1">Stockage France & UE certifié</div>
          </div>
        </div>
      </section>

      {/* INFINITE HORIZONTAL MARQUEE FOR BRANDS ("Ils font confiance à Fylynx") */}
      <section className="border-y border-slate-900 bg-slate-950/80 py-10 relative overflow-hidden">
        {/* Left & Right Gradient Masks */}
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 text-center mb-6">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
            Ils font confiance à Fylynx pour leurs collectes documentaires
          </p>
        </div>

        {/* Continuous Marquee Wrapper (Guaranteed Single Line) */}
        <div className="flex flex-row flex-nowrap overflow-hidden select-none py-2 gap-6 w-full">
          <div className="animate-marquee flex flex-row flex-nowrap shrink-0 items-center gap-6">
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <div
                key={`b1-${i}`}
                className="px-5 py-3 bg-slate-900/80 border border-slate-800 hover:border-brand-500/50 rounded-2xl font-extrabold text-xs text-slate-300 tracking-wider whitespace-nowrap shadow-sm hover:text-white transition-colors duration-300 flex items-center gap-2 shrink-0"
              >
                <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
                {brand}
              </div>
            ))}
          </div>
          <div className="animate-marquee flex flex-row flex-nowrap shrink-0 items-center gap-6" aria-hidden="true">
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <div
                key={`b2-${i}`}
                className="px-5 py-3 bg-slate-900/80 border border-slate-800 hover:border-brand-500/50 rounded-2xl font-extrabold text-xs text-slate-300 tracking-wider whitespace-nowrap shadow-sm hover:text-white transition-colors duration-300 flex items-center gap-2 shrink-0"
              >
                <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE ROI & SAVINGS CALCULATOR */}
      <RoiCalculator />

      {/* Interactive AI Verification Demo Section */}
      <section id="demo-ia" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-bold mb-4">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Démo Interactive en Direct</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Détection instantanée et zéro document invalide.
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Cliquez ci-dessous pour tester l&apos;inspection en direct de l&apos;IA Fylynx sur différents types de pièces justificatives.
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
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" /> Moteur IA Actif
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
                <p>
                  ⚡ <strong className="text-white">Validation en 3 secondes :</strong> Si le client transmet une mauvaise pièce, l&apos;IA rejette automatiquement le document avec une explication claire et l&apos;invite à soumettre la bonne pièce.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI SAVINGS CALCULATOR SECTION (HIGH CRO CONVERSION) */}
      <section className="py-20 bg-slate-900/60 border-y border-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-4">
              <Calculator className="h-4 w-4 text-emerald-400" />
              <span>Calculateur de Rentabilité Immédiate</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Calculez vos économies de temps et d&apos;argent.
            </h2>
            <p className="mt-3 text-slate-400 text-sm max-w-xl mx-auto">
              Ajustez votre nombre de dossiers traités chaque mois pour estimer le temps de relances supprimé.
            </p>
          </div>

          <div className="p-8 bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl space-y-8 text-left max-w-3xl mx-auto">
            {/* Interactive Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="text-slate-300">Nombre de dossiers clients / mois :</span>
                <span className="text-2xl font-black text-brand-400 bg-brand-500/10 border border-brand-500/30 px-4 py-1 rounded-xl">
                  {dossiersPerMonth} dossiers
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={150}
                step={5}
                value={dossiersPerMonth}
                onChange={(e) => setDossiersPerMonth(Number(e.target.value))}
                className="w-full h-3 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>5 dossiers</span>
                <span>50 dossiers</span>
                <span>150 dossiers</span>
              </div>
            </div>

            {/* Calculated Output Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-center space-y-1">
                <span className="text-3xl font-black text-emerald-400">{hoursSaved}h</span>
                <span className="text-xs text-slate-400 font-bold block">Économisées / mois</span>
              </div>
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-center space-y-1">
                <span className="text-3xl font-black text-brand-400">{moneySaved} €</span>
                <span className="text-xs text-slate-400 font-bold block">Valeur temps / mois</span>
              </div>
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-center space-y-1">
                <span className="text-3xl font-black text-indigo-400">100%</span>
                <span className="text-xs text-slate-400 font-bold block">Relances automatisées</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-extrabold text-xs rounded-2xl shadow-xl transition"
              >
                Économiser {hoursSaved} heures dès ce mois-ci — Essai Gratuit 14j →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vue Client Mobile Section */}
      <section id="vue-client" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Smartphone className="h-4 w-4 text-emerald-400" />
              <span>Expérience Client Smartphone Zéro Friction</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Vos clients déposent leurs pièces en 30 secondes sans aucun mot de passe.
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Plus besoin d&apos;application à installer ou de compte à créer. Le client reçoit un lien sécurisé par e-mail ou lien direct, photographie ses documents avec son smartphone et obtient une validation instantanée.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Lien unique sécurisé</h4>
                  <p className="text-xs text-slate-400">Accès direct sans mot de passe ou code complexe.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Dépôt photo instantané</h4>
                  <p className="text-xs text-slate-400">Prise de vue depuis l&apos;appareil photo ou import de PDF.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Validation immédiate</h4>
                  <p className="text-xs text-slate-400">L&apos;IA certifie la pièce ou demande un correctif bien guidé.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Smartphone UI Mockup */}
          <div className="mx-auto max-w-sm w-full bg-slate-900 border-4 border-slate-800 rounded-[40px] p-6 shadow-2xl relative overflow-hidden hover:border-slate-700 transition">
            <div className="w-32 h-4 bg-slate-800 rounded-full mx-auto mb-6" />
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
                <FylynxLogo size="sm" variant="dark" />
                <div>
                  <h5 className="font-bold text-white text-xs">Dépôt de pièces pour Agence Martin</h5>
                  <p className="text-[10px] text-slate-400">Dossier : Location Appartement Paris 15</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-white">1. Pièce d&apos;Identité</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Validé par IA
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">CNI_Marc_Martin_2026.pdf (1.2 MB)</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-brand-500/50 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-white">2. Justificatif de domicile</span>
                  <span className="text-brand-400 font-bold">En attente</span>
                </div>
                <div className="p-3 border-2 border-dashed border-slate-800 hover:border-brand-500 rounded-xl text-center cursor-pointer transition">
                  <Smartphone className="h-5 w-5 text-slate-500 mx-auto mb-1" />
                  <span className="text-[10px] font-bold text-brand-300">Prendre une photo de ma facture</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="fonctionnalites" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-950">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-bold">
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Fonctionnalités Clés</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Tout ce dont vous avez besoin pour vos dossiers.
          </h2>
          <p className="text-slate-400 text-base">
            Une suite d&apos;outils conçue pour automatiser la relance et fiabiliser la conformité documentaire.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 transition duration-300 space-y-4 hover:-translate-y-1 shadow-xl">
            <div className="h-12 w-12 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center font-bold">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Relances Automatiques</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Programmez le rythme de vos relances par e-mail. Le système s&apos;arrête automatiquement dès que le dossier est 100% complété.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition duration-300 space-y-4 hover:-translate-y-1 shadow-xl">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
              <Bot className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Contrôle IA Anti-Erreur</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Détecte les pièces d&apos;identité expirées, les mauvais types de fichiers et les documents flous pour éliminer les retards.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition duration-300 space-y-4 hover:-translate-y-1 shadow-xl">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold">
              <Download className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Export ZIP en 1 Clic</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Téléchargez l&apos;intégralité des pièces d&apos;un dossier client en une seule archive ZIP bien organisée et nommée.
            </p>
          </div>
        </div>
      </section>

      {/* 5-STEP WORKFLOW SECTION (INSPIRED BY SUPERDOCU) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-bold">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Processus Simplicité & Automatisation</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Un fonctionnement simple en 5 étapes.
          </h2>
          <p className="text-slate-400 text-base">
            Dites adieu aux e-mails sans fin et aux fichiers perdus. Automatisez une fois, gardez vos dossiers à jour pour toujours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-brand-500/50 transition space-y-3">
            <div className="text-3xl font-black text-brand-400 font-mono">01</div>
            <h3 className="text-sm font-extrabold text-white">Créez votre séquence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Construisez des demandes de pièces personnalisées avec nos modèles simples et adaptés à votre métier.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-brand-500/50 transition space-y-3">
            <div className="text-3xl font-black text-brand-400 font-mono">02</div>
            <h3 className="text-sm font-extrabold text-white">Invitez vos contacts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Envoyez des liens de demande personnalisés par e-mail ou SMS, aux couleurs de votre entreprise.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-brand-500/50 transition space-y-3">
            <div className="text-3xl font-black text-brand-400 font-mono">03</div>
            <h3 className="text-sm font-extrabold text-white">Dépôt par le client</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interface smartphone intuitive : vos clients prennent en photo et envoient facilement leurs justificatifs.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-brand-500/50 transition space-y-3">
            <div className="text-3xl font-black text-brand-400 font-mono">04</div>
            <h3 className="text-sm font-extrabold text-white">Automatisez les relances</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              S&apos;il manque quelque chose, nos relances automatiques par e-mail et SMS prennent le relais.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 transition space-y-3 bg-gradient-to-b from-emerald-950/20 to-slate-900/70">
            <div className="text-3xl font-black text-emerald-400 font-mono">05</div>
            <h3 className="text-sm font-extrabold text-white">Validez par IA & suivez</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Validez chaque pièce avec le contrôle IA temps réel et téléchargez votre dossier ZIP complet.
            </p>
          </div>
        </div>
      </section>

      {/* SECTORS OF ACTIVITY GRID */}
      <section className="py-24 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-bold">
              <Building2 className="h-4 w-4 text-brand-400" />
              <span>Adapté à Tous les Secteurs</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Pour tous les secteurs d&apos;activité.
            </h2>
            <p className="text-slate-400 text-base">
              Fylynx s&apos;adapte à vos exigences métier. Utilisez nos modèles ou créez vos propres processus de collecte.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 transition space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">Immobilier & Gestion Locative</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simplifiez les dossiers de location, mandats de vente, pièces de garants et gestion documentaire.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 transition space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                <Scale className="h-5 w-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">Juridique & Avocats</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gérez les pièces clients, mandats et documents sensibles en toute conformité RGPD et chiffrement militaire.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 transition space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <UserCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">RH & Recrutement</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Centralisez CV, diplômes, cartes d&apos;identité et pièces d&apos;onboarding sans relancer manuellement.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 transition space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <Landmark className="h-5 w-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">Courtiers & Banques</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Récupérez tous les documents nécessaires à la demande de prêt (avis d&apos;imposition, fiches de paie).
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 transition space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                <Briefcase className="h-5 w-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">Comptabilité & Finance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Collectez automatiquement les factures manquantes, relevés et pièces comptables de fin d&apos;exercice.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 transition space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                <Truck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">Transport & BTP</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gagnez du temps sur la collecte des permis de conduire, cartes grises, attestations de sécurité et Kbis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="tarifs" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-400">
            Tarifs Transparents & Sans Engagement
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Des formules adaptées à votre volume.
          </h2>
          <p className="text-slate-400 text-base">
            Commencez par 14 jours d&apos;essai offert sans carte bancaire sur la formule Starter.
          </p>
        </div>

        {/* Monthly / Annual Billing Toggle Button */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={`text-xs font-bold transition ${!isAnnual ? 'text-white font-extrabold scale-105' : 'text-slate-400'}`}>
            Facturation Mensuelle
          </span>

          <button
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-16 h-9 rounded-full bg-slate-800 p-1 border border-slate-700 transition-colors duration-300 focus:outline-none"
            aria-label="Basculer facturation annuelle"
          >
            <div
              className={`w-7 h-7 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-md transform transition-transform duration-300 ${
                isAnnual ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold transition ${isAnnual ? 'text-emerald-400 font-extrabold scale-105' : 'text-slate-400'}`}>
              Facturation Annuelle
            </span>
            <span className="px-2.5 py-1 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black rounded-full animate-pulse shadow-sm shadow-emerald-500/10">
              🔥 -20% de réduction (1 seul paiement par an)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {/* Starter Plan */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl space-y-6 flex flex-col justify-between hover:border-slate-700 transition">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Starter</span>
                <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-full">
                  🚀 14j d&apos;essai offert
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  {isAnnual ? `${PLANS.STARTER.priceAnnualMonthly} €` : `${PLANS.STARTER.priceMonthly} €`}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ mois</span>
              </div>
              <p className="text-xs text-brand-400 font-bold mt-1">
                {isAnnual
                  ? `Facturé ${PLANS.STARTER.priceAnnualTotal} € par an en 1 seul paiement (-20%)`
                  : "14 jours d'essai sans carte bancaire"}
              </p>

              <ul className="mt-8 space-y-3 text-xs text-slate-300">
                {PLANS.STARTER.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-3.5 rounded-2xl text-xs font-extrabold text-white bg-brand-600 hover:bg-brand-500 text-center shadow-lg shadow-brand-500/20 transition block"
            >
              Tester Starter (14j gratuits) →
            </Link>
          </div>

          {/* Pro Plan (Highlighted Most Popular) */}
          <div className="p-6 rounded-3xl border-2 border-emerald-400 bg-slate-900/90 backdrop-blur-xl space-y-6 flex flex-col justify-between relative shadow-2xl shadow-emerald-500/10 transition">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-full shadow-md whitespace-nowrap">
              🏆 LE PLUS POPULAIRE
            </div>

            <div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Pro Illimité</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold rounded-full">
                  Portails Illimités
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  {isAnnual ? `${PLANS.PRO.priceAnnualMonthly} €` : `${PLANS.PRO.priceMonthly} €`}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ mois</span>
              </div>
              <p className="text-xs text-emerald-400 font-semibold mt-1">
                {isAnnual
                  ? `Facturé ${PLANS.PRO.priceAnnualTotal} € par an en 1 seul paiement (-20%)`
                  : 'Logo personnalisé + Relances automatiques'}
              </p>

              <ul className="mt-8 space-y-3 text-xs text-slate-200">
                {PLANS.PRO.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-4 rounded-2xl text-xs font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 text-center shadow-xl shadow-emerald-500/20 transition block"
            >
              Passer à Pro Illimité ({isAnnual ? `${PLANS.PRO.priceAnnualMonthly} €/mois` : `${PLANS.PRO.priceMonthly} €/mois`}) →
            </Link>
          </div>

          {/* AI Enterprise Plan */}
          <div className="p-6 rounded-3xl border border-indigo-900/80 bg-gradient-to-b from-indigo-950/90 to-slate-900/90 backdrop-blur-xl space-y-6 flex flex-col justify-between hover:border-indigo-700 transition">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                  <Bot className="h-4 w-4 text-indigo-400" /> IA Enterprise
                </span>
                <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold rounded-full">
                  IA Inclus
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  {isAnnual ? `${PLANS.AI_ENTERPRISE.priceAnnualMonthly} €` : `${PLANS.AI_ENTERPRISE.priceMonthly} €`}
                </span>
                <span className="text-xs text-indigo-300 font-medium">/ mois</span>
              </div>
              <p className="text-xs text-indigo-300 font-bold mt-1">
                {isAnnual
                  ? `Facturé ${PLANS.AI_ENTERPRISE.priceAnnualTotal} € par an en 1 seul paiement (-20%)`
                  : 'Vérification Automatique par IA de tous les documents'}
              </p>

              <ul className="mt-8 space-y-3 text-xs text-slate-200">
                {PLANS.AI_ENTERPRISE.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-3.5 rounded-2xl text-xs font-extrabold text-white bg-indigo-500 hover:bg-indigo-400 text-center shadow-lg shadow-indigo-500/30 transition block"
            >
              Activer IA Enterprise ({isAnnual ? `${PLANS.AI_ENTERPRISE.priceAnnualMonthly} €/mois` : `${PLANS.AI_ENTERPRISE.priceMonthly} €/mois`}) →
            </Link>
          </div>

          {/* Agence Scale Plan (FAR RIGHT / LAST CARD - HIGH CONVERTING) */}
          <div className="p-6 rounded-3xl border-2 border-cyan-400 bg-gradient-to-b from-cyan-950 via-slate-900 to-slate-950 backdrop-blur-xl space-y-6 flex flex-col justify-between relative shadow-2xl shadow-cyan-500/20 hover:scale-[1.02] transition">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg whitespace-nowrap animate-pulse">
              🏆 OFFRE ULTIME & INTÉGRATIONS
            </div>

            <div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-cyan-400" /> Agence Scale
                </span>
                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold rounded-full">
                  300 contacts / mois
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white tracking-tight">
                  {isAnnual ? `${PLANS.AGENCY_SCALE.priceAnnualMonthly} €` : `${PLANS.AGENCY_SCALE.priceMonthly} €`}
                </span>
                <span className="text-xs text-cyan-300 font-medium">/ mois</span>
              </div>
              <p className="text-xs text-cyan-300 font-bold mt-1">
                {isAnnual
                  ? `Facturé ${PLANS.AGENCY_SCALE.priceAnnualTotal} € par an (-20%)`
                  : '0,82 € / contact • Webhooks, API & 20 utilisateurs'}
              </p>

              <ul className="mt-8 space-y-3 text-xs text-slate-200">
                {PLANS.AGENCY_SCALE.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                    <span className={f.includes('Intégration') ? 'font-black text-cyan-200 underline decoration-cyan-400/50' : ''}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/register"
              className="w-full py-4 rounded-2xl text-xs font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-center shadow-xl shadow-cyan-500/30 transition block transform hover:scale-[1.02]"
            >
              Démarrer Agence Scale ({isAnnual ? `${PLANS.AGENCY_SCALE.priceAnnualMonthly} €/mois` : `${PLANS.AGENCY_SCALE.priceMonthly} €`}) →
            </Link>
          </div>
        </div>

        {/* Complete Feature Comparison Table */}
        <PricingComparisonTable isAnnual={isAnnual} />
      </section>

      {/* Testimonials Section */}
      <section id="temoignages" className="py-24 bg-slate-950/60 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-400">
              Retours d&apos;Expérience
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Ce que disent nos professionnels.
            </h2>
            <p className="text-slate-400 text-base">
              Agences immobilières, bailleurs et cabinets comptables partagent leur avis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                « Avant Fylynx, nous devions passer 15 minutes par dossier à relancer les clients pour un avis d&apos;imposition manquant. Désormais, le lien s&apos;occupe de tout et nos dossiers locataires sont validés 4 fois plus vite. »
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">Marc L.</span>
                  <span className="text-slate-400 text-[11px]">Directeur d&apos;Agence Immobilier Paris</span>
                </div>
                <span className="px-2 py-0.5 bg-brand-500/10 text-brand-400 border border-brand-500/30 text-[10px] font-bold rounded-md">
                  Vérifié
                </span>
              </div>
            </div>

            <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                « La vérification IA des pièces d&apos;identité et des avis d&apos;imposition est impressionnante. Elle a détecté immédiatement une CNI expirée qu&apos;un gestionnaire aurait pu manquer. Un gain de sécurité énorme ! »
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">Sophie D.</span>
                  <span className="text-slate-400 text-[11px]">Gestionnaire de Patrimoine</span>
                </div>
                <span className="px-2 py-0.5 bg-brand-500/10 text-brand-400 border border-brand-500/30 text-[10px] font-bold rounded-md">
                  Vérifié
                </span>
              </div>
            </div>

            <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                « Pouvoir afficher notre propre logo d&apos;entreprise sur les liens de dépôt rassure énormément nos clients. Le taux d&apos;abandon de dossier est tombé à zéro. »
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">Alexandre B.</span>
                  <span className="text-slate-400 text-[11px]">Expert-Comptable Associé</span>
                </div>
                <span className="px-2 py-0.5 bg-brand-500/10 text-brand-400 border border-brand-500/30 text-[10px] font-bold rounded-md">
                  Vérifié
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Articles & Resources Section */}
      <section id="blog-preview" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-400 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" /> Centre de Ressources & Guides SEO
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Derniers articles & conseils d'experts
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-brand-400 hover:text-brand-300 transition group"
          >
            Voir tous nos guides & articles <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_ARTICLES.slice(0, 3).map((art) => (
            <article
              key={art.slug}
              className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-brand-500/50 transition flex flex-col justify-between space-y-4 group backdrop-blur-xl hover:-translate-y-1"
            >
              <div className="space-y-3">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-brand-300 border border-slate-700 text-[10px] font-bold">
                  {art.category}
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors leading-snug">
                  <Link href={`/blog/${art.slug}`}>
                    {art.title}
                  </Link>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {art.description}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[11px]">{art.readTime}</span>
                <Link href={`/blog/${art.slug}`} className="text-brand-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Lire l'article <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-400">
            Questions Fréquentes
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Tout ce que vous devez savoir.
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'Comment fonctionne l\'essai gratuit 14 jours de Fylynx ?',
              a: 'Vous créez votre compte professionnel en 10 secondes sans saisir de carte bancaire. Vous disposez de 14 jours complets pour envoyer des liens de dépôt, tester les relances automatiques et la vérification IA.',
            },
            {
              q: 'Mes clients doivent-ils créer un compte ou installer une application ?',
              a: 'Non, zéro friction ! Vos clients ouvrent votre lien sécurisé directement sur leur navigateur smartphone ou ordinateur, photographient leurs pièces et valident en 30 secondes.',
            },
            {
              q: 'Où sont stockées les pièces justificatives et les données ?',
              a: 'Toutes les données et les fichiers déposés sont chiffrés en AES-256 et hébergés sur des serveurs sécurisés situés en France et dans l\'Union Européenne, conformes aux exigences du RGPD.',
            },
            {
              q: 'Puis-je personnaliser les liens avec le logo et les couleurs de mon cabinet ?',
              a: 'Oui ! À partir de la formule Pro Illimité (79€/mois), vous pouvez téléverser votre propre logo d\'entreprise et choisir vos couleurs de marque pour les afficher sur tous vos liens clients.',
            },
            {
              q: 'Comment fonctionne l\'export ZIP des dossiers ?',
              a: 'En 1 seul clic depuis votre dashboard, vous pouvez télécharger l\'intégralité des pièces validées d\'un dossier sous la forme d\'un fichier ZIP structuré et bien nommé.',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-sm transition"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-5 text-left font-bold text-sm text-white flex items-center justify-between gap-4 hover:bg-slate-800/50 transition"
              >
                <span>{item.q}</span>
                <ChevronRight
                  className={`h-5 w-5 text-brand-400 transition-transform ${
                    activeFaq === index ? 'rotate-90' : ''
                  }`}
                />
              </button>
              {activeFaq === index && (
                <div className="p-5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 border border-brand-500/40 rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Prêt à éliminer définitivement les relances manuelles de vos dossiers ?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Rejoignez des centaines de professionnels et créez votre premier dossier en moins d&apos;une minute.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-500 to-indigo-600 hover:brightness-110 text-white font-extrabold text-sm rounded-2xl shadow-xl transition glow-brand hover:scale-105"
            >
              Démarrer mon Essai Gratuit 14 Jours →
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-4 bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white font-bold text-sm rounded-2xl transition"
            >
              Déjà un compte ? Connexion
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Bottom Sticky Bar for Mobile Conversion */}
      <div className="sm:hidden fixed bottom-3 left-3 right-3 z-40 p-3 bg-slate-900/95 border border-brand-500/40 rounded-2xl backdrop-blur-xl shadow-2xl flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase font-bold text-emerald-400 block">Essai 14j offert</span>
          <span className="text-xs font-black text-white">Créer mon compte</span>
        </div>
        <Link
          href="/register"
          className="px-4 py-2 bg-brand-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shrink-0"
        >
          Tester Gratuitement →
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <FylynxLogo size="sm" variant="dark" />
            <span className="text-slate-500 font-mono text-[11px]">
              © {new Date().getFullYear()} fylinx.com — Solution Sécurisée RGPD B2B.
            </span>
          </div>

          <div className="flex items-center gap-6 text-slate-400 font-semibold text-[11px]">
            <a href="#fonctionnalites" className="hover:text-white transition">
              Fonctionnalités
            </a>
            <a href="#tarifs" className="hover:text-white transition">
              Tarifs
            </a>
            <Link href="/blog" className="hover:text-white transition">
              Blog & Guide SEO
            </Link>
            <Link href="/aide" className="hover:text-white transition">
              Centre d'aide
            </Link>
            <Link href="/login" className="hover:text-white transition">
              Connexion
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
