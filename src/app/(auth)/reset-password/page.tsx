'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import FylynxLogo from '@/components/FylynxLogo';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!token) {
      setErrorMsg('Token de réinitialisation invalide ou manquant.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la réinitialisation');
      }

      setSuccessMsg(data.message);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
      {successMsg ? (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-3">
          <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Mot de passe réinitialisé !</h2>
          <p className="text-xs text-slate-300 leading-relaxed">{successMsg}</p>
          <p className="text-[11px] text-brand-400 font-semibold">Redirection vers la page de connexion...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Nouveau Mot de Passe *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-200 transition focus:outline-none"
                title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Confirmer le Mot de Passe *
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-200 transition focus:outline-none"
                title={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-extrabold rounded-xl text-sm shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Enregistrement...
              </>
            ) : (
              <>
                Réinitialiser le Mot de Passe <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <FylynxLogo size="lg" variant="dark" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Nouveau Mot de Passe</h1>
            <p className="text-sm text-slate-400">
              Saisissez votre nouveau mot de passe sécurisé
            </p>
          </div>

          <Suspense fallback={
            <div className="text-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-brand-400 mx-auto" />
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
        <div className="text-center text-[11px] text-slate-500 my-4">
          © 2026 Fylynx — Solution sécurisée de collecte documentaire B2B.
        </div>
      </div>
    </div>
  );
}
