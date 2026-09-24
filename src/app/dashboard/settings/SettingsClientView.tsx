'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import PricingComparisonTable from '@/components/PricingComparisonTable';
import { PLANS } from '@/lib/stripe';
import {
  ShieldCheck,
  Zap,
  CreditCard,
  CheckCircle2,
  Building2,
  Bot,
  Loader2,
  HardDrive,
  Check,
  Palette,
  Image as ImageIcon,
  Lock,
  Sparkles,
  Save,
  Eye,
  AlertCircle,
  UploadCloud,
  Trash2,
  Link as LinkIcon,
  Users,
  UserPlus,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const COLOR_PALETTES = [
  { name: 'Indigo Fylynx', hex: '#4f46e5' },
  { name: 'Bleu Royal', hex: '#2563eb' },
  { name: 'Émeraude Pro', hex: '#059669' },
  { name: 'Violet Premium', hex: '#7c3aed' },
  { name: 'Ambre Doré', hex: '#d97706' },
  { name: 'Rose Intense', hex: '#e11d48' },
  { name: 'Noir Élégant', hex: '#09090b' },
];

export default function SettingsClientView({
  user,
}: {
  user: {
    name: string;
    email: string;
    companyName: string | null;
    subscriptionStatus: string;
    role?: string;
    companyLogo?: string | null;
    customWelcomeMsg?: string | null;
    brandColor?: string | null;
  };
}) {
  const searchParams = useSearchParams();
  const isGoogleConnected = searchParams.get('google_drive') === 'connected';

  const [currentPlan, setCurrentPlan] = useState(user.subscriptionStatus || 'STARTER');
  const [isAnnual, setIsAnnual] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Branding states
  const [companyLogo, setCompanyLogo] = useState(user.companyLogo || '');
  const [customWelcomeMsg, setCustomWelcomeMsg] = useState(
    user.customWelcomeMsg || 'Bienvenue sur notre portail sécurisé. Merci de déposer vos pièces justificatives ci-dessous.'
  );
  const [brandColor, setBrandColor] = useState(user.brandColor || '#4f46e5');
  const [isSavingBranding, setIsSavingBranding] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [brandingStatus, setBrandingStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const logoFileInputRef = useRef<HTMLInputElement | null>(null);

  // Team management states
  const [teamMembers, setTeamMembers] = useState<Array<{ id: string; name: string; email: string; role: string; createdAt: string }>>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [teamStatus, setTeamStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchTeamMembers = async () => {
    try {
      const res = await fetch('/api/user/team');
      if (res.ok) {
        const data = await res.json();
        setTeamMembers(data.teamMembers || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch team on mount
  useState(() => {
    fetchTeamMembers();
  });

  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;

    setIsAddingMember(true);
    setTeamStatus(null);

    try {
      const res = await fetch('/api/user/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newMemberName, email: newMemberEmail }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'ajout');
      }

      setTeamStatus({ type: 'success', message: data.message });
      setNewMemberName('');
      setNewMemberEmail('');
      fetchTeamMembers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue';
      setTeamStatus({ type: 'error', message: msg });
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleRemoveTeamMember = async (id: string) => {
    if (!confirm('Voulez-vous vraiment retirer ce collaborateur de votre équipe ?')) return;

    try {
      const res = await fetch(`/api/user/team?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTeamMembers((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isAdmin = user.role === 'ADMIN';
  const canUseBranding = currentPlan === 'PRO' || currentPlan === 'AGENCY_SCALE' || currentPlan === 'AI_ENTERPRISE' || isAdmin;

  const handleSubscribe = async (plan: 'STARTER' | 'PRO' | 'AGENCY_SCALE' | 'AI_ENTERPRISE') => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, billingPeriod: isAnnual ? 'annual' : 'monthly' }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePortal = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    setBrandingStatus(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload/logo', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors du téléchargement du logo');
      }

      setCompanyLogo(data.logoUrl);
      setBrandingStatus({
        type: 'success',
        message: 'Logo d\'entreprise téléversé avec succès ! Pensez à cliquer sur "Enregistrer la personnalisation".',
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors du téléversement';
      setBrandingStatus({
        type: 'error',
        message: errorMsg,
      });
    } finally {
      setIsUploadingLogo(false);
      // Reset input value so re-selecting same file triggers onChange
      if (logoFileInputRef.current) {
        logoFileInputRef.current.value = '';
      }
    }
  };

  const handleSaveBranding = async () => {
    setIsSavingBranding(true);
    setBrandingStatus(null);
    try {
      const res = await fetch('/api/user/branding', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyLogo,
          customWelcomeMsg,
          brandColor,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }

      setBrandingStatus({
        type: 'success',
        message: 'Logo et personnalisation enregistrés avec succès ! Vos liens clients sont à jour.',
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue';
      setBrandingStatus({
        type: 'error',
        message: errorMsg,
      });
    } finally {
      setIsSavingBranding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Espace Sécurisé & RGPD Conforme
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Abonnement & Paramètres du Compte
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Gérez votre formule d&apos;abonnement, vos paramètres de marque et votre facturation Stripe
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-2xl text-emerald-400 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Stockage Souverain & Chiffrement RGPD AES-256
          </div>
        </div>

        {/* Google Drive Connection Banner - STRICTLY FOR ADMIN USERS ONLY */}
        {isAdmin && (
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-500/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold shrink-0 shadow-lg shadow-brand-500/30">
                <HardDrive className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-md">
                    Réservé Administrateur HQ
                  </span>
                  <h3 className="font-extrabold text-base text-white">Stockage Google Drive Master (5 To)</h3>
                  {isGoogleConnected ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                      <Check className="h-3 w-3 text-emerald-400" /> Connecté
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                      1 Clic requis pour lier votre Drive Master
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Dossier d&apos;archivage cible : <strong className="text-brand-300 font-mono">fylynx (1ppYNq0gbcyrInPmO_acuZUW8dRWUPh-W)</strong>
                </p>
              </div>
            </div>

            <a
              href="/api/auth/google-drive"
              className="px-5 py-3 bg-brand-500 hover:bg-brand-400 text-slate-950 font-extrabold text-xs rounded-2xl shadow-lg transition text-center shrink-0 flex items-center justify-center gap-2"
            >
              <HardDrive className="h-4 w-4" />
              {isGoogleConnected ? 'Google Drive Connecté (Re-synchroniser)' : 'Connecter Google Drive Master (1 Clic)'}
            </a>
          </div>
        )}

        {/* User Profile Card */}
        <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-4 max-w-3xl">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-brand-400" /> Profil Entreprise & Identité
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Nom du contact</span>
              <p className="font-bold text-slate-100">{user.name}</p>
            </div>
            <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Raison Sociale</span>
              <p className="font-bold text-slate-100">{user.companyName || 'Non renseignée'}</p>
            </div>
            <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Email compte</span>
              <p className="font-bold text-slate-100">{user.email}</p>
            </div>
            <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Formule Active</span>
              <p className="font-extrabold text-emerald-400 flex items-center gap-1.5">
                <Zap className="h-4 w-4 fill-emerald-400" /> Formule {currentPlan} Active
              </p>
            </div>
          </div>
        </div>

        {/* TEAM & COLLABORATORS MANAGEMENT CARD */}
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-brand-400" /> Gestion de l&apos;Équipe & Collaborateurs
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-extrabold">
                  {currentPlan === 'STARTER'
                    ? '1 / 1 Utilisateur inclus'
                    : currentPlan === 'PRO'
                    ? `${teamMembers.length + 1} / 5 Utilisateurs inclus`
                    : `${teamMembers.length + 1} Utilisateurs (Collaborateurs ILLIMITÉS)`}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Invitez des membres de votre équipe (collaborateurs, gestionnaires) pour accéder et gérer vos dossiers clients.
              </p>
            </div>
          </div>

          {teamStatus && (
            <div
              className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
                teamStatus.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {teamStatus.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              )}
              {teamStatus.message}
            </div>
          )}

          {currentPlan === 'STARTER' ? (
            <div className="p-5 bg-slate-950 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                  <Sparkles className="h-4 w-4 fill-amber-400" /> Débloquez jusqu&apos;à 5 collaborateurs
                </div>
                <p className="text-xs text-slate-300">
                  La formule <strong className="text-white">Starter (29€/mois)</strong> inclut 1 utilisateur unique. En passant à <strong className="text-emerald-400">Pro Illimité (79€/mois)</strong>, vous pouvez inviter jusqu&apos;à 5 collaborateurs dans votre équipe.
                </p>
              </div>

              <button
                onClick={() => handleSubscribe('PRO')}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl transition shrink-0 shadow-lg"
              >
                Passer à Pro (79 €/mois) →
              </button>
            </div>
          ) : (
            <form onSubmit={handleAddTeamMember} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Inviter un nouveau collaborateur dans l&apos;équipe
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Nom & Prénom"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
                />
                <input
                  type="email"
                  required
                  placeholder="adresse.email@societe.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  disabled={isAddingMember}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  {isAddingMember ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                  + Inviter le collaborateur
                </button>
              </div>
            </form>
          )}

          {/* List of Team Members */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Membres de l&apos;équipe actifs ({teamMembers.length + 1}) :
            </span>

            {/* Owner Row */}
            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-brand-600 text-white font-black text-xs flex items-center justify-center">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-extrabold text-white flex items-center gap-2">
                    {user.name} <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-mono text-[10px]">Propriétaire</span>
                  </div>
                  <span className="text-slate-400 font-mono">{user.email}</span>
                </div>
              </div>

              <span className="text-[11px] font-extrabold text-emerald-400">Accès Administrateur</span>
            </div>

            {/* Invited Collaborators Rows */}
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-slate-800 text-slate-300 font-black text-xs flex items-center justify-center">
                    {(member.name || member.email).slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-100">{member.name || 'Collaborateur'}</div>
                    <span className="text-slate-400 font-mono">{member.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    Actif
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTeamMember(member.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                    title="Retirer ce collaborateur"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION PERSONNALISATION & MARQUE BLANCHE (PRO ILLIMITÉ + IA ENTERPRISE + ADMIN) */}
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Palette className="h-5 w-5 text-brand-400" /> Personnalisation & Marque Blanche
                </h2>
                {canUseBranding ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-extrabold">
                    ✓ Débloqué (Pro & Enterprise)
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1">
                    <Lock className="h-3 w-3 text-amber-400" /> Dès le Forfait Pro (79€/mois)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Personnalisez vos liens d&apos;invitation avec votre logo d&apos;entreprise (téléversement direct ou lien), vos couleurs et votre message d&apos;accueil.
              </p>
            </div>

            {canUseBranding && (
              <button
                onClick={handleSaveBranding}
                disabled={isSavingBranding}
                className="px-5 py-2.5 bg-brand-500 hover:bg-brand-400 text-slate-950 font-extrabold text-xs rounded-2xl shadow-lg transition flex items-center gap-2 shrink-0"
              >
                {isSavingBranding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Enregistrer la personnalisation
              </button>
            )}
          </div>

          {brandingStatus && (
            <div
              className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
                brandingStatus.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {brandingStatus.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              )}
              {brandingStatus.message}
            </div>
          )}

          {!canUseBranding ? (
            /* Locked Teaser for Starter Plan Users */
            <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-amber-500/30 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                    <Sparkles className="h-4 w-4 fill-amber-400" /> Fonctionnalité réservée Pro & Enterprise
                  </div>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    Déposez votre logo d&apos;entreprise et affichez-le directement sur tous vos liens de dépôt
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Sur la formule <strong className="text-white">Starter (29€/mois)</strong>, vos liens restent sous la marque par défaut. En passant à <strong className="text-emerald-400">Pro Illimité (79€/mois)</strong>, vous pouvez téléverser votre logo d&apos;entreprise (PNG, SVG, JPG) et personnaliser entièrement l&apos;expérience visuelle de vos clients.
                  </p>
                </div>

                <button
                  onClick={() => handleSubscribe('PRO')}
                  disabled={isLoading}
                  className="px-6 py-3.5 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-slate-950 font-extrabold text-xs rounded-2xl shadow-xl transition flex items-center justify-center gap-2 shrink-0"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 fill-slate-950" />}
                  Débloquer le Logo & Marque Blanche — Passer à Pro (79 €/mois)
                </button>
              </div>

              {/* Blurred preview mock */}
              <div className="opacity-60 pointer-events-none filter blur-[0.6px] pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 block">Logo personnalisé (Exemple)</span>
                  <div className="h-10 w-32 bg-slate-800 rounded-lg flex items-center justify-center text-xs font-bold text-slate-300">
                    Logo Entreprise
                  </div>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 block">Message d&apos;accueil du lien</span>
                  <p className="text-xs text-slate-300">« Port de dépôt sécurisé cabinet Martin & Associés »</p>
                </div>
              </div>
            </div>
          ) : (
            /* Active Editor for Pro / Enterprise / Admin */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Controls */}
              <div className="lg:col-span-7 space-y-6">
                {/* Logo File Upload & URL Picker */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4 text-brand-400" /> Logo de votre Entreprise (PNG, JPG, SVG, WEBP)
                    </span>
                    <span className="text-[11px] text-slate-400">Fond transparent recommandé (Max 5 Mo)</span>
                  </label>

                  {/* Hidden File Input */}
                  <input
                    ref={logoFileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
                    onChange={handleLogoFileUpload}
                    className="hidden"
                  />

                  {/* Upload Box / Drag Zone */}
                  <div className="p-4 bg-slate-950 border-2 border-dashed border-slate-700/80 rounded-2xl hover:border-brand-500 transition space-y-3">
                    {companyLogo ? (
                      <div className="flex items-center justify-between gap-4 p-2 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-3 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={companyLogo}
                            alt="Logo entreprise"
                            className="h-12 max-w-[140px] object-contain rounded-lg bg-white/10 p-1 shrink-0"
                          />
                          <div className="truncate">
                            <span className="text-xs font-bold text-slate-100 block truncate">Logo configuré</span>
                            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                              ✓ Logo d&apos;entreprise actif &amp; certifié (Google Drive)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => logoFileInputRef.current?.click()}
                            disabled={isUploadingLogo}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1"
                          >
                            {isUploadingLogo ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UploadCloud className="h-3.5 w-3.5" />}
                            Changer
                          </button>
                          <button
                            type="button"
                            onClick={() => setCompanyLogo('')}
                            className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl transition"
                            title="Supprimer le logo"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 space-y-3">
                        <div className="h-12 w-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mx-auto">
                          {isUploadingLogo ? <Loader2 className="h-6 w-6 animate-spin text-brand-400" /> : <UploadCloud className="h-6 w-6" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-200">
                            Déposez ou sélectionnez votre fichier d&apos;image de logo
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Formats acceptés : PNG, JPG, SVG ou WEBP (Fond transparent recommandé)</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => logoFileInputRef.current?.click()}
                          disabled={isUploadingLogo}
                          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition inline-flex items-center gap-2"
                        >
                          {isUploadingLogo ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                          Téléverser mon fichier Logo
                        </button>
                      </div>
                    )}

                    {/* URL Switch Toggle */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="text-slate-400 hover:text-brand-300 flex items-center gap-1 font-semibold transition"
                      >
                        <LinkIcon className="h-3.5 w-3.5" />
                        {showUrlInput ? 'Masquer le champ URL' : 'Ou spécifier une URL externe de logo'}
                      </button>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Démo :</span>
                        <button
                          type="button"
                          onClick={() => setCompanyLogo('https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg')}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded-md text-slate-300 font-medium transition"
                        >
                          Exemple 1
                        </button>
                        <button
                          type="button"
                          onClick={() => setCompanyLogo('https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg')}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded-md text-slate-300 font-medium transition"
                        >
                          Exemple 2
                        </button>
                      </div>
                    </div>

                    {showUrlInput && (
                      <input
                        type="url"
                        value={companyLogo}
                        onChange={(e) => setCompanyLogo(e.target.value)}
                        placeholder="https://votre-entreprise.com/logo.png"
                        className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition"
                      />
                    )}
                  </div>
                </div>

                {/* Custom Welcome Message */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span>Message d&apos;accueil personnalisé pour les clients</span>
                    <span className="text-[11px] text-slate-400">S&apos;affiche en haut du lien</span>
                  </label>
                  <textarea
                    rows={3}
                    value={customWelcomeMsg}
                    onChange={(e) => setCustomWelcomeMsg(e.target.value)}
                    placeholder="Bienvenue sur le portail sécurisé de notre cabinet. Merci de déposer les pièces demandées."
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-2xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition resize-none"
                  />
                </div>

                {/* Brand Accent Color */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span>Couleur principale de marque (Accent des liens)</span>
                    <span className="font-mono text-brand-400">{brandColor}</span>
                  </label>

                  <div className="flex flex-wrap items-center gap-3">
                    {COLOR_PALETTES.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setBrandColor(c.hex)}
                        className={`h-9 px-3 rounded-xl border flex items-center gap-2 text-xs font-semibold transition ${
                          brandColor.toLowerCase() === c.hex.toLowerCase()
                            ? 'border-white bg-slate-800 ring-2 ring-brand-500 text-white'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="h-4 w-4 rounded-full shrink-0 border border-white/20" style={{ backgroundColor: c.hex }} />
                        {c.name}
                      </button>
                    ))}
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="h-9 w-12 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer p-1"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Eye className="h-4 w-4 text-brand-400" /> Aperçu du Lien Client (/d/token)
                  </span>
                  <span className="text-[10px] bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2 py-0.5 rounded-full font-bold">
                    Temps réel
                  </span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
                  {/* Public Link Mock Header */}
                  <div
                    className="p-4 rounded-2xl bg-slate-900/90 border shadow-md space-y-3"
                    style={{ borderColor: brandColor || '#4f46e5' }}
                  >
                    <div className="flex items-center gap-3">
                      {companyLogo ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={companyLogo}
                          alt="Logo entreprise"
                          className="h-10 max-w-[120px] object-contain rounded-lg bg-white/10 p-1"
                          onError={(e) => {
                            // Fallback if URL fails to load
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div
                          className="h-10 w-10 rounded-xl text-white font-bold flex items-center justify-center shadow-md"
                          style={{ backgroundColor: brandColor || '#4f46e5' }}
                        >
                          <Building2 className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: brandColor || '#818cf8' }}>
                          Portail Client Sécurisé
                        </span>
                        <h4 className="text-sm font-extrabold text-white">
                          {user.companyName || user.name || 'Votre Cabinet / Entreprise'}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed italic">
                      « {customWelcomeMsg || 'Bienvenue sur notre portail sécurisé. Veuillez déposer vos pièces ci-dessous.'} »
                    </p>
                  </div>

                  {/* Document Requirement Mock Item */}
                  <div className="p-3.5 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">1. Pièce d&apos;identité (CNI / Passeport)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold">
                        En attente
                      </span>
                    </div>
                    <div
                      className="py-3 border-2 border-dashed rounded-xl flex items-center justify-center text-xs font-bold text-slate-300 gap-2 cursor-pointer transition hover:opacity-90"
                      style={{
                        borderColor: brandColor || '#4f46e5',
                        backgroundColor: `${brandColor}15` || '#4f46e515',
                      }}
                    >
                      <ImageIcon className="h-4 w-4" style={{ color: brandColor || '#818cf8' }} />
                      Déposer le fichier ici
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Subscription Selection */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-brand-400" /> Offres d&apos;Abonnement Stripe
            </h2>

            <button
              onClick={handlePortal}
              disabled={isLoading}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-400" /> : null}
              Accéder au Portail Stripe (Factures & Cartes)
            </button>
          </div>

          {/* Monthly / Annual Billing Switch Toggle */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">Période de facturation</span>
              <span className="text-xs text-slate-400 hidden md:inline">• Économisez 20% en vous engageant sur l&apos;année</span>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold transition ${!isAnnual ? 'text-white font-extrabold' : 'text-slate-400'}`}>
                Mensuel
              </span>

              <button
                type="button"
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative w-14 h-8 rounded-full bg-slate-800 p-1 border border-slate-700 transition-colors duration-300 focus:outline-none"
                aria-label="Basculer facturation annuelle"
              >
                <div
                  className={`w-6 h-6 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-md transform transition-transform duration-300 ${
                    isAnnual ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold transition ${isAnnual ? 'text-emerald-400 font-extrabold' : 'text-slate-400'}`}>
                  Annuel
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black rounded-full animate-pulse">
                  -20% (2 mois offerts)
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Starter Plan Card */}
            <div
              className={`p-6 rounded-3xl border bg-slate-900/80 backdrop-blur-xl space-y-6 flex flex-col justify-between transition-all ${
                currentPlan === 'STARTER' ? 'border-2 border-brand-500 shadow-xl shadow-brand-500/10' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Starter</span>
                  <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-full">
                    🚀 14j d&apos;essai gratuit
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">
                    {isAnnual ? `${PLANS.STARTER.priceAnnualMonthly} €` : `${PLANS.STARTER.priceMonthly} €`}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">/ mois</span>
                </div>
                <p className="text-xs text-brand-400 font-bold mt-1">
                  {isAnnual
                    ? `Facturé ${PLANS.STARTER.priceAnnualTotal} € par an (-20%)`
                    : "14 jours d'essai offert sans CB à l'inscription"}
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  {PLANS.STARTER.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSubscribe('STARTER')}
                disabled={isLoading || currentPlan === 'STARTER'}
                className={`w-full py-3 rounded-2xl text-xs font-bold transition ${
                  currentPlan === 'STARTER'
                    ? 'bg-slate-800/80 text-slate-400 cursor-default border border-slate-700'
                    : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                }`}
              >
                {currentPlan === 'STARTER' ? 'Essai Starter Actif (14j)' : `Sélectionner Starter (${isAnnual ? `${PLANS.STARTER.priceAnnualMonthly} €/mois` : `${PLANS.STARTER.priceMonthly} €/mois`})`}
              </button>
            </div>

            {/* Pro Plan Card */}
            <div
              className={`p-6 rounded-3xl border bg-slate-900/90 backdrop-blur-xl text-white space-y-6 flex flex-col justify-between transition-all ${
                currentPlan === 'PRO' ? 'border-2 border-emerald-400 shadow-xl shadow-emerald-500/20' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Pro Illimité</span>
                  {currentPlan === 'PRO' && (
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-full">
                      Plan Actuel
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">
                    {isAnnual ? `${PLANS.PRO.priceAnnualMonthly} €` : `${PLANS.PRO.priceMonthly} €`}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">/ mois</span>
                </div>
                <p className="text-xs text-emerald-400 font-semibold mt-1">
                  {isAnnual
                    ? `Facturé ${PLANS.PRO.priceAnnualTotal} € par an (-20%)`
                    : 'Logo personnalisé + Relances automatiques incluses'}
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  {PLANS.PRO.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSubscribe('PRO')}
                disabled={isLoading || currentPlan === 'PRO'}
                className={`w-full py-3 rounded-2xl text-xs font-bold transition ${
                  currentPlan === 'PRO'
                    ? 'bg-slate-800 text-slate-400 cursor-default border border-slate-700'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                }`}
              >
                {currentPlan === 'PRO' ? 'Formule Pro Active' : `Passer à Pro (${isAnnual ? `${PLANS.PRO.priceAnnualMonthly} €/mois` : `${PLANS.PRO.priceMonthly} €/mois`})`}
              </button>
            </div>

            {/* AI Enterprise Plan Card */}
            <div
              className={`p-6 rounded-3xl border bg-gradient-to-b from-indigo-950/90 to-slate-900/90 backdrop-blur-xl text-white space-y-6 flex flex-col justify-between transition-all ${
                currentPlan === 'AI_ENTERPRISE' ? 'border-2 border-indigo-400 shadow-2xl shadow-indigo-500/30' : 'border-indigo-900/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                    <Bot className="h-4 w-4 text-indigo-400" /> IA Enterprise
                  </span>
                  {currentPlan === 'AI_ENTERPRISE' && (
                    <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold rounded-full">
                      Plan Actuel
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">
                    {isAnnual ? `${PLANS.AI_ENTERPRISE.priceAnnualMonthly} €` : `${PLANS.AI_ENTERPRISE.priceMonthly} €`}
                  </span>
                  <span className="text-xs text-indigo-300 font-medium">/ mois</span>
                </div>
                <p className="text-xs text-indigo-300 font-bold mt-1">
                  {isAnnual
                    ? `Facturé ${PLANS.AI_ENTERPRISE.priceAnnualTotal} € par an (-20%)`
                    : "Logo d'entreprise + IA de vérification des pièces"}
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-200">
                  {PLANS.AI_ENTERPRISE.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSubscribe('AI_ENTERPRISE')}
                disabled={isLoading || currentPlan === 'AI_ENTERPRISE'}
                className={`w-full py-3 rounded-2xl text-xs font-bold transition ${
                  currentPlan === 'AI_ENTERPRISE'
                    ? 'bg-slate-800 text-slate-400 cursor-default border border-slate-700'
                    : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/30 font-extrabold'
                }`}
              >
                {currentPlan === 'AI_ENTERPRISE' ? 'Formule IA Active' : `Activer IA Enterprise (${isAnnual ? `${PLANS.AI_ENTERPRISE.priceAnnualMonthly} €/mois` : `${PLANS.AI_ENTERPRISE.priceMonthly} €/mois`})`}
              </button>
            </div>

            {/* Agence Scale Plan Card (FAR RIGHT / LAST CARD - HIGH CONVERTING) */}
            <div
              className={`p-6 rounded-3xl border-2 bg-gradient-to-b from-cyan-950 via-slate-900 to-slate-950 backdrop-blur-xl text-white space-y-6 flex flex-col justify-between relative shadow-2xl transition-all hover:scale-[1.02] ${
                currentPlan === 'AGENCY_SCALE'
                  ? 'border-cyan-400 shadow-cyan-500/40'
                  : 'border-cyan-400/80 shadow-cyan-500/20'
              }`}
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg whitespace-nowrap animate-pulse">
                🏆 OFFRE ULTIME & INTÉGRATIONS
              </div>

              <div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-cyan-400" /> Agence Scale
                  </span>
                  {currentPlan === 'AGENCY_SCALE' ? (
                    <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold rounded-full">
                      Plan Actuel
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 text-[10px] font-extrabold rounded-full border border-cyan-500/30">
                      300 contacts / mo
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white tracking-tight">
                    {isAnnual ? `${PLANS.AGENCY_SCALE.priceAnnualMonthly} €` : `${PLANS.AGENCY_SCALE.priceMonthly} €`}
                  </span>
                  <span className="text-xs text-cyan-300 font-medium">/ mois</span>
                </div>
                <p className="text-xs text-cyan-300 font-bold mt-1">
                  {isAnnual
                    ? `Facturé ${PLANS.AGENCY_SCALE.priceAnnualTotal} € par an (-20%)`
                    : "Seulement 0,82 € / contact • Tout inclus"}
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-200">
                  {PLANS.AGENCY_SCALE.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      <span className={f.includes('Intégration') ? 'font-black text-cyan-200 underline decoration-cyan-400/50' : ''}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSubscribe('AGENCY_SCALE')}
                disabled={isLoading || currentPlan === 'AGENCY_SCALE'}
                className={`w-full py-3.5 rounded-2xl text-xs font-black transition ${
                  currentPlan === 'AGENCY_SCALE'
                    ? 'bg-slate-800 text-slate-400 cursor-default border border-slate-700'
                    : 'bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-xl shadow-cyan-500/30 font-black tracking-wide transform hover:scale-[1.02]'
                }`}
              >
                {currentPlan === 'AGENCY_SCALE' ? 'Formule Scale Active' : `Passer à Agence Scale (${isAnnual ? `${PLANS.AGENCY_SCALE.priceAnnualMonthly} €/mois` : `${PLANS.AGENCY_SCALE.priceMonthly} €/mois`})`}
              </button>
            </div>
          </div>

          {/* Full Feature Matrix Comparison Table */}
          <PricingComparisonTable isAnnual={isAnnual} onSelectPlan={handleSubscribe} />
        </div>

        {/* RGPD Compliance Footer Notice */}
        <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
          <div className="space-y-0.5">
            <span className="font-extrabold text-slate-200 text-sm">Chiffrement Souverain Conforme RGPD & Hébergement Français / UE</span>
            <p className="text-slate-400">
              Toutes vos données professionnelles et les documents justificatifs de vos clients sont chiffrés de bout en bout (AES-256) et conservés sur des serveurs sécurisés certifiés ISO 27001 et conformes au RGPD (Règlement Général sur la Protection des Données).
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
