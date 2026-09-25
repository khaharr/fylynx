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
import LanguageSelector from '@/components/LanguageSelector';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, mounted, logout, refreshUser } = useAuth();
  const { t, getLocalizedHref } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!user) {
      refreshUser();
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push(getLocalizedHref('/login'));
  };

  const isPublicPage = !pathname.includes('/dashboard') && !pathname.includes('/admin');

  const publicNavItems = [
    { name: t('nav_home'), href: '/' },
    { name: t('nav_features'), href: '/#fonctionnalites' },
    { name: t('nav_ai'), href: '/#demo-ia' },
    { name: t('nav_pricing'), href: '/#tarifs' },
  ];

  const dashboardNavItems = [
    { name: t('nav_dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('nav_templates'), href: '/dashboard/templates', icon: FileSpreadsheet },
    { name: t('nav_integrations'), href: '/dashboard/integrations', icon: Webhook },
    { name: t('nav_settings'), href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-slate-950/60 backdrop-blur-2xl border-b border-brand-500/20 shadow-2xl shadow-black/60'
            : 'bg-slate-950/40 backdrop-blur-xl border-b border-slate-800/40 shadow-lg'
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
            scrolled ? 'h-14' : 'h-16'
          }`}
        >
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
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSelector />
          {!mounted || (loading && !user) ? (
            <div className="h-8 w-20 sm:w-28 bg-slate-900/80 border border-slate-800/80 rounded-xl" />
          ) : isPublicPage ? (
            user ? (
              <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                <Link
                  href="/dashboard"
                  className="px-3 sm:px-4 py-2 bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 hover:brightness-110 text-white text-xs font-extrabold rounded-xl shadow-lg glow-brand transition flex items-center gap-1.5 whitespace-nowrap"
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
              <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition whitespace-nowrap"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-2 bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 hover:brightness-110 text-white text-xs font-extrabold rounded-xl shadow-lg glow-brand transition whitespace-nowrap"
                >
                  Essai Gratuit 14j
                </Link>
              </div>
            )
          ) : user ? (
            <>
              {user.subscriptionStatus === 'AI_ENTERPRISE' ? (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 text-xs font-bold shadow-sm whitespace-nowrap">
                  <Bot className="h-3.5 w-3.5 text-indigo-400" />
                  IA Enterprise
                </div>
              ) : user.subscriptionStatus === 'AGENCY_SCALE' ? (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 text-xs font-bold shadow-sm whitespace-nowrap">
                  <Building2 className="h-3.5 w-3.5 text-cyan-400" />
                  Agence Scale
                </div>
              ) : user.subscriptionStatus === 'PRO' ? (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 text-xs font-bold shadow-sm whitespace-nowrap">
                  <Zap className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
                  Pro Illimité
                </div>
              ) : user.isTrialActive ? (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/60 text-xs font-bold shadow-sm whitespace-nowrap">
                  ⏳ Starter ({user.trialDaysLeft || 14}j)
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 text-slate-300 border border-slate-800 text-xs font-semibold whitespace-nowrap">
                  Starter (29€)
                </div>
              )}

              <div className="flex items-center gap-2 text-slate-300 text-sm font-medium sm:border-l sm:border-slate-800 sm:pl-3">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 text-white font-black text-xs flex items-center justify-center shadow-md border border-white/10 shrink-0">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
                </div>
                <span className="hidden md:inline-block font-bold text-slate-200 text-xs truncate max-w-[100px]">{user.name}</span>
                <button
                  onClick={handleLogout}
                  title="Se déconnecter"
                  className="hidden sm:flex p-1.5 rounded-xl hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition border border-transparent hover:border-rose-800/50"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
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
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            aria-label="Menu Navigation Mobile"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 text-brand-400" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/98 backdrop-blur-3xl border-b border-slate-800/80 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top duration-200 shadow-2xl">
          {user && (
            <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 text-white font-black text-sm flex items-center justify-center shadow-md border border-white/10 shrink-0">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
              {user.subscriptionStatus === 'AI_ENTERPRISE' ? (
                <span className="px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700/60 text-[10px] font-bold shrink-0">
                  IA Enterprise
                </span>
              ) : user.subscriptionStatus === 'AGENCY_SCALE' ? (
                <span className="px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60 text-[10px] font-bold shrink-0">
                  Agence Scale
                </span>
              ) : user.subscriptionStatus === 'PRO' ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-[10px] font-bold shrink-0">
                  Pro
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-700/60 text-[10px] font-bold shrink-0">
                  Starter
                </span>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-1">
            {isPublicPage ? (
              publicNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition"
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
                        ? 'bg-brand-600/20 text-brand-300 border border-brand-500/40 shadow-sm'
                        : 'text-slate-300 hover:bg-slate-900 border border-transparent'
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

          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            {user ? (
              <div className="flex flex-col gap-2">
                {isPublicPage && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 text-white text-xs font-extrabold rounded-2xl shadow-lg text-center flex items-center justify-center gap-2"
                  >
                    Accéder au Dashboard <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2.5 px-4 bg-rose-950/40 border border-rose-800/40 hover:bg-rose-950/80 text-rose-300 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition"
                >
                  <LogOut className="h-4 w-4" />
                  Se Déconnecter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 px-4 bg-slate-900 border border-slate-800 text-slate-200 text-center text-xs font-bold rounded-2xl hover:bg-slate-850"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 px-4 bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 text-white text-center text-xs font-extrabold rounded-2xl shadow-lg"
                >
                  Essai Gratuit
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      </header>
      <div className="h-16 w-full shrink-0 pointer-events-none" aria-hidden="true" />
    </>
  );
}
