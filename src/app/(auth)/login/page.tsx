'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Bot,
  Sparkles,
} from 'lucide-react';
import FylynxLogo from '@/components/FylynxLogo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur de connexion');
      }

      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur de connexion';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-slate-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      {/* Left Panel - High-Tech Showcase Panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-slate-950 to-brand-950 border-r border-slate-800/80 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Logo & Back to Home Header */}
        <div className="flex items-center justify-between relative z-10">
          <FylynxLogo size="lg" variant="dark" />
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition backdrop-blur-md"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-brand-400" /> Retour à l'accueil
          </Link>
        </div>

        {/* Showcase Body */}
        <div className="space-y-8 relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-brand-300 text-xs font-bold">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Plateforme de Collecte & Certification</span>
          </div>

          <h2 className="text-4xl font-black text-white leading-tight">
            La solution intelligente pour vos dossiers clients.
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="h-9 w-9 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0 border border-brand-500/20">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Dépôt Smartphone Sans Compte</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Vos clients photographient leurs justificatifs en 1 clic sans mot de passe.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Relances Automatiques Intelligentes</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Suivi et relances automatiques par Email jusqu'à complétude du dossier.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Vérification & Détection IA</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Contrôle d'authenticité et de conformité des pièces d'identité et factures.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 text-xs text-slate-400 leading-relaxed relative z-10">
          <p className="italic">
            "Fylynx nous permet de valider nos dossiers 4 fois plus vite sans aucune relance manuelle."
          </p>
        </div>
      </div>

      {/* Right Panel - Form Container (Full Screen height) */}
      <div className="flex flex-col justify-between p-6 sm:p-12 lg:p-16 min-h-screen bg-slate-950">
        {/* Mobile Header Logo */}
        <div className="flex items-center justify-between lg:hidden mb-8">
          <FylynxLogo size="md" variant="dark" />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-brand-400" /> Accueil
          </Link>
        </div>

        <div className="my-auto max-w-md w-full mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Connexion</h1>
            <p className="text-sm text-slate-400 mt-2">
              Accédez à votre espace de gestion et à vos dossiers clients
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3.5 bg-rose-950/60 border border-rose-500/40 rounded-2xl text-rose-300 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Adresse Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="nom@entreprise.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 text-sm bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Mot de Passe
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-brand-400 hover:text-brand-300 font-semibold hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 text-sm bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:brightness-110 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-brand-600/25 flex items-center justify-center gap-2 transition glow-brand"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Connexion en cours...
                  </>
                ) : (
                  <>
                    Se Connecter <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-400">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-brand-400 font-bold hover:underline">
              Créer un compte gratuit →
            </Link>
          </p>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-600">
          © fylinx.com — Solution sécurisée de collecte documentaire B2B.
        </div>
      </div>
    </div>
  );
}

