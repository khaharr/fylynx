'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Settings,
  LogOut,
  Zap,
  Bot,
  Building2,
  ShieldCheck,
  Webhook,
  Sparkles,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';
import FylynxLogo from '@/components/FylynxLogo';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, mounted, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const isPublicPage = !pathname.startsWith('/dashboard') && !pathname.startsWith('/admin');

  const publicNavItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Fonctionnalités', href: '/#fonctionnalites' },
    { name: 'Inspection IA', href: '/#demo-ia' },
    { name: 'Tarifs', href: '/#tarifs' },
  ];

  const dashboardNavItems = [
    { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Modèles', href: '/dashboard/templates', icon: FileSpreadsheet },
    { name: 'Intégrations & API', href: '/dashboard/integrations', icon: Webhook },
    { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <FylynxLogo size="md" variant="dark" href={isPublicPage ? '/' : '/dashboard'} />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {isPublicPage ? (
              publicNavItems.map((item) => {
                const isActive = pathname === item.href || (item.href === '/blog' && pathname.startsWith('/blog'));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-brand-600/20 text-brand-300 border border-brand-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })
            ) : (
              dashboardNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href === '/blog' && pathname.startsWith('/blog'));
                const isIntegrations = item.href === '/dashboard/integrations';
                const canAccessIntegrations = user?.subscriptionStatus === 'AGENCY_SCALE' || user?.role === 'ADMIN';

                if (isIntegrations && !canAccessIntegrations) {
                  return null;
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-brand-600/20 text-brand-300 border border-brand-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-brand-400' : 'text-slate-500'}`} />
                    {item.name}
                  </Link>
                );
              })
            )}

            {!isPublicPage && user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
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

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {!mounted || (loading && !user) ? (
            <div className="h-8 w-28 bg-slate-900/80 border border-slate-800/80 rounded-xl" />
          ) : isPublicPage ? (
            user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 hover:brightness-110 text-white text-xs font-extrabold rounded-xl shadow-lg glow-brand transition flex items-center gap-1.5"
                >
                  Mon Dashboard <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <button
                  onClick={handleLogout}
                  title="Se déconnecter"
                  className="p-2 rounded-xl hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition border border-slate-800"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 hover:brightness-110 text-white text-xs font-extrabold rounded-xl shadow-lg glow-brand transition"
                >
                  Essai Gratuit 14j
                </Link>
              </div>
            )
          ) : user ? (
            <>
              {user.subscriptionStatus === 'AI_ENTERPRISE' ? (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 text-xs font-bold shadow-sm">
                  <Bot className="h-3.5 w-3.5 text-indigo-400" />
                  IA Enterprise
                </div>
              ) : user.subscriptionStatus === 'AGENCY_SCALE' ? (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 text-xs font-bold shadow-sm">
                  <Building2 className="h-3.5 w-3.5 text-cyan-400" />
                  Agence Scale
                </div>
              ) : user.subscriptionStatus === 'PRO' ? (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 text-xs font-bold shadow-sm">
                  <Zap className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
                  Pro Illimité
                </div>
              ) : user.isTrialActive ? (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/60 text-xs font-bold shadow-sm">
                  ⏳ Essai Starter ({user.trialDaysLeft || 14}j)
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800 text-xs font-semibold">
                  Starter (29€)
                </div>
              )}

              <div className="flex items-center gap-2 text-slate-300 text-sm font-medium border-l border-slate-800 pl-3">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 text-white font-black text-xs flex items-center justify-center shadow-md border border-white/10">
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
                className="px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 hover:brightness-110 text-white text-xs font-extrabold rounded-xl shadow-lg glow-brand transition"
              >
                Essai Gratuit 14j
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 gap-1">
            {isPublicPage ? (
              publicNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-slate-300 hover:bg-slate-900"
                >
                  {item.name}
                </Link>
              ))
            ) : (
              dashboardNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href === '/blog' && pathname.startsWith('/blog'));
                const isIntegrations = item.href === '/dashboard/integrations';
                const canAccessIntegrations = user?.subscriptionStatus === 'AGENCY_SCALE' || user?.role === 'ADMIN';

                if (isIntegrations && !canAccessIntegrations) return null;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-brand-600/20 text-brand-300 border border-brand-500/40'
                        : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="h-4 w-4 text-brand-400" />
                    {item.name}
                  </Link>
                );
              })
            )}

            {!isPublicPage && user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-purple-300 bg-purple-950/60 border border-purple-500/40"
              >
                <ShieldCheck className="h-4 w-4 text-purple-400" />
                Admin HQ
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
