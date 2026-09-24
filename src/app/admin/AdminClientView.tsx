'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  ShieldCheck,
  Folder,
  Zap,
  Bot,
  Building2,
  CheckCircle2,
  Clock,
  Search,
  Loader2,
} from 'lucide-react';

interface UserAdminItem {
  id: string;
  name: string;
  email: string;
  companyName: string | null;
  role: string;
  subscriptionStatus: string;
  createdAt: string;
  requestCount: number;
}

interface RequestAdminItem {
  id: string;
  clientName: string;
  clientEmail: string;
  token: string;
  status: string;
  createdAt: string;
  userName: string;
  userEmail: string;
  docCount: number;
}

export default function AdminClientView({
  initialUsers,
  initialRequests,
  googleDriveConnected = false,
}: {
  initialUsers: UserAdminItem[];
  initialRequests: RequestAdminItem[];
  googleDriveConnected?: boolean;
}) {
  const [users, setUsers] = useState<UserAdminItem[]>(initialUsers);
  const [requests, setRequests] = useState<RequestAdminItem[]>(initialRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'USERS' | 'REQUESTS'>('USERS');

  const handleStatusChange = async (userId: string, newStatus: string) => {
    setUpdatingId(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subscriptionStatus: newStatus }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, subscriptionStatus: newStatus } : u))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.companyName && u.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-purple-950/60 to-slate-900 text-white p-6 rounded-3xl border border-purple-500/30 shadow-2xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" /> Espace Administrateur HQ
            </div>
            <h1 className="text-2xl font-extrabold">Gestion Globale du SaaS Fylynx</h1>
            <p className="text-xs text-slate-300">
              Compte Administrateur principal (info@fylynx.com) — Contrôle total des utilisateurs, abonnements et stockage Google Drive Master.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('USERS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'USERS' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Utilisateurs ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('REQUESTS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'REQUESTS' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dossiers ({requests.length})
            </button>
          </div>
        </div>

        {/* Master Google Drive Banner */}
        <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-purple-300 uppercase tracking-wider bg-purple-500/20 px-2 py-0.5 rounded-md border border-purple-500/30">
                Stockage Centralisé Admin HQ
              </span>
              {googleDriveConnected ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Google Drive Master Connecté (5 To)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                  <Clock className="h-3.5 w-3.5 text-amber-400" /> Connexion Google Drive Requise
                </span>
              )}
            </div>
            <h2 className="text-lg font-extrabold text-white">Google Drive Master HQ</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Toutes les pièces déposées par l&apos;ensemble des clients de votre plateforme sont automatiquement enregistrées et structurées dans votre dossier Google Drive principal (ID: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-brand-300 font-mono border border-slate-800">1ppYNq0gbcyrInPmO_acuZUW8dRWUPh-W</code>).
            </p>
          </div>

          <a
            href="/api/auth/google-drive"
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold shadow-lg transition whitespace-nowrap ${
              googleDriveConnected
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                : 'bg-brand-500 hover:bg-brand-400 text-slate-950 shadow-brand-500/20'
            }`}
          >
            <Folder className="h-4 w-4" />
            {googleDriveConnected ? 'Reconnecter Google Drive Master' : 'Connecter mon Google Drive Master'}
          </a>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur, email ou entreprise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-900 border border-slate-800 rounded-2xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        {activeTab === 'USERS' ? (
          /* Users Management Table */
          <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-extrabold uppercase text-slate-400">
                    <th className="py-4 px-6">Utilisateur Pro</th>
                    <th className="py-4 px-6">Rôle</th>
                    <th className="py-4 px-6">Dossiers Créés</th>
                    <th className="py-4 px-6">Statut Abonnement Stripe</th>
                    <th className="py-4 px-6">Date Inscription</th>
                    <th className="py-4 px-6 text-right">Action Admin Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-4 px-6">
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-xs text-slate-400">{u.email}</div>
                        {u.companyName && (
                          <div className="text-[11px] text-brand-400 font-semibold">{u.companyName}</div>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        {u.role === 'ADMIN' ? (
                          <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-extrabold rounded-full">
                            ADMIN
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium rounded-full">
                            PRO
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 font-bold text-slate-200">{u.requestCount} dossiers</td>

                      <td className="py-4 px-6">
                        {u.subscriptionStatus === 'AI_ENTERPRISE' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-extrabold rounded-full">
                            <Bot className="h-3.5 w-3.5 text-indigo-400" /> IA Enterprise (149€)
                          </span>
                        ) : u.subscriptionStatus === 'AGENCY_SCALE' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-extrabold rounded-full">
                            <Building2 className="h-3.5 w-3.5 text-cyan-400" /> Agence Scale (247€ / 230€)
                          </span>
                        ) : u.subscriptionStatus === 'PRO' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-extrabold rounded-full">
                            <Zap className="h-3.5 w-3.5 fill-emerald-400" /> Pro (79€)
                          </span>
                        ) : u.subscriptionStatus === 'STARTER' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-500/20 text-brand-300 border border-brand-500/40 text-xs font-bold rounded-full">
                            Starter (Essai 14j)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold rounded-full">
                            Inactif / Expiré
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-xs font-mono text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <select
                          disabled={updatingId === u.id}
                          value={u.subscriptionStatus}
                          onChange={(e) => handleStatusChange(u.id, e.target.value)}
                          className="px-3 py-1.5 border border-slate-700 rounded-xl text-xs font-bold bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                          <option value="STARTER">Starter (29€ - Essai 14j)</option>
                          <option value="PRO">Forfait Pro (79€)</option>
                          <option value="AGENCY_SCALE">Agence Scale (247€ / 230€)</option>
                          <option value="AI_ENTERPRISE">Forfait IA Enterprise (149€)</option>
                          <option value="CANCELED">Bloquer / Résilié / Expiré</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* All Requests Overview */
          <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-extrabold uppercase text-slate-400">
                    <th className="py-4 px-6">Client Déposant</th>
                    <th className="py-4 px-6">Professionnel Émetteur</th>
                    <th className="py-4 px-6">Statut Dossier</th>
                    <th className="py-4 px-6">Pièces</th>
                    <th className="py-4 px-6 text-right">Lien Déposant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-4 px-6">
                        <div className="font-bold text-white">{r.clientName}</div>
                        <div className="text-xs text-slate-400">{r.clientEmail}</div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-200">{r.userName}</div>
                        <div className="text-xs text-slate-400">{r.userEmail}</div>
                      </td>

                      <td className="py-4 px-6">
                        {r.status === 'COMPLETED' ? (
                          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-full">
                            Validé
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-full">
                            {r.status}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 font-semibold text-slate-300">{r.docCount} demandées</td>

                      <td className="py-4 px-6 text-right font-mono text-xs">
                        <Link
                          href={`/d/${r.token}`}
                          target="_blank"
                          className="text-brand-400 font-bold hover:underline"
                        >
                          /d/{r.token.slice(0, 10)}...
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RGPD Badge */}
        <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
          <div className="space-y-0.5">
            <span className="font-extrabold text-slate-200 text-sm">Contrôle Administrateur Sécurisé & RGPD</span>
            <p className="text-slate-400">
              L&apos;accès à cet espace est strictement consigné. Tous les utilisateurs inscrits sur la plateforme bénéficient de la protection des données conformément au RGPD UE 2016/679.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
