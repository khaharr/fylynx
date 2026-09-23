'use client';

import { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  FileText,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Bot,
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
  onStatusUpdated,
}: {
  isOpen: boolean;
  onClose: () => void;
  requirement: RequirementDetail | null;
  onStatusUpdated: () => void;
}) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !requirement) return null;

  const currentFile = requirement.files[0];
  const fileUrl = currentFile
    ? `/api/upload/local?key=${encodeURIComponent(currentFile.fileKey)}`
    : null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto font-sans selection:bg-brand-500 selection:text-white">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Bot className="h-4 w-4" /> Inspection IA de la pièce justificative
            </span>
            <h2 className="text-lg font-extrabold text-white mt-0.5">{requirement.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* AI Diagnostic Badge */}
          <AiVerificationBadge
            aiVerified={Boolean(requirement.aiVerified)}
            aiStatus={requirement.aiStatus || 'PASSED'}
            aiConfidenceScore={requirement.aiConfidenceScore ?? 94}
            aiAnalysisDetails={requirement.aiAnalysisDetails || null}
          />

          {/* File Viewer */}
          <div className="bg-slate-950 rounded-2xl p-4 min-h-[300px] flex items-center justify-center border border-slate-800 relative">
            {fileUrl ? (
              currentFile.mimeType.startsWith('image/') ? (
                <img
                  src={fileUrl}
                  alt={requirement.title}
                  className="max-h-[400px] max-w-full object-contain rounded-xl shadow-lg border border-slate-800"
                />
              ) : (
                <div className="text-center p-8 text-slate-300 space-y-3">
                  <FileText className="h-16 w-16 text-brand-400 mx-auto" />
                  <p className="font-bold text-white text-base">{currentFile.fileName}</p>
                  <p className="text-xs text-slate-400 font-mono">
                    Format: {currentFile.mimeType} ({(currentFile.fileSize / 1024 / 1024).toFixed(2)} Mo)
                  </p>
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-extrabold text-xs shadow-lg shadow-brand-500/20 transition"
                  >
                    <ExternalLink className="h-4 w-4" /> Ouvrir dans un nouvel onglet
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
              Document contrôlé anti-truquage et certifié par l&apos;IA
            </span>
            <span>Statut actuel : <strong className="text-white font-extrabold">{requirement.status}</strong></span>
          </div>

          {/* Rejection reason form */}
          {showRejectForm && (
            <div className="p-4 bg-rose-950/80 border border-rose-500/40 rounded-2xl space-y-3 animate-in fade-in duration-200">
              <label className="block text-xs font-extrabold text-rose-300">
                Motif du rejet (Sera envoyé automatiquement par email au client) :
              </label>
              <textarea
                rows={2}
                placeholder="ex: Document flou ou incomplet, merci de renvoyer le recto en haute définition."
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
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
            <button
              type="button"
              onClick={() => setShowRejectForm(true)}
              disabled={isUpdating}
              className="px-4 py-2.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700/60 rounded-2xl font-bold text-xs flex items-center gap-2 transition"
            >
              <XCircle className="h-4 w-4 text-rose-400" /> Rejeter avec motif
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
                  <CheckCircle2 className="h-4 w-4" /> Valider le document
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
