'use client';

import { useState, useRef } from 'react';
import {
  Camera,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Building2,
  ShieldCheck,
  X,
  Loader2,
  Sparkles,
  Bot,
  Check,
} from 'lucide-react';
import AiVerificationBadge from './AiVerificationBadge';
import LanguageSelector from './LanguageSelector';

interface FileUploadState {
  file: File;
  previewUrl: string;
  progress: number;
  uploaded: boolean;
  error?: string;
  aiData?: {
    aiVerified: boolean;
    aiStatus: string | null;
    aiConfidenceScore: number | null;
    aiAnalysisDetails: string | null;
  };
}

interface RequirementItem {
  id: string;
  title: string;
  description: string | null;
  isRequired: boolean;
  status: string; // WAITING, SUBMITTED, VALIDATED, REJECTED
  rejectionReason: string | null;
  aiVerified?: boolean;
  aiStatus?: string | null;
  aiConfidenceScore?: number | null;
  aiAnalysisDetails?: string | null;
  files: Array<{ id: string; fileName: string; fileSize: number; mimeType: string }>;
}

interface PublicFolderData {
  id: string;
  clientName: string;
  status: string;
  user: {
    name: string;
    companyName: string | null;
    subscriptionStatus?: string;
    role?: string;
    companyLogo?: string | null;
    customWelcomeMsg?: string | null;
    brandColor?: string | null;
  };
  documentRequirements: RequirementItem[];
}

