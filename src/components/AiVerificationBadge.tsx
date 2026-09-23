'use client';

import { Sparkles, CheckCircle2, AlertTriangle, XCircle, Bot } from 'lucide-react';

interface AiResultPayload {
  confidenceScore: number;
  status: 'PASSED' | 'WARNING' | 'REJECTED';
  documentCategory: string;
  summary: string;
  checks: Array<{ label: string; passed: boolean; details?: string }>;
  rejectionReason?: string;
}

export default function AiVerificationBadge({
  aiVerified,
  aiStatus,
  aiConfidenceScore,
  aiAnalysisDetails,
}: {
  aiVerified: boolean;
  aiStatus: string | null;
  aiConfidenceScore: number | null;
  aiAnalysisDetails: string | null;
}) {
  if (!aiVerified) return null;

  let parsed: AiResultPayload | null = null;
  if (aiAnalysisDetails) {
    try {
      parsed = JSON.parse(aiAnalysisDetails);
    } catch (e) {
      // Ignore json parse error
    }
  }

  const score = aiConfidenceScore ?? parsed?.confidenceScore ?? 0;
  const isHighConfidence = score >= 80;
  const isRejected = score < 50 || parsed?.status === 'REJECTED';

  return (
    <div
      className={`p-4 rounded-xl space-y-3 text-xs border ${
        isRejected
          ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
          : isHighConfidence
          ? 'bg-slate-900 border-emerald-500/40 text-slate-200'
          : 'bg-slate-900 border-amber-500/40 text-slate-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold">
          <Bot className={`h-4 w-4 ${isRejected ? 'text-rose-400' : 'text-brand-400'}`} />
          <span className="text-white">Rapport d'Analyse IA Fylynx</span>
          {parsed?.documentCategory && (
            <span
              className={`text-[11px] font-mono px-2.5 py-0.5 rounded border font-semibold ${
                isRejected
                  ? 'bg-rose-900/60 text-rose-200 border-rose-700'
                  : 'bg-slate-800 text-brand-300 border-slate-700'
              }`}
            >
              {parsed.documentCategory}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
          <Sparkles className={`h-3.5 w-3.5 ${isRejected ? 'text-rose-400' : 'text-amber-400'}`} />
          <span className={`font-black ${isRejected ? 'text-rose-300' : 'text-emerald-300'}`}>
            {score}% Confiance
          </span>
        </div>
      </div>

      {parsed?.summary && (
        <p
          className={`leading-relaxed text-[11px] border-l-2 pl-2.5 py-0.5 ${
            isRejected
              ? 'text-rose-200 border-rose-500 bg-rose-950/30'
              : 'text-slate-300 border-brand-500'
          }`}
        >
          {parsed.summary}
        </p>
      )}

      {parsed?.rejectionReason && isRejected && (
        <div className="p-2.5 bg-rose-900/40 border border-rose-800/60 rounded-lg text-[11px] text-rose-200 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-rose-300">
            <XCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>Motif du rejet / Score bas :</span>
          </div>
          <p className="pl-5 leading-snug">{parsed.rejectionReason}</p>
        </div>
      )}

      {parsed?.checks && parsed.checks.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
          {parsed.checks.map((check, idx) => (
            <div key={idx} className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                {check.passed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                )}
                {check.label}
              </span>
              {check.details && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    check.passed
                      ? 'text-emerald-300 bg-emerald-950/40'
                      : 'text-rose-300 bg-rose-950/40 font-semibold'
                  }`}
                >
                  {check.details}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

