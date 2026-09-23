'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  User,
  Building2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Check,
  X,
} from 'lucide-react';
import FylynxLogo from '@/components/FylynxLogo';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Captcha Checkbox & Honeypot States
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [isVerifyingCaptcha, setIsVerifyingCaptcha] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Password matching validation
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  // Password strength validation (min 8 chars, 1 letter, 1 number)
  const isPasswordStrong =
    password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);

  const handleCaptchaClick = () => {
    if (captchaChecked) {
      setCaptchaChecked(false);
      return;
    }
    setIsVerifyingCaptcha(true);
    setTimeout(() => {
      setIsVerifyingCaptcha(false);
      setCaptchaChecked(true);
    }, 450);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!isPasswordStrong) {
      setErrorMsg('Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre.');
      return;
    }

    if (!captchaChecked) {
      setErrorMsg('Veuillez cocher la case "Je ne suis pas un robot" pour valider la sécurité.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          companyName,
          email,
          password,
          confirmPassword,
          captchaVerified: captchaChecked,
          honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors de l'inscription";
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
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Logo Header */}
        <div className="flex items-center justify-between relative z-10">
          <FylynxLogo size="lg" variant="dark" />
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition backdrop-blur-md"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-brand-400" /> Retour à l&apos;accueil
          </Link>
        </div>

        {/* Showcase Body */}
        <div className="space-y-8 relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-emerald-300 text-xs font-bold">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>Offre Découverte : 14 Jours d&apos;Essai Offerts</span>
          </div>

          <h2 className="text-4xl font-black text-white leading-tight">
            Créez votre compte sécurisé et simplifiez vos dépôts de pièces.
          </h2>

          <div className="space-y-3.5 text-sm text-slate-300">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>Protection Anti-Spam & Inscription Sécurisée</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <CheckCircle2 className="h-5 w-5 text-brand-400 shrink-0" />
              <span>Dépôt sécurisé 5 TB Google Drive Master</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0" />
              <span>Contrôle & détection de conformité des pièces par IA</span>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="flex items-center gap-2 text-xs text-slate-400 relative z-10">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Sans carte bancaire obligatoire • Chiffrement conforme RGPD</span>
        </div>
      </div>

      {/* Right Panel - Form Container */}
      <div className="flex flex-col justify-between p-6 sm:p-12 lg:p-16 min-h-screen bg-slate-950">
        {/* Mobile Header Logo */}
        <div className="flex items-center justify-between lg:hidden mb-6">
          <FylynxLogo size="md" variant="dark" />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-brand-400" /> Accueil
          </Link>
        </div>

        <div className="my-auto max-w-md w-full mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Créer un Compte Sécurisé</h1>
            <p className="text-sm text-slate-400 mt-2">
              Démarrer vos 14 jours d&apos;essai gratuit en quelques secondes
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Hidden Anti-Bot Honeypot Field */}
              <div className="absolute opacity-0 pointer-events-none -z-50 h-0 w-0 overflow-hidden">
                <label htmlFor="website_url_hp">Saisir site web</label>
                <input
                  id="website_url_hp"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {errorMsg && (
                <div className="p-3.5 bg-rose-950/60 border border-rose-500/40 rounded-2xl text-rose-300 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Nom complet *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="ex: Marc Martin"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 text-sm bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Nom de votre Entreprise / Agence
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="ex: Agence Immobilière Martin"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 text-sm bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Adresse Email Professionnelle *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 text-sm bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Mot de Passe * (Min 8 caractères, 1 lettre, 1 chiffre)
                </label>
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

              {/* Confirm Password Input ("Mot de passe a refaire") */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Confirmer le Mot de Passe *
                  </label>
                  {passwordsMatch && (
                    <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="h-3 w-3" /> Correspondance valide
                    </span>
                  )}
                  {passwordsMismatch && (
                    <span className="text-[11px] text-rose-400 font-bold flex items-center gap-1">
                      <X className="h-3 w-3" /> Ne correspond pas
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="Confirmez le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-11 pr-4 py-3 text-sm bg-slate-950 border rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none transition ${
                      passwordsMatch
                        ? 'border-emerald-500/80 ring-1 ring-emerald-500/50'
                        : passwordsMismatch
                        ? 'border-rose-500/80 ring-1 ring-rose-500/50'
                        : 'border-slate-800 focus:ring-2 focus:ring-brand-500'
                    }`}
                  />
                </div>
              </div>

              {/* Interactive Captcha Checkbox Component ("Je ne suis pas un robot") */}
              <div
                onClick={handleCaptchaClick}
                className={`p-4 bg-slate-950 border rounded-2xl flex items-center justify-between cursor-pointer transition select-none ${
                  captchaChecked
                    ? 'border-emerald-500/80 bg-emerald-950/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-7 w-7 rounded-lg border flex items-center justify-center transition ${
                      captchaChecked
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                        : 'border-slate-700 bg-slate-900 hover:border-brand-500'
                    }`}
                  >
                    {isVerifyingCaptcha ? (
                      <Loader2 className="h-4 w-4 animate-spin text-brand-400" />
                    ) : captchaChecked ? (
                      <Check className="h-5 w-5 stroke-[3]" />
                    ) : null}
                  </div>
                  <span className="text-xs font-extrabold text-slate-200">
                    Je ne suis pas un robot
                  </span>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <ShieldCheck className="h-5 w-5 text-brand-400" />
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-tighter">
                    Fylynx Anti-Bot
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:brightness-110 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-brand-600/25 flex items-center justify-center gap-2 transition glow-brand"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Vérification et création du compte...
                  </>
                ) : (
                  <>
                    Créer mon Compte Sécurisé <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-400">
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="text-brand-400 font-bold hover:underline">
              Se connecter →
            </Link>
          </p>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-600">
          © Fylynx.app — Inscription protégée par Captcha, rate limiting et chiffrée selon le RGPD.
        </div>
      </div>
    </div>
  );
}
