'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import CreateFolderModal from '@/components/CreateFolderModal';
import {
  Plus,
  Folder,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  Download,
  Eye,
  Search,
  RefreshCw,
  BellRing,
  Trash2,
  ShieldCheck,
  Zap,
  Loader2,
  Sparkle,
  LayoutGrid,
  List,
  Mail,
  Calendar,
  FileSpreadsheet,
} from 'lucide-react';

interface FileItem {
  id: string;
  fileKey: string;
  fileName: string;
  fileSize: number;
}

interface RequirementItem {
  id: string;
  title: string;
  status: string;
  files: FileItem[];
}

interface RequestItem {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  token: string;
  status: string;
  reminderCount: number;
  lastRemindedAt: Date | string | null;
  createdAt: Date | string;
  documentRequirements: RequirementItem[];
}

export default function DashboardClientView({
  initialRequests,
  templates,
  userPlan,
  userRole,
  userName,
}: {
  initialRequests: RequestItem[];
  templates: Array<{ id: string; name: string; requiredDocTypes: string[] }>;
  userPlan: string;
  userRole: string;
  userName: string;
}) {
  const [requests, setRequests] = useState<RequestItem[]>(initialRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'IN_REVIEW' | 'COMPLETED'>('ALL');
  const [viewMode, setViewMode] = useState<'TABLE' | 'GRID'>('TABLE');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [remindingId, setRemindingId] = useState<string | null>(null);
  const [isRemindingAll, setIsRemindingAll] = useState(false);
  const [cronNotice, setCronNotice] = useState<string | null>(null);

  const refreshRequests = async () => {
    try {
      const res = await fetch('/api/requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = (token: string, id: string) => {
    const link = `${window.location.origin}/d/${token}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRemindSingleFolder = async (folderId: string, clientEmail: string) => {
    setRemindingId(folderId);
    setCronNotice(null);
    try {
      const res = await fetch(`/api/requests/${folderId}/remind`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setCronNotice(`E-mail de relance personnalisé envoyé avec succès à ${clientEmail} !`);
        refreshRequests();
      } else {
        alert(data.error || 'Erreur lors de l\'envoi de la relance');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRemindingId(null);
    }
  };

  const triggerManualCronRemind = async () => {
    setIsRemindingAll(true);
    setCronNotice(null);
    try {
      const res = await fetch('/api/requests/remind-pending', {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setCronNotice(
          data.message || `Relances envoyées avec succès à ${data.processedCount} client(s) incomplet(s) !`
        );
        refreshRequests();
      } else {
        alert(data.error || 'Erreur lors de l\'envoi des relances');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRemindingAll(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce dossier ?')) return;
    try {
      await fetch(`/api/requests/${id}`, { method: 'DELETE' });
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'ID Reference',
      'Nom Client',
      'Email Client',
      'Telephone',
      'Statut Dossier',
      'Pieces Validees',
      'Total Pieces Exigees',
      'Nombre de Relances',
      'Date de Creation',
      'Lien Portail Client 1-Clic',
    ];

    const rows = filteredRequests.map((r) => {
      const validCount = r.documentRequirements.filter((req) => req.status === 'VALIDATED').length;
      const statusLabel =
        r.status === 'COMPLETED'
          ? 'Complet & Certifie'
          : r.status === 'IN_REVIEW'
          ? 'A Inspecter'
          : 'Incomplet';

      return [
        `"${r.id}"`,
        `"${r.clientName.replace(/"/g, '""')}"`,
        `"${r.clientEmail.replace(/"/g, '""')}"`,
        `"${(r.clientPhone || '').replace(/"/g, '""')}"`,
        `"${statusLabel}"`,
        validCount,
        r.documentRequirements.length,
        r.reminderCount,
        `"${new Date(r.createdAt).toLocaleDateString('fr-FR')}"`,
        `"${window.location.origin}/d/${r.token}"`,
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `fylynx_dossiers_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats calculation
  const totalCount = requests.length;
  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
  const inReviewCount = requests.filter((r) => r.status === 'IN_REVIEW').length;
  const completedCount = requests.filter((r) => r.status === 'COMPLETED').length;

  const filteredRequests = requests.filter((r) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      r.clientName.toLowerCase().includes(query) ||
      r.clientEmail.toLowerCase().includes(query) ||
      (r.clientPhone && r.clientPhone.toLowerCase().includes(query)) ||
      r.token.toLowerCase().includes(query) ||
      r.id.toLowerCase().includes(query);

    if (activeTab === 'ALL') return matchesSearch;
    return matchesSearch && r.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Admin Quick Banner */}
        {userRole === 'ADMIN' && (
          <div className="p-4 bg-gradient-to-r from-purple-950/90 via-slate-900 to-purple-950/90 text-purple-100 rounded-3xl border border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-purple-300 block">
                  Espace Administrateur HQ Master
                </span>
                <p className="text-xs text-slate-300 mt-0.5">
                  Connecté avec privilèges Administrateur (admin@fylinx.com). Accès à tous les comptes et stockage centralisé.
                </p>
              </div>
            </div>
            <Link
              href="/admin"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-purple-600/30 transition shrink-0 text-center"
            >
              Accéder au HQ Admin →
            </Link>
          </div>
        )}

        {/* Starter Plan Quota Notice Banner */}
        {userPlan === 'STARTER' && (
          <div className="p-4 bg-gradient-to-r from-slate-900 via-amber-950/60 to-slate-900 border border-amber-500/40 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-200 text-xs font-semibold backdrop-blur-xl shadow-xl">
            <div className="flex items-center gap-2.5">
              <Zap className="h-5 w-5 text-amber-400 shrink-0 fill-amber-400" />
              <span>
                Formule Starter : <strong className="text-white">{totalCount}/10 portails de collecte</strong> utilisés. Les relances automatiques quotidiennes sont incluses dès la formule Pro Illimité (79€/mois ou 63€/mois en annuel).
              </span>
            </div>
            <Link
              href="/dashboard/settings"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-2xl font-extrabold shrink-0 text-center transition shadow-md shadow-amber-500/20"
            >
              Passer au Forfait Pro (79€/mois) →
            </Link>
          </div>
        )}

        {/* Top Header & Welcome Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/90 p-5 sm:p-8 rounded-3xl border border-slate-800/80 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Tableau de Bord Dossiers
              </h1>
              <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/40 shadow-sm flex items-center gap-1.5">
                <Sparkle className="h-3.5 w-3.5 text-brand-400 fill-brand-400" /> Espace Professionnel
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Bienvenue <strong className="text-white">{userName}</strong>. Générez vos liens de dépôt 1-clic et suivez l&apos;avancement de vos pièces justificatives.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10">
            <button
              onClick={triggerManualCronRemind}
              disabled={isRemindingAll}
              className="px-4 py-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition border border-slate-700 shadow-md"
            >
              <BellRing className={`h-4 w-4 ${isRemindingAll ? 'animate-bounce text-amber-400' : 'text-slate-400'}`} />
              {isRemindingAll ? 'Relances en cours...' : 'Relancer Incomplets'}
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-3 bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:brightness-110 text-white font-extrabold rounded-2xl text-xs shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition glow-brand"
            >
              <Plus className="h-4 w-4" /> + Nouveau Dossier Client (1-Clic)
            </button>
          </div>
        </div>

        {cronNotice && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-emerald-200 text-xs font-bold flex items-center gap-2.5 shadow-lg backdrop-blur-md animate-in fade-in duration-200">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>{cronNotice}</span>
          </div>
        )}

        {/* High-Tech Interactive KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div
            onClick={() => setActiveTab('ALL')}
            className={`p-4 sm:p-5 rounded-3xl border shadow-xl flex items-center justify-between transition-all cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-slate-900 border-brand-500/80 ring-2 ring-brand-500/20 shadow-brand-500/10'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Dossiers</span>
              <p className="text-2xl sm:text-3xl font-black text-white mt-0.5 sm:mt-1">{totalCount}</p>
              <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 hidden sm:block mt-0.5">Tous les dossiers gérés</span>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold border border-brand-500/20 shadow-inner shrink-0">
              <Folder className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab('PENDING')}
            className={`p-4 sm:p-5 rounded-3xl border shadow-xl flex items-center justify-between transition-all cursor-pointer ${
              activeTab === 'PENDING'
                ? 'bg-slate-900 border-amber-500/80 ring-2 ring-amber-500/20 shadow-amber-500/10'
                : 'bg-slate-900/80 border-amber-500/30 hover:border-amber-500/60'
            }`}
          >
            <div>
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-amber-400">Incomplets</span>
              <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-0.5 sm:mt-1">{pendingCount}</p>
              <span className="text-[9px] sm:text-[10px] font-semibold text-amber-300/70 hidden sm:block mt-0.5">Pièces manquantes</span>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-amber-950/60 text-amber-400 flex items-center justify-center font-bold border border-amber-800/60 shadow-inner shrink-0">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab('IN_REVIEW')}
            className={`p-4 sm:p-5 rounded-3xl border shadow-xl flex items-center justify-between transition-all cursor-pointer ${
              activeTab === 'IN_REVIEW'
                ? 'bg-slate-900 border-indigo-500/80 ring-2 ring-indigo-500/20 shadow-indigo-500/10'
                : 'bg-slate-900/80 border-indigo-500/30 hover:border-indigo-500/60'
            }`}
          >
            <div>
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-indigo-300">À Inspecter</span>
              <p className="text-2xl sm:text-3xl font-black text-indigo-400 mt-0.5 sm:mt-1">{inReviewCount}</p>
              <span className="text-[9px] sm:text-[10px] font-semibold text-indigo-300/70 hidden sm:block mt-0.5">Fichiers reçus</span>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-indigo-950/60 text-indigo-400 flex items-center justify-center font-bold border border-indigo-800/60 shadow-inner shrink-0">
              <RefreshCw className="h-5 w-5 sm:h-6 sm:w-6 animate-spin-slow" />
            </div>
          </div>

          <div
            onClick={() => setActiveTab('COMPLETED')}
            className={`p-4 sm:p-5 rounded-3xl border shadow-xl flex items-center justify-between transition-all cursor-pointer ${
              activeTab === 'COMPLETED'
                ? 'bg-slate-900 border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-emerald-500/10'
                : 'bg-slate-900/80 border-emerald-500/30 hover:border-emerald-500/60'
            }`}
          >
            <div>
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">Complets</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-0.5 sm:mt-1">{completedCount}</p>
              <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-300/70 hidden sm:block mt-0.5">Dossiers 100% validés</span>
            </div>
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-emerald-950/60 text-emerald-400 flex items-center justify-center font-bold border border-emerald-800/60 shadow-inner shrink-0">
              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>
        </div>

        {/* Filter Tabs, View Switcher & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-3xl border border-slate-800 shadow-xl">
          {/* Tab Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition ${
                activeTab === 'ALL'
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Tous ({totalCount})
            </button>
            <button
              onClick={() => setActiveTab('PENDING')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition ${
                activeTab === 'PENDING'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-amber-400 hover:bg-amber-950/50'
              }`}
            >
              Incomplets ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab('IN_REVIEW')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition ${
                activeTab === 'IN_REVIEW'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-indigo-400 hover:bg-indigo-950/50'
              }`}
            >
              À Inspecter ({inReviewCount})
            </button>
            <button
              onClick={() => setActiveTab('COMPLETED')}
              className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold transition ${
                activeTab === 'COMPLETED'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-emerald-400 hover:bg-emerald-950/50'
              }`}
            >
              Complets ({completedCount})
            </button>
          </div>

          <div className="flex items-center gap-3 justify-between lg:justify-end">
            {/* View Mode Switcher (Desktop only or optional on mobile) */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setViewMode('TABLE')}
                title="Affichage en Tableau spacieux"
                className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'TABLE' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="h-4 w-4" /> Tableau
              </button>
              <button
                onClick={() => setViewMode('GRID')}
                title="Affichage en Grille de Cartes"
                className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'GRID' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="h-4 w-4" /> Cartes
              </button>
            </div>

            {/* Search bar & Export CSV */}
            <div className="flex items-center gap-2 flex-1 sm:w-80">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Rechercher nom, email, réf..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <button
                onClick={handleExportCSV}
                title="Exporter l'ensemble de la liste filtrée au format CSV pour votre comptabilité"
                className="px-3.5 py-2.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition shadow-sm"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- MOBILE RESPONSIVE CARD VIEW (S'affiche automatiquement sur smartphone < md:) --- */}
        <div className="block md:hidden space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-8 text-center text-slate-400">
              <Folder className="h-10 w-10 text-slate-700 mx-auto mb-2" />
              <p className="font-extrabold text-slate-200 text-sm">Aucun dossier trouvé</p>
              <p className="text-xs text-slate-500 mt-1">
                Cliquez sur &quot;+ Nouveau Dossier Client&quot; pour démarrer.
              </p>
            </div>
          ) : (
            filteredRequests.map((req) => {
              const validCount = req.documentRequirements.filter((r) => r.status === 'VALIDATED').length;
              const totalReq = req.documentRequirements.length;
              const progressPct = Math.round((validCount / (totalReq || 1)) * 100);
              const missingDocs = req.documentRequirements.filter(
                (r) => r.status !== 'VALIDATED' || r.files.length === 0
              );
              const isRemindingThis = remindingId === req.id;
              const initials = req.clientName.slice(0, 2).toUpperCase();

              return (
                <div
                  key={req.id}
                  className="bg-slate-900/95 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-4"
                >
                  {/* Client Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center border border-white/10 shrink-0">
                        {initials}
                      </div>
                      <div className="truncate">
                        <h3 className="font-extrabold text-white text-base truncate">{req.clientName}</h3>
                        <p className="text-xs text-slate-400 font-mono truncate">{req.clientEmail}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(req.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {req.status === 'COMPLETED' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Complet & Certifié
                      </span>
                    ) : req.status === 'IN_REVIEW' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                        <RefreshCw className="h-3.5 w-3.5 text-indigo-400 animate-spin-slow" /> Reçu (À Inspecter)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <Clock className="h-3.5 w-3.5 text-amber-400" /> Incomplet (En attente)
                      </span>
                    )}
                  </div>

                  {/* Progress Box */}
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-extrabold">
                      <span className="text-slate-300">Avancement des pièces</span>
                      <span className="text-emerald-400 font-mono">{validCount} / {totalReq} ({progressPct}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-400 rounded-full"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Missing Documents preview */}
                  {missingDocs.length > 0 && (
                    <div className="p-3 bg-amber-950/30 border border-amber-500/20 rounded-2xl space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-amber-400 block">
                        Pièces manquantes :
                      </span>
                      {missingDocs.map((m) => (
                        <div key={m.id} className="text-xs text-amber-200 font-medium flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{m.title}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Mobile Action Buttons Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => handleCopyLink(req.token, req.id)}
                      className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 border border-slate-700 shadow-sm"
                    >
                      {copiedId === req.id ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-400" /> Copié !
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 text-slate-300" /> Copier Lien
                        </>
                      )}
                    </button>

                    <Link
                      href={`/dashboard/requests/${req.id}`}
                      className="py-2.5 px-3 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg shadow-brand-500/20 text-center"
                    >
                      <Eye className="h-4 w-4" /> Inspecter
                    </Link>

                    {req.status !== 'COMPLETED' && (
                      <button
                        onClick={() => handleRemindSingleFolder(req.id, req.clientEmail)}
                        disabled={isRemindingThis}
                        className="py-2.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5"
                      >
                        {isRemindingThis ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4 text-amber-400" />
                        )}
                        Relancer
                      </button>
                    )}

                    <a
                      href={`/api/requests/${req.id}/export-zip`}
                      className="py-2.5 px-3 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 text-center"
                    >
                      <Download className="h-4 w-4 text-emerald-400" /> Export ZIP
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* --- DESKTOP DISPLAY AREA (Tableau ou Grille de Cartes pour écrans >= md:) --- */}
        <div className="hidden md:block">
          {viewMode === 'TABLE' ? (
            /* Spacious & Well-Padded Table View */
            <div className="bg-slate-900/80 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950/90 border-b border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      <th className="py-5 px-6 whitespace-nowrap min-w-[220px]">Client / Dossier</th>
                      <th className="py-5 px-6 whitespace-nowrap min-w-[240px]">Statut & Avancement</th>
                      <th className="py-5 px-6 whitespace-nowrap min-w-[250px]">Pièces Manquantes</th>
                      <th className="py-5 px-6 whitespace-nowrap min-w-[120px]">Relances</th>
                      <th className="py-5 px-6 whitespace-nowrap min-w-[120px]">Créé le</th>
                      <th className="py-5 px-6 text-right whitespace-nowrap min-w-[280px]">Actions Rapides</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-16 text-slate-400">
                          <Folder className="h-12 w-12 text-slate-700 mx-auto mb-3" />
                          <p className="font-extrabold text-slate-200 text-base">Aucun dossier dans cet affichage</p>
                          <p className="text-xs text-slate-500 mt-1">
                            Cliquez sur &quot;+ Nouveau Dossier Client (1-Clic)&quot; pour générer un lien de dépôt.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map((req) => {
                        const validCount = req.documentRequirements.filter((r) => r.status === 'VALIDATED').length;
                        const totalReq = req.documentRequirements.length;
                        const progressPct = Math.round((validCount / (totalReq || 1)) * 100);
                        const missingDocs = req.documentRequirements.filter(
                          (r) => r.status !== 'VALIDATED' || r.files.length === 0
                        );
                        const isRemindingThis = remindingId === req.id;
                        const initials = req.clientName.slice(0, 2).toUpperCase();

                        return (
                          <tr key={req.id} className="hover:bg-slate-800/40 transition">
                            {/* Client / Dossier Column */}
                            <td className="py-5 px-6">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 border border-white/10 shadow-md">
                                  {initials}
                                </div>
                                <div className="space-y-0.5">
                                  <div className="font-extrabold text-white text-sm">{req.clientName}</div>
                                  <div className="text-xs text-slate-400 font-mono flex items-center gap-1">
                                    <Mail className="h-3 w-3 text-slate-500" /> {req.clientEmail}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Statut & Avancement Column */}
                            <td className="py-5 px-6">
                              <div className="space-y-2.5 max-w-[220px]">
                                {/* Status Badge */}
                                <div>
                                  {req.status === 'COMPLETED' ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Complet & Certifié
                                    </span>
                                  ) : req.status === 'IN_REVIEW' ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                                      <RefreshCw className="h-3.5 w-3.5 text-indigo-400 animate-spin-slow" /> Reçu (À Inspecter)
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                      <Clock className="h-3.5 w-3.5 text-amber-400" /> Incomplet (En attente)
                                    </span>
                                  )}
                                </div>

                                {/* Separate Progress Card Box */}
                                <div className="p-2.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1.5">
                                  <div className="flex items-center justify-between text-[11px] font-extrabold">
                                    <span className="text-slate-300 font-mono">{validCount} / {totalReq} validé(s)</span>
                                    <span className="text-emerald-400 font-mono">{progressPct}%</span>
                                  </div>
                                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                                    <div
                                      className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
                                      style={{ width: `${progressPct}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Pièces Manquantes Column */}
                            <td className="py-5 px-6">
                              {missingDocs.length === 0 ? (
                                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-emerald-300 font-extrabold flex items-center gap-2">
                                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                                  <span>Toutes les pièces sont validées !</span>
                                </div>
                              ) : (
                                <div className="p-3 bg-amber-950/40 border border-amber-500/20 rounded-2xl space-y-1.5 max-w-[240px]">
                                  {missingDocs.slice(0, 2).map((m) => (
                                    <div key={m.id} className="text-[11px] text-amber-200 font-semibold flex items-center gap-1.5">
                                      <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                                      <span className="truncate">{m.title}</span>
                                    </div>
                                  ))}
                                  {missingDocs.length > 2 && (
                                    <span className="text-[10px] text-slate-400 font-mono block pt-0.5">
                                      + {missingDocs.length - 2} autre(s) pièce(s)
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* Relances Column */}
                            <td className="py-5 px-6">
                              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 rounded-2xl text-slate-200 font-extrabold border border-slate-800">
                                <BellRing className="h-3.5 w-3.5 text-amber-400" />
                                <span>{req.reminderCount} relance(s)</span>
                              </div>
                            </td>

                            {/* Date Column */}
                            <td className="py-5 px-6 text-slate-400 font-mono text-[11px]">
                              {new Date(req.createdAt).toLocaleDateString('fr-FR')}
                            </td>

                            {/* Action Buttons Column */}
                            <td className="py-5 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {req.status !== 'COMPLETED' && (
                                  <button
                                    onClick={() => handleRemindSingleFolder(req.id, req.clientEmail)}
                                    disabled={isRemindingThis}
                                    title="Envoyer un e-mail de relance à ce client"
                                    className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-extrabold transition flex items-center gap-1.5 shadow-sm"
                                  >
                                    {isRemindingThis ? (
                                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      <Send className="h-3.5 w-3.5 text-amber-400" />
                                    )}
                                    <span>Relancer</span>
                                  </button>
                                )}

                                <button
                                  onClick={() => handleCopyLink(req.token, req.id)}
                                  title="Copier le lien public de dépôt (1-Clic)"
                                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 shadow-sm"
                                >
                                  {copiedId === req.id ? (
                                    <>
                                      <Check className="h-4 w-4 text-emerald-400" />
                                      <span className="text-emerald-400">Copié</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-4 w-4 text-slate-300" />
                                      <span>Lien</span>
                                    </>
                                  )}
                                </button>

                                <Link
                                  href={`/dashboard/requests/${req.id}`}
                                  className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-extrabold transition flex items-center gap-1.5 shadow-lg shadow-brand-500/20"
                                >
                                  <Eye className="h-4 w-4" /> Inspecter
                                </Link>

                                <a
                                  href={`/api/requests/${req.id}/export-zip`}
                                  title="Télécharger l'archive ZIP du dossier"
                                  className="px-3 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-extrabold transition flex items-center gap-1 border border-emerald-700/60 shadow-sm"
                                >
                                  <Download className="h-4 w-4 text-emerald-400" /> ZIP
                                </a>

                                <button
                                  onClick={() => handleDelete(req.id)}
                                  title="Supprimer ce dossier"
                                  className="p-2 rounded-xl hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 transition border border-transparent hover:border-rose-800/50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Card Grid View Option */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((req) => {
                const validCount = req.documentRequirements.filter((r) => r.status === 'VALIDATED').length;
                const totalReq = req.documentRequirements.length;
                const progressPct = Math.round((validCount / (totalReq || 1)) * 100);
                const missingDocs = req.documentRequirements.filter(
                  (r) => r.status !== 'VALIDATED' || r.files.length === 0
                );
                const isRemindingThis = remindingId === req.id;
                const initials = req.clientName.slice(0, 2).toUpperCase();

                return (
                  <div
                    key={req.id}
                    className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-5 flex flex-col justify-between hover:border-slate-700 transition"
                  >
                    <div className="space-y-4">
                      {/* Top Row: Client Info & Status Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center border border-white/10 shadow-md shrink-0">
                            {initials}
                          </div>
                          <div>
                            <h3 className="font-black text-white text-base leading-snug">{req.clientName}</h3>
                            <p className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                              <Mail className="h-3 w-3 text-slate-500" /> {req.clientEmail}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDelete(req.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Status Pill */}
                      <div>
                        {req.status === 'COMPLETED' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Complet & Certifié
                          </span>
                        ) : req.status === 'IN_REVIEW' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                            <RefreshCw className="h-3.5 w-3.5 text-indigo-400 animate-spin-slow" /> Reçu (À Inspecter)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            <Clock className="h-3.5 w-3.5 text-amber-400" /> Incomplet (En attente)
                          </span>
                        )}
                      </div>

                      {/* Progress Bar Box */}
                      <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs font-extrabold">
                          <span className="text-slate-300">Avancement pièces</span>
                          <span className="text-emerald-400 font-mono">{validCount} / {totalReq} ({progressPct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Required Pieces List */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                          Pièces du dossier :
                        </span>
                        <div className="space-y-1.5">
                          {req.documentRequirements.map((r) => (
                            <div
                              key={r.id}
                              className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-between border ${
                                r.status === 'VALIDATED'
                                  ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/20'
                                  : 'bg-slate-950 text-slate-300 border-slate-800'
                              }`}
                            >
                              <span className="truncate pr-2">{r.title}</span>
                              {r.status === 'VALIDATED' ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                              ) : (
                                <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-4 border-t border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-500" /> {new Date(req.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                        <span>{req.reminderCount} relance(s)</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleCopyLink(req.token, req.id)}
                          className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700 shadow-sm"
                        >
                          {copiedId === req.id ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-400" /> Copié
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" /> Copier Lien
                            </>
                          )}
                        </button>

                        <Link
                          href={`/dashboard/requests/${req.id}`}
                          className="py-2.5 px-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-lg shadow-brand-500/20"
                        >
                          <Eye className="h-3.5 w-3.5" /> Inspecter
                        </Link>
                      </div>

                      {req.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleRemindSingleFolder(req.id, req.clientEmail)}
                          disabled={isRemindingThis}
                          className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-extrabold rounded-xl transition flex items-center justify-center gap-1.5"
                        >
                          {isRemindingThis ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Send className="h-3.5 w-3.5 text-amber-400" />
                          )}
                          Relancer par E-mail
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RGPD Compliance Footer Notice */}
        <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
          <div className="space-y-0.5">
            <span className="font-extrabold text-slate-200 text-sm">Chiffrement Souverain & Conformité RGPD</span>
            <p className="text-slate-400">
              Toutes les pièces justificatives déposées par vos clients sont chiffrées de bout en bout (AES-256) et hébergées sur des serveurs hautement sécurisés conformes aux normes européennes RGPD.
            </p>
          </div>
        </div>

        {/* Modal for fast request creation */}
        <CreateFolderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreated={() => {
            refreshRequests();
          }}
          templates={templates}
        />
      </main>
    </div>
  );
}
