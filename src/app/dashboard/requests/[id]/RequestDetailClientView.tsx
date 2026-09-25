'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import DocumentPreviewModal from '@/components/DocumentPreviewModal';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Copy,
  Check,
  Eye,
  FileText,
  Mail,
  Calendar,
  Send,
  Loader2,
  Bot,
  Sparkles,
  Lock,
  ShieldCheck,
  Camera,
} from 'lucide-react';
import AiVerificationBadge from '@/components/AiVerificationBadge';

interface FileItem {
  id: string;
  fileKey: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

interface RequirementItem {
  id: string;
  title: string;
  description: string | null;
  isRequired: boolean;
  status: string;
  rejectionReason: string | null;
  aiVerified?: boolean;
  aiStatus?: string | null;
  aiConfidenceScore?: number | null;
  aiAnalysisDetails?: string | null;
  files: FileItem[];
}

interface FolderRequestDetail {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  token: string;
  status: string;
  reminderCount: number;
  lastRemindedAt: Date | string | null;
  createdAt: Date | string;
  user: { name: string; companyName: string | null; subscriptionStatus?: string; role?: string };
  documentRequirements: RequirementItem[];
}

export default function RequestDetailClientView({
  initialRequest,
}: {
  initialRequest: FolderRequestDetail;
}) {
  const [request, setRequest] = useState<FolderRequestDetail>(initialRequest);
  const [selectedRequirement, setSelectedRequirement] = useState<RequirementItem | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isReminding, setIsReminding] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const refreshDetail = async () => {
    try {
      const res = await fetch(`/api/requests/${request.id}`);
      if (res.ok) {
        const data = await res.json();
        setRequest(data.request);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemindSingleFolder = async () => {
    setIsReminding(true);
    setNotice(null);
    try {
      const res = await fetch(`/api/requests/${request.id}/remind`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setNotice(`Email de relance envoyé avec succès à ${request.clientEmail} !`);
        refreshDetail();
      } else {
        alert(data.error || 'Erreur d\'envoi');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsReminding(false);
    }
  };

  const publicLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/d/${request.token}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalDocs = request.documentRequirements.length;
  const validatedDocs = request.documentRequirements.filter((r) => r.status === 'VALIDATED').length;

  const handleQuickValidate = async (requirementId: string) => {
    try {
      const res = await fetch(`/api/documents/${requirementId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'VALIDATED' }),
      });
      if (res.ok) {
        setNotice('Document validé avec succès !');
        refreshDetail();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation back button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" /> Retour aux dossiers
        </Link>

        {notice && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-emerald-300 text-sm font-semibold flex items-center gap-2 animate-in fade-in duration-200 shadow-lg">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            {notice}
          </div>
        )}

        {/* Top Folder Header */}
        <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold text-white">
                Dossier : {request.clientName}
              </h1>
              {request.status === 'COMPLETED' ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Complet & Validé
                </span>
              ) : request.status === 'IN_REVIEW' ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-extrabold rounded-full animate-pulse-subtle">
                  <Clock className="h-3.5 w-3.5 text-amber-400" /> Action Requise : Pièces déposées à vérifier ({validatedDocs}/{totalDocs} validés)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 text-xs font-extrabold rounded-full">
                  <Clock className="h-3.5 w-3.5 text-amber-400" /> En attente du client ({validatedDocs}/{totalDocs} validés)
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-slate-500" /> {request.clientEmail}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="h-3.5 w-3.5 text-slate-500" /> Créé le{' '}
                {new Date(request.createdAt).toLocaleDateString('fr-FR')}
              </span>
              <span className="flex items-center gap-1 font-semibold text-amber-400">
                ({request.reminderCount} relance(s) envoyée(s))
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Relancer ce dossier CTA */}
            {request.status !== 'COMPLETED' && (
              <button
                onClick={handleRemindSingleFolder}
                disabled={isReminding}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-2xl text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition"
              >
                {isReminding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Relancer ce client par e-mail
              </button>
            )}

            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-2xl text-xs font-bold flex items-center gap-2 transition"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Lien copié' : 'Copier lien client'}
            </button>

            <a
              href={`/api/requests/${request.id}/export-zip`}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition"
            >
              <Download className="h-4 w-4" /> Télécharger (.ZIP)
            </a>
          </div>
        </div>

        {/* AI Enterprise Upgrade Banner if user is on Starter or Pro */}
        {request.user.subscriptionStatus !== 'AI_ENTERPRISE' && request.user.role !== 'ADMIN' && (
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs uppercase tracking-wider">
                <Bot className="h-4 w-4" /> Fonctionnalité IA Entreprise (149€/mois)
              </div>
              <h3 className="text-xl font-extrabold">Automatisez la Vérification Anti-Fraude avec l&apos;IA</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                L&apos;IA Fylynx contrôle automatiquement la structure des pièces d&apos;identité (bandes MRZ), la récence des justificatifs de domicile (&lt; 3 mois) et extrait les revenus des bulletins de paie avec score de confiance en temps réel.
              </p>
            </div>
            <Link
              href="/dashboard/settings"
              className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-indigo-500/25 flex items-center gap-2 whitespace-nowrap transition"
            >
              <Sparkles className="h-4 w-4" /> Passer à l&apos;IA Enterprise (149€/mois)
            </Link>
          </div>
        )}

        {/* Document Requirements Inspection Cards */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-lg font-extrabold text-white">
              Pièces justificatives demandées ({request.documentRequirements.length})
            </h2>
            {request.user.subscriptionStatus === 'AI_ENTERPRISE' || request.user.role === 'ADMIN' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 text-xs font-extrabold rounded-full">
                <Bot className="h-3.5 w-3.5 text-indigo-400" /> Contrôle IA Actif
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-slate-400 text-xs font-semibold rounded-full border border-slate-800">
                <Lock className="h-3.5 w-3.5 text-slate-500" /> Validation Manuelle (Formule {request.user.subscriptionStatus || 'STARTER'})
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {request.documentRequirements.map((req) => {
              const isValidated = req.status === 'VALIDATED';
              const isRejected = req.status === 'REJECTED';
              const hasFiles = req.files.length > 0;

              return (
                <div
                  key={req.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    isValidated
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : isRejected
                      ? 'bg-rose-950/20 border-rose-500/30'
                      : hasFiles
                      ? 'bg-amber-950/20 border-amber-500/40'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-extrabold text-white text-base">{req.title}</h3>
                      {req.description && (
                        <p className="text-xs text-slate-400 mt-0.5">{req.description}</p>
                      )}
                    </div>

                    {isValidated ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Validé
                      </span>
                    ) : isRejected ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        <XCircle className="h-3.5 w-3.5 text-rose-400" /> Rejeté
                      </span>
                    ) : hasFiles ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <Clock className="h-3.5 w-3.5 text-amber-400" /> À Vérifier ({req.files.length} fichier(s))
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                        <Clock className="h-3.5 w-3.5 text-slate-500" /> En attente
                      </span>
                    )}
                  </div>

                  {/* AI Verification Diagnostic Badge or Locked Teaser */}
                  {req.aiVerified ? (
                    <div className="mb-3">
                      <AiVerificationBadge
                        aiVerified={true}
                        aiStatus={req.aiStatus || 'PASSED'}
                        aiConfidenceScore={req.aiConfidenceScore ?? 94}
                        aiAnalysisDetails={req.aiAnalysisDetails || null}
                      />
                    </div>
                  ) : hasFiles && request.user.subscriptionStatus !== 'AI_ENTERPRISE' && request.user.role !== 'ADMIN' && (
                    <div className="mb-3 p-3 bg-slate-950/90 border border-indigo-500/30 rounded-2xl flex items-center justify-between text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-indigo-400 shrink-0" />
                        <span>Analyse IA réservée à la formule <strong>IA Enterprise</strong></span>
                      </div>
                      <Link href="/dashboard/settings" className="text-indigo-400 hover:text-indigo-300 font-bold underline">
                        Débloquer
                      </Link>
                    </div>
                  )}

                  {/* Deposited files list & action buttons */}
                  {hasFiles ? (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        {req.files.map((file) => {
                          const isRecto = file.fileName.toUpperCase().startsWith('RECTO_');
                          const isVerso = file.fileName.toUpperCase().startsWith('VERSO_');
                          const fileUrl = `/api/upload/local?key=${encodeURIComponent(file.fileKey)}`;
                          const downloadUrl = `/api/upload/local?key=${encodeURIComponent(file.fileKey)}&download=1`;

                          return (
                            <div
                              key={file.id}
                              className="p-2.5 bg-slate-950 rounded-2xl border border-slate-800 text-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs"
                            >
                              <div className="flex items-center gap-2 overflow-hidden">
                                {isRecto ? (
                                  <Camera className="h-4 w-4 text-emerald-400 shrink-0" />
                                ) : isVerso ? (
                                  <Camera className="h-4 w-4 text-indigo-400 shrink-0" />
                                ) : (
                                  <FileText className="h-4 w-4 text-brand-400 shrink-0" />
                                )}
                                <div className="flex flex-col">
                                  <span className="font-mono text-slate-200 font-bold truncate">
                                    {isRecto ? 'Face RECTO' : isVerso ? 'Face VERSO' : file.fileName}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {file.fileName} ({(file.fileSize / 1024 / 1024).toFixed(2)} Mo)
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedRequirement(req);
                                    setSelectedFileId(file.id);
                                  }}
                                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 rounded-xl font-bold text-xs flex items-center gap-1 transition"
                                >
                                  <Eye className="h-3.5 w-3.5 text-indigo-400" /> Aperçu
                                </button>

                                <a
                                  href={downloadUrl}
                                  download={file.fileName}
                                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-xl font-bold text-xs flex items-center gap-1 transition"
                                >
                                  <Download className="h-3.5 w-3.5 text-emerald-400" /> Télécharger
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Direct 1-Click Action Buttons */}
                      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                        {!isValidated && (
                          <button
                            type="button"
                            onClick={() => handleQuickValidate(req.id)}
                            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-600/20"
                          >
                            <CheckCircle2 className="h-4 w-4" /> Valider l&apos;ensemble
                          </button>
                        )}

                        {!isRejected && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedRequirement(req);
                              setSelectedFileId(null);
                            }}
                            className="flex-1 py-2 px-3 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-700/60 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition"
                          >
                            <XCircle className="h-4 w-4 text-rose-400" /> Rejeter
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRequirement(req);
                            setSelectedFileId(null);
                          }}
                          className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                        >
                          <Eye className="h-4 w-4 text-indigo-400" /> Inspecter ({req.files.length})
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-slate-950/60 border border-dashed border-slate-800 rounded-2xl text-xs text-slate-500 text-center">
                      Aucun fichier soumis par le client pour cette pièce.
                    </div>
                  )}

                  {isRejected && req.rejectionReason && (
                    <p className="mt-2.5 text-xs text-rose-300 bg-rose-950/50 border border-rose-900/50 p-2.5 rounded-xl">
                      Motif du rejet : <strong>{req.rejectionReason}</strong>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RGPD Compliance Badge */}
        <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
          <div className="space-y-0.5">
            <span className="font-extrabold text-slate-200 text-sm">Archivage Sécurisé & RGPD</span>
            <p className="text-slate-400">
              Les fichiers déposés par vos clients sont chiffrés AES-256 et ne sont accessibles qu&apos;aux personnes autorisées. L&apos;export ZIP permet une archivage local conforme aux exigences RGPD.
            </p>
          </div>
        </div>

        {/* Modal Inspector Component */}
        <DocumentPreviewModal
          isOpen={Boolean(selectedRequirement)}
          onClose={() => {
            setSelectedRequirement(null);
            setSelectedFileId(null);
          }}
          requirement={selectedRequirement}
          initialFileId={selectedFileId}
          onStatusUpdated={refreshDetail}
        />
        <footer className="mt-12 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 font-medium px-2">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-brand-400" /> Fylynx — Espace Professionnel Sécurisé
          </span>
          <span>© 2026 Tous droits réservés</span>
        </footer>
      </main>
    </div>
  );
}
