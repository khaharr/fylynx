'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileSpreadsheet, Settings, LogOut, Zap, Bot, ShieldCheck } from 'lucide-react';
import FylynxLogo from '@/components/FylynxLogo';

interface UserSession {
  id: string;
  name: string;
  email: string;
  companyName: string | null;
  role: string;
  subscriptionStatus: string;
  isTrialActive?: boolean;
  trialDaysLeft?: number;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  };

  const navItems = [
    { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Modèles', href: '/dashboard/templates', icon: FileSpreadsheet },
    { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <FylynxLogo size="md" variant="dark" href="/dashboard" />

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-brand-400' : 'text-slate-500'}`} />
                  {item.name}
                </Link>
              );
            })}

            {user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  pathname === '/admin'
                    ? 'bg-purple-900/60 text-purple-200 border border-purple-500/40'
                    : 'text-purple-400 hover:bg-purple-950/50'
                }`}
              >
                <ShieldCheck className="h-4 w-4 text-purple-400" />
                Admin HQ
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.subscriptionStatus === 'AI_ENTERPRISE' ? (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 text-xs font-bold shadow-sm">
                  <Bot className="h-3.5 w-3.5 text-indigo-400" />
                  IA Enterprise
                </div>
              ) : user.subscriptionStatus === 'PRO' ? (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 text-xs font-bold shadow-sm">
                  <Zap className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
                  Formule Pro (79€)
                </div>
              ) : user.isTrialActive ? (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/60 text-xs font-bold shadow-sm">
                  ⏳ Essai Starter ({user.trialDaysLeft || 14}j restants)
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800 text-xs font-semibold">
                  Formule Starter (29€)
                </div>
              )}

              <div className="flex items-center gap-2 text-slate-300 text-sm font-medium border-l border-slate-800 pl-3">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md border border-white/10">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
                </div>
                <span className="hidden sm:inline-block font-bold text-slate-200 text-xs">{user.name}</span>
                <button
                  onClick={handleLogout}
                  title="Se déconnecter"
                  className="p-1.5 rounded-xl hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition border border-transparent hover:border-rose-800/50"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:brightness-110 text-white text-xs font-extrabold rounded-xl shadow-md glow-brand"
              >
                Inscription
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
