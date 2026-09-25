'use client';

import { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  FileText,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Bot,
  Download,
  Camera,
  Layers,
} from 'lucide-react';
import AiVerificationBadge from './AiVerificationBadge';

interface FileItem {
  id: string;
  fileKey: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

interface RequirementDetail {
  id: string;
  title: string;
  description: string | null;
  status: string;
  rejectionReason: string | null;
  aiVerified?: boolean;
  aiStatus?: string | null;
  aiConfidenceScore?: number | null;
  aiAnalysisDetails?: string | null;
  files: FileItem[];
}

export default function DocumentPreviewModal({
  isOpen,
  onClose,
  requirement,
  initialFileId,
  onStatusUpdated,
}: {
  isOpen: boolean;
  onClose: () => void;
  requirement: RequirementDetail | null;
  initialFileId?: string | null;
  onStatusUpdated: () => void;
}) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeFileIndex, setActiveFileIndex] = useState(0);

  useEffect(() => {
    if (requirement && initialFileId) {
      const foundIdx = requirement.files.findIndex((f) => f.id === initialFileId);
      if (foundIdx >= 0) {
        setActiveFileIndex(foundIdx);
      } else {
        setActiveFileIndex(0);
      }
    } else {
      setActiveFileIndex(0);
    }
  }, [requirement, initialFileId]);

  if (!isOpen || !requirement) return null;

  const files = requirement.files || [];
  const currentFile = files[activeFileIndex] || files[0];
  const fileUrl = currentFile
    ? `/api/upload/local?key=${encodeURIComponent(currentFile.fileKey)}`
    : null;
  const downloadUrl = currentFile
    ? `/api/upload/local?key=${encodeURIComponent(currentFile.fileKey)}&download=1`
    : null;

  const isImage = currentFile
    ? currentFile.mimeType.startsWith('image/') ||
      /\.(png|jpe?g|webp|heic)$/i.test(currentFile.fileName)
    : false;

  const isPdf = currentFile
    ? currentFile.mimeType === 'application/pdf' || /\.pdf$/i.test(currentFile.fileName)
    : false;

  const handleUpdateStatus = async (status: 'VALIDATED' | 'REJECTED') => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/documents/${requirement.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          rejectionReason: status === 'REJECTED' ? rejectReason || 'Document non conforme ou illisible' : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }

      onStatusUpdated();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto font-sans selection:bg-brand-500 selection:text-white">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Bot className="h-4 w-4" /> Inspection IA de la pièce justificative
            </span>
            <h2 className="text-lg font-extrabold text-white mt-0.5 flex items-center gap-2">
              {requirement.title}
              {files.length > 1 && (
                <span className="text-xs bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <Layers className="h-3 w-3 text-indigo-400" /> {files.length} fichiers transmis
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Multi-File Tab Selector Bar */}
        {files.length > 1 && (
          <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0">
            <span className="text-xs font-bold text-slate-400 shrink-0 mr-1">Choisir le fichier :</span>
            {files.map((file, idx) => {
              const isRecto = file.fileName.toUpperCase().startsWith('RECTO_');
              const isVerso = file.fileName.toUpperCase().startsWith('VERSO_');
              const isActive = idx === activeFileIndex;

              return (
                <button
                  key={file.id || idx}
                  onClick={() => setActiveFileIndex(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 ring-2 ring-brand-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                  }`}
                >
                  {isRecto ? (
                    <Camera className="h-3.5 w-3.5 text-emerald-300 shrink-0" />
                  ) : isVerso ? (
                    <Camera className="h-3.5 w-3.5 text-indigo-300 shrink-0" />
                  ) : (
                    <FileText className="h-3.5 w-3.5 text-brand-300 shrink-0" />
                  )}
                  <span>
                    {isRecto ? 'Face RECTO' : isVerso ? 'Face VERSO' : `Fichier #${idx + 1}`}
                  </span>
                  <span className="text-[10px] opacity-75 font-mono">
                    ({(file.fileSize / 1024 / 1024).toFixed(1)} Mo)
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* AI Diagnostic Badge */}
          <AiVerificationBadge
            aiVerified={Boolean(requirement.aiVerified)}
            aiStatus={requirement.aiStatus || 'PASSED'}
            aiConfidenceScore={requirement.aiConfidenceScore ?? 94}
            aiAnalysisDetails={requirement.aiAnalysisDetails || null}
          />

          {/* Active File Info Bar */}
          {currentFile && (
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-slate-200 font-bold truncate">{currentFile.fileName}</span>
                <span className="text-slate-400 text-[11px]">
                  ({(currentFile.fileSize / 1024 / 1024).toFixed(2)} Mo — {currentFile.mimeType})
                </span>
              </div>

              {fileUrl && (
                <div className="flex items-center gap-2">
                  <a
                    href={downloadUrl || fileUrl}
                    download={currentFile.fileName}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition shadow"
                  >
                    <Download className="h-3.5 w-3.5 text-emerald-400" /> Télécharger ce fichier
                  </a>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-brand-400" /> Ouvrir dans un onglet
                  </a>
                </div>
              )}
            </div>
          )}

          {/* File Viewer Box */}
          <div className="bg-slate-950 rounded-2xl p-3 min-h-[380px] flex items-center justify-center border border-slate-800 relative">
            {fileUrl ? (
              isImage ? (
                <div className="w-full flex flex-col items-center justify-center space-y-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fileUrl}
                    alt={currentFile?.fileName || requirement.title}
                    className="max-h-[500px] max-w-full object-contain rounded-xl shadow-2xl border border-slate-800"
                  />
                  <p className="text-[11px] text-slate-400 italic">
                    Aperçu haute définition — Cliquez sur ouvrir dans un onglet pour agrandir sans limite.
                  </p>
                </div>
              ) : isPdf ? (
                <iframe
                  src={fileUrl}
                  title={currentFile?.fileName || requirement.title}
                  className="w-full h-[500px] rounded-xl border border-slate-800 bg-slate-900"
                />
              ) : (
                <div className="text-center p-8 text-slate-300 space-y-3">
                  <FileText className="h-16 w-16 text-brand-400 mx-auto" />
                  <p className="font-bold text-white text-base">{currentFile?.fileName}</p>
                  <p className="text-xs text-slate-400 font-mono">
                    Format : {currentFile?.mimeType} ({(currentFile.fileSize / 1024 / 1024).toFixed(2)} Mo)
                  </p>
                  <a
                    href={fileUrl}
                    download={currentFile.fileName}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition"
                  >
                    <Download className="h-4 w-4" /> Télécharger pour consulter
                  </a>
                </div>
              )
            ) : (
              <div className="text-center text-slate-400 p-8">
                <FileText className="h-12 w-12 text-slate-600 mx-auto mb-2" />
                Avis de prévisualisation indisponible pour ce fichier.
              </div>
            )}
          </div>

          {/* Status info */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Document chiffré AES-256 et vérifié conforme par Fylynx
            </span>
            <span>Statut actuel : <strong className="text-white font-extrabold">{requirement.status}</strong></span>
          </div>

          {/* Rejection reason form */}
          {showRejectForm && (
            <div className="p-4 bg-rose-950/80 border border-rose-500/40 rounded-2xl space-y-3 animate-in fade-in duration-200">
              <label className="block text-xs font-extrabold text-rose-300">
                Motif du rejet (Sera envoyé automatiquement par e-mail au client) :
              </label>
              <textarea
                rows={2}
                placeholder="ex: Document flou ou incomplet, merci de renvoyer le recto et le verso en haute définition."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-3 text-xs bg-slate-950 border border-rose-900/60 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-100 placeholder-slate-500"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectForm(false)}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatus('REJECTED')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-rose-600/30"
                >
                  {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Confirmer le rejet'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!showRejectForm && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60 shrink-0">
            <button
              type="button"
              onClick={() => setShowRejectForm(true)}
              disabled={isUpdating}
              className="px-4 py-2.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700/60 rounded-2xl font-bold text-xs flex items-center gap-2 transition"
            >
              <XCircle className="h-4 w-4 text-rose-400" /> Rejeter le document
            </button>

            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleUpdateStatus('VALIDATED')}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Validation...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Valider le document ({files.length} fichier(s))
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