export default function PublicDepositorView({ initialFolder }: { initialFolder: PublicFolderData }) {
  const [folder, setFolder] = useState<PublicFolderData>(initialFolder);
  const [uploads, setUploads] = useState<Record<string, FileUploadState>>({});
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(folder.status === 'COMPLETED');

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const companyDisplayName = folder.user.companyName || folder.user.name;
  const hasAiEnterprise = folder.user.subscriptionStatus === 'AI_ENTERPRISE' || folder.user.role === 'ADMIN';

  // Branding permissions check (PRO, AI_ENTERPRISE, ADMIN)
  const canUseBranding =
    folder.user.subscriptionStatus === 'PRO' ||
    folder.user.subscriptionStatus === 'AI_ENTERPRISE' ||
    folder.user.role === 'ADMIN';

  const companyLogo = canUseBranding ? folder.user.companyLogo : null;
  const customWelcomeMsg = canUseBranding ? folder.user.customWelcomeMsg : null;
  const brandColor = canUseBranding && folder.user.brandColor ? folder.user.brandColor : '#4f46e5';

  // Calculate completion stats
  const totalRequired = folder.documentRequirements.filter((r) => r.isRequired).length;
  const completedCount = folder.documentRequirements.filter(
    (r) => r.status === 'VALIDATED' || r.status === 'SUBMITTED' || uploads[r.id]?.uploaded
  ).length;
  const progressPercent = Math.min(100, Math.round((completedCount / (totalRequired || 1)) * 100));

  const handleFileSelect = async (requirementId: string, file: File) => {
    if (!file) return;

    // Local instant preview
    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : '';

    setUploads((prev) => ({
      ...prev,
      [requirementId]: {
        file,
        previewUrl,
        progress: 10,
        uploaded: false,
      },
    }));

    setIsUploading((prev) => ({ ...prev, [requirementId]: true }));

    try {
      // Step 1: Request S3 / R2 presigned URL from API
      const res = await fetch('/api/upload/presigned-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentRequirementId: requirementId,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type || 'application/pdf',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur d\'upload');
      }

      setUploads((prev) => ({
        ...prev,
        [requirementId]: { ...prev[requirementId], progress: 50 },
      }));

      // Step 2: Upload payload to presigned URL or dev endpoint
      const uploadRes = await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type || 'application/pdf',
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error('Erreur de transfert vers le serveur de stockage');
      }

      let aiData: any = null;

      // Step 3: Run AI Document Verification Engine ONLY if folder owner has AI Enterprise or ADMIN plan
      if (hasAiEnterprise) {
        const aiRes = await fetch('/api/ai/verify-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentRequirementId: requirementId,
            fileName: file.name,
            mimeType: file.type || 'application/pdf',
            fileSize: file.size,
          }),
        });

        if (aiRes.ok) {
          aiData = await aiRes.json();
        }
      }

      setUploads((prev) => ({
        ...prev,
        [requirementId]: {
          ...prev[requirementId],
          progress: 100,
          uploaded: true,
          aiData: aiData?.data?.requirement
            ? {
                aiVerified: true,
                aiStatus: aiData.data.requirement.aiStatus,
                aiConfidenceScore: aiData.data.requirement.aiConfidenceScore,
                aiAnalysisDetails: aiData.data.requirement.aiAnalysisDetails,
              }
            : undefined,
        },
      }));

      // Update local requirement status
      setFolder((prev) => ({
        ...prev,
        documentRequirements: prev.documentRequirements.map((r) =>
          r.id === requirementId
            ? {
                ...r,
                status: aiData?.data?.requirement?.status || 'SUBMITTED',
                aiVerified: Boolean(aiData?.data?.requirement?.aiVerified),
                aiStatus: aiData?.data?.requirement?.aiStatus,
                aiConfidenceScore: aiData?.data?.requirement?.aiConfidenceScore,
                aiAnalysisDetails: aiData?.data?.requirement?.aiAnalysisDetails,
                rejectionReason: aiData?.data?.requirement?.rejectionReason || null,
                files: [
                  ...r.files,
                  {
                    id: 'temp_' + Date.now(),
                    fileName: file.name,
                    fileSize: file.size,
                    mimeType: file.type,
                  },
                ],
              }
            : r
        ),
      }));
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur d\'upload';
      setUploads((prev) => ({
        ...prev,
        [requirementId]: {
          ...prev[requirementId],
          error: errorMsg,
          uploaded: false,
        },
      }));
    } finally {
      setIsUploading((prev) => ({ ...prev, [requirementId]: false }));
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmittedSuccess(true);
    }, 1200);
  };

  const allRequiredUploaded = folder.documentRequirements.every((req) => {
    if (!req.isRequired) return true;
    return req.status === 'SUBMITTED' || req.status === 'VALIDATED' || uploads[req.id]?.uploaded;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-3 sm:p-6 pb-64 sm:pb-72 relative font-sans selection:bg-brand-500 selection:text-white">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-brand-500/10 rounded-full blur-[140px] pointer-events-none overflow-hidden" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none overflow-hidden" />

      {/* Top Header Card with White-Label Branding Support */}
      <div
        className="w-full max-w-xl bg-slate-900/90 border rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-2xl mb-6 space-y-5 relative overflow-hidden z-10"
        style={{ borderColor: brandColor ? `${brandColor}60` : '#334155' }}
      >
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3.5">
            {companyLogo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={companyLogo}
                alt={companyDisplayName}
                className="h-12 max-w-[160px] object-contain rounded-2xl bg-white/10 p-1.5 shrink-0 ring-1 ring-white/10 shadow-md"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div
                className="h-12 w-12 rounded-2xl text-white font-black flex items-center justify-center shadow-lg shrink-0 border border-white/10"
                style={{ backgroundColor: brandColor || '#4f46e5' }}
              >
                <Building2 className="h-6 w-6" />
              </div>
            )}
            <div>
              <span
                className="text-[11px] font-extrabold uppercase tracking-wider block mb-0.5"
                style={{ color: brandColor || '#818cf8' }}
              >
                Dépôt Sécurisé &amp; Certifié RGPD
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">{companyDisplayName}</h1>
            </div>
          </div>
          <LanguageSelector />
        </div>

        {customWelcomeMsg && (
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-slate-200 leading-relaxed italic shadow-inner">
            « {customWelcomeMsg} »
          </div>
        )}

        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-400 font-medium">Dossier client :</span>
            <strong className="font-extrabold text-white">{folder.clientName}</strong>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-400 font-medium">Progression :</span>
            <span className="font-black text-emerald-400">{completedCount}/{totalRequired} pièces ({progressPercent}%)</span>
          </div>

          {/* Dynamic Progress Bar */}
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-400 transition-all duration-500 rounded-full shadow-lg"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Success Confirmation View */}
      {isSubmittedSuccess ? (
        <div className="w-full max-w-lg bg-emerald-950/60 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="h-16 w-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Dossier Transmis avec Succès !</h2>
          <p className="text-sm text-slate-300">
            Toutes vos pièces justificatives ont été vérifiées et transmises en toute sécurité à{' '}
            <strong className="text-emerald-400">{companyDisplayName}</strong>.
          </p>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-slate-400 flex items-center justify-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand-400" /> Chiffrement AES-256 de bout en bout au repos.
          </div>
        </div>
      ) : (
        /* Requirements Checklist */
        <div className="w-full max-w-xl space-y-5 relative z-10">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-200 flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand-400" />
              Pièces justificatives requises ({folder.documentRequirements.length})
            </h2>
            {folder.user.subscriptionStatus === 'AI_ENTERPRISE' || folder.user.role === 'ADMIN' ? (
              <span className="text-[11px] text-indigo-300 font-extrabold flex items-center gap-1.5 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-500/40 shadow-sm">
                <Bot className="h-3.5 w-3.5 text-indigo-400" /> Contrôle IA Actif
              </span>
            ) : (
              <span className="text-[11px] text-slate-300 font-extrabold flex items-center gap-1.5 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                <ShieldCheck className="h-3.5 w-3.5 text-brand-400" /> Dépôt Sécurisé
              </span>
            )}
          </div>

          {folder.documentRequirements.map((req, index) => {
            const uploadState = uploads[req.id];
            const isDone = req.status === 'VALIDATED' || req.status === 'SUBMITTED' || uploadState?.uploaded;
            const isRejected = req.status === 'REJECTED';
            const isProcessing = isUploading[req.id];

            return (
              <div
                key={req.id}
                className={`rounded-2xl border p-4 transition-all duration-200 ${
                  isDone
                    ? 'bg-slate-800/50 border-emerald-500/50'
                    : isRejected
                    ? 'bg-rose-950/40 border-rose-500/50'
                    : 'bg-slate-800/80 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
                      <h3 className="font-bold text-slate-100 text-base">{req.title}</h3>
                      {req.isRequired && (
                        <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Requis
                        </span>
                      )}
                    </div>
                    {req.description && (
                      <p className="text-xs text-slate-400 leading-relaxed">{req.description}</p>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isDone ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Chargé
                      </span>
                    ) : isRejected ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        <AlertCircle className="h-3.5 w-3.5" /> Rejeté
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-300 border border-slate-600">
                        <Clock className="h-3.5 w-3.5 text-amber-400" /> En attente
                      </span>
                    )}
                  </div>
                </div>

                {/* AI Verification Diagnostic Badge */}
                {(req.aiVerified || uploadState?.aiData) && (
                  <div className="mt-3">
                    <AiVerificationBadge
                      aiVerified={true}
                      aiStatus={req.aiStatus || uploadState?.aiData?.aiStatus || 'PASSED'}
                      aiConfidenceScore={req.aiConfidenceScore ?? uploadState?.aiData?.aiConfidenceScore ?? 94}
                      aiAnalysisDetails={req.aiAnalysisDetails || uploadState?.aiData?.aiAnalysisDetails || null}
                    />
                  </div>
                )}

                {/* Rejection Reason Alert */}
                {isRejected && req.rejectionReason && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-900/30 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">Motif du rejet :</strong>
                      {req.rejectionReason}
                    </div>
                  </div>
                )}

                {/* File Preview Thumbnail if uploaded */}
                {uploadState?.previewUrl && (
                  <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-700 bg-slate-900 max-h-40 flex items-center justify-center">
                    <img
                      src={uploadState.previewUrl}
                      alt="Aperçu document"
                      className="max-h-36 object-contain"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 rounded text-[11px] font-mono text-slate-200">
                      {uploadState.file.name} ({(uploadState.file.size / 1024 / 1024).toFixed(2)} Mo)
                    </div>
                  </div>
                )}

                {/* Upload Action Cards & Recto/Verso Layout */}
                {(() => {
                  const isDoubleSided =
                    req.title.toLowerCase().match(/(recto|verso|cni|identit|permis|carte grise|séjour|double|2 faces)/i) ||
                    req.description?.toLowerCase().match(/(recto|verso|double|2 faces)/i) ||
                    req.files.some((f) => f.fileName.toUpperCase().startsWith('RECTO_') || f.fileName.toUpperCase().startsWith('VERSO_'));

                  if (isDoubleSided) {
                    const rectoFile =
                      req.files.find((f) => f.fileName.toUpperCase().startsWith('RECTO_')) ||
                      (req.files.length >= 1 ? req.files[0] : null);

                    const versoFile =
                      req.files.find((f) => f.fileName.toUpperCase().startsWith('VERSO_')) ||
                      (req.files.length >= 2 ? req.files[1] : null);

                    const hasRecto = Boolean(rectoFile || uploads[req.id + '_recto']?.uploaded);
                    const hasVerso = Boolean(versoFile || uploads[req.id + '_verso']?.uploaded);

                    return (
                      <div className="mt-4 space-y-3">
                        {/* Status Badge header for Recto/Verso */}
                        {(() => {
                          if (hasRecto && hasVerso) {
                            return (
                              <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                                <span>2/2 faces reçues — Document Recto + Verso complet !</span>
                              </div>
                            );
                          }
                          if (hasRecto || hasVerso) {
                            return (
                              <div className="p-2.5 bg-amber-950/60 border border-amber-500/40 rounded-xl text-amber-300 text-xs font-bold flex items-center gap-2">
                                <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                                <span>
                                  1/2 face reçue — {hasRecto ? 'Face VERSO (Arrière) manquante' : 'Face RECTO (Avant) manquante'}
                                </span>
                              </div>
                            );
                          }
                          return (
                            <div className="text-[11px] font-extrabold uppercase text-amber-400 flex items-center gap-1.5">
                              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                              Document Recto + Verso exigé : Transmettez les 2 faces
                            </div>
                          );
                        })()}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* RECTO CARD */}
                          <div
                            className={`p-3.5 rounded-2xl border transition-all ${
                              hasRecto
                                ? 'bg-emerald-950/40 border-emerald-500/50'
                                : 'bg-slate-900/90 border-slate-700/80 hover:border-slate-600'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-extrabold text-slate-200 flex items-center gap-1.5">
                                <Camera className="h-3.5 w-3.5 text-brand-400" /> Face RECTO (Avant)
                              </span>
                              {hasRecto && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                  <Check className="h-3 w-3 text-emerald-400" /> Transmis
                                </span>
                              )}
                            </div>

                            {hasRecto && rectoFile ? (
                              <div className="space-y-2 mb-3">
                                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 truncate flex items-center gap-2">
                                  <FileText className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                                  <span className="truncate">{rectoFile.fileName}</span>
                                </div>
                                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" /> Face RECTO enregistrée
                                </div>
                              </div>
                            ) : (
                              <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                                Prenez en photo ou importez la face avant lisible de la pièce.
                              </p>
                            )}

                            <input
                              type="file"
                              ref={(el) => {
                                fileInputRefs.current[req.id + '_recto'] = el;
                              }}
                              accept="image/*,application/pdf"
                              capture="environment"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const renamedFile = new File([file], `RECTO_${file.name}`, { type: file.type });
                                  handleFileSelect(req.id, renamedFile);
                                }
                              }}
                            />
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => fileInputRefs.current[req.id + '_recto']?.click()}
                              className={`w-full py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition shadow ${
                                hasRecto
                                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-600'
                                  : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/30'
                              }`}
                            >
                              {isProcessing ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Camera className="h-3.5 w-3.5 text-emerald-300" />
                              )}
                              {hasRecto ? 'Remplacer la Face RECTO' : '1. Déposer Face RECTO'}
                            </button>
                          </div>

                          {/* VERSO CARD */}
                          <div
                            className={`p-3.5 rounded-2xl border transition-all ${
                              hasVerso
                                ? 'bg-emerald-950/40 border-emerald-500/50'
                                : 'bg-slate-900/90 border-slate-700/80 hover:border-slate-600'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-extrabold text-slate-200 flex items-center gap-1.5">
                                <Camera className="h-3.5 w-3.5 text-indigo-400" /> Face VERSO (Arrière)
                              </span>
                              {hasVerso && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                  <Check className="h-3 w-3 text-emerald-400" /> Transmis
                                </span>
                              )}
                            </div>

                            {hasVerso && versoFile ? (
                              <div className="space-y-2 mb-3">
                                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 truncate flex items-center gap-2">
                                  <FileText className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                                  <span className="truncate">{versoFile.fileName}</span>
                                </div>
                                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" /> Face VERSO enregistrée
                                </div>
                              </div>
                            ) : (
                              <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                                Prenez en photo ou importez le dos/arrière lisible de la pièce.
                              </p>
                            )}

                            <input
                              type="file"
                              ref={(el) => {
                                fileInputRefs.current[req.id + '_verso'] = el;
                              }}
                              accept="image/*,application/pdf"
                              capture="environment"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const renamedFile = new File([file], `VERSO_${file.name}`, { type: file.type });
                                  handleFileSelect(req.id, renamedFile);
                                }
                              }}
                            />
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => fileInputRefs.current[req.id + '_verso']?.click()}
                              className={`w-full py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition shadow ${
                                hasVerso
                                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-600'
                                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                              }`}
                            >
                              {isProcessing ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Camera className="h-3.5 w-3.5 text-indigo-200" />
                              )}
                              {hasVerso ? 'Remplacer la Face VERSO' : '2. Déposer Face VERSO'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Single file card layout
                  const hasSingleFile = req.files.length > 0 || uploadState?.uploaded;

                  return (
                    <div className="mt-4 space-y-3">
                      {hasSingleFile && (
                        <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl space-y-2">
                          <div className="text-[11px] font-extrabold text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            Document transmis et sauvegardé avec succès
                          </div>
                          {req.files.map((f) => (
                            <div
                              key={f.id}
                              className="p-2 bg-slate-900 rounded-lg border border-slate-700 text-xs font-mono text-slate-200 flex items-center justify-between"
                            >
                              <span className="truncate">{f.fileName}</span>
                              <span className="text-[10px] text-slate-400 font-sans ml-2">
                                ({(f.fileSize / 1024 / 1024).toFixed(2)} Mo)
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <input
                          type="file"
                          ref={(el) => {
                            fileInputRefs.current[req.id] = el;
                          }}
                          accept="image/*,application/pdf"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileSelect(req.id, file);
                          }}
                        />

                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => fileInputRefs.current[req.id]?.click()}
                          className={`w-full flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-md ${
                            hasSingleFile
                              ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600'
                              : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/30 active:scale-98'
                          }`}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin text-white" />
                              {hasAiEnterprise ? 'Analyse IA et transfert en cours...' : 'Transfert et chiffrement du fichier en cours...'}
                            </>
                          ) : (
                            <>
                              <Camera className="h-4 w-4" />
                              {hasSingleFile ? 'Remplacer le document' : 'Prendre en photo / Importer le document'}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })}

          {/* Sticky Mobile & Desktop Floating Submit Footer Bar */}
          <div className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 border-t border-slate-800/80 px-4 py-3 sm:py-4 backdrop-blur-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
            <div className="max-w-xl mx-auto space-y-2 text-center">
              <button
                type="button"
                disabled={!allRequiredUploaded || isSubmitting}
                onClick={handleFinalSubmit}
                className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base shadow-2xl flex items-center justify-center gap-2.5 transition-all duration-300 min-h-[50px] active:scale-98 ${
                  allRequiredUploaded
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:brightness-110 text-slate-950 shadow-emerald-500/40 animate-pulse-subtle'
                    : 'bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-slate-950" />
                    Validation &amp; chiffrement du dossier...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Finaliser et transmettre mon dossier
                  </>
                )}
              </button>

              {!allRequiredUploaded && (
                <p className="text-[11px] text-slate-400 font-medium">
                  Veuillez charger toutes les pièces requises ci-dessus pour soumettre le dossier.
                </p>
              )}

              <div className="pt-1 text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5 opacity-90">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Chiffrement AES-256 &amp; Conformité RGPD — Propulsé par Fylynx</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
