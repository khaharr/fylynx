'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import {
  Webhook,
  Zap,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Loader2,
  Key,
  ShieldCheck,
  Send,
  ExternalLink,
  Sparkles,
  Lock,
  Database,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function IntegrationsClientView({
  user,
}: {
  user: {
    id: string;
    name: string;
    email: string;
    subscriptionStatus: string;
    role?: string;
  };
}) {
  const isAdmin = user.role === 'ADMIN';
  const canUseIntegrations = user.subscriptionStatus === 'AGENCY_SCALE' || isAdmin;

  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEvents, setWebhookEvents] = useState('request.completed');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [notionToken, setNotionToken] = useState('');
  const [notionDatabaseId, setNotionDatabaseId] = useState('');
  const [hasNotionToken, setHasNotionToken] = useState(false);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    fetch('/api/user/integrations')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setWebhookUrl(data.webhookUrl || '');
          setWebhookEvents(data.webhookEvents || 'request.completed');
          setApiKey(data.apiKey || null);
          setHasNotionToken(data.hasNotionToken || false);
          setNotionDatabaseId(data.notionDatabaseId || '');
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoadingData(false));
  }, []);

  const handleSaveIntegrations = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/user/integrations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl,
          webhookEvents,
          notionToken: notionToken ? notionToken : undefined,
          notionDatabaseId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la sauvegarde');
      }

      setHasNotionToken(data.hasNotionToken);
      setStatusMessage({
        type: 'success',
        text: 'Paramètres d\'intégration Webhook & Notion enregistrés avec succès !',
      });
      setNotionToken(''); // Reset input for security
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
      setStatusMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl || !webhookUrl.startsWith('http')) {
      setStatusMessage({ type: 'error', text: 'Veuillez renseigner une URL de Webhook valide.' });
      return;
    }

    setIsTestingWebhook(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/integrations/webhook-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: data.message });
      } else {
        setStatusMessage({ type: 'error', text: data.message });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur de test Webhook';
      setStatusMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleGenerateApiKey = async () => {
    setIsGeneratingKey(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/user/integrations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generateApiKey: true }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la génération de la clé API');

      setApiKey(data.apiKey);
      setStatusMessage({
        type: 'success',
        text: 'Nouvelle clé API générée avec succès ! Gardez-la en sécurité.',
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur génération clé API';
      setStatusMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const handleCopyApiKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <Webhook className="h-4 w-4 text-emerald-400" /> Automatisation & Synchronisation CRM
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Intégrations, Webhooks & Clés API
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Connectez Fylynx à vos outils préférés (Zapier, Make, Notion, Hubspot, Salesforce) et automatisez vos flux documentaires.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-2xl text-emerald-400 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            API REST & Webhooks SSL Sécurisés
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 shadow-lg ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {!canUseIntegrations ? (
          /* Locked Teaser for Non-Scale Users */
          <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-cyan-950/40 to-slate-950 border-2 border-cyan-500/40 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs uppercase tracking-wider">
                  <Sparkles className="h-4 w-4 fill-cyan-400" /> Exclusivement disponible sur le Forfait Agence Scale (247 € / mois)
                </div>
                <h2 className="text-2xl font-black text-white">
                  Automatisations Zapier, Webhooks & Notion
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Passez à la formule <strong className="text-cyan-300">Agence Scale (247 € / mois ou 230 € / mois en annuel)</strong> pour débloquer l&apos;accès complet à l&apos;API Développeur, les Webhooks en temps réel, Notion et Zapier/Make.
                </p>
              </div>

              <Link
                href="/dashboard/settings"
                className="px-6 py-4 bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs rounded-2xl shadow-xl transition flex items-center justify-center gap-2 shrink-0 transform hover:scale-105"
              >
                <Zap className="h-4 w-4 fill-slate-950" />
                Passer à Agence Scale (247 €/mois) →
              </Link>
            </div>
          </div>
        ) : isLoadingData ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-400 mb-2" />
            Chargement de vos intégrations...
          </div>
        ) : (
          <div className="space-y-8">
            {/* 1. Webhook HTTP Config Box */}
            <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Webhook className="h-5 w-5 text-brand-400" /> Webhook HTTP (Zapier, Make, n8n, CRM Custom)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Saisissez votre URL Webhook pour recevoir une notification JSON instantanée chaque fois qu&apos;un dossier client passe à l&apos;état <strong className="text-emerald-400">COMPLET</strong>.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveIntegrations}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs rounded-2xl shadow-lg transition flex items-center gap-2 shrink-0 self-start sm:self-auto"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  Enregistrer les intégrations
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                      <span>URL du Webhook cible (Endpoint HTTP POST) *</span>
                      {webhookUrl ? (
                        <span className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Webhook Actif & Opérationnel
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Non configuré</span>
                      )}
                    </label>
                    <input
                      type="url"
                      placeholder="https://hooks.zapier.com/hooks/catch/12345/abcde ou https://hook.eu1.make.com/..."
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-700/80 rounded-2xl text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleSaveIntegrations}
                      disabled={isSaving}
                      className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs rounded-2xl shadow-lg transition flex items-center gap-2"
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                      Enregistrer & Activer le Webhook
                    </button>

                    <button
                      type="button"
                      onClick={handleTestWebhook}
                      disabled={isTestingWebhook || !webhookUrl}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold rounded-2xl transition flex items-center gap-2"
                    >
                      {isTestingWebhook ? <Loader2 className="h-4 w-4 animate-spin text-emerald-400" /> : <Send className="h-4 w-4" />}
                      Valider & Tester la Synchronisation Instantanée
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-4 p-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-300 block">
                    Événements déclencheurs automatiques
                  </span>
                  <div className="space-y-2 text-xs">
                    <label className="flex items-center gap-2 text-slate-200 font-medium cursor-pointer">
                      <input type="checkbox" checked disabled className="rounded accent-brand-500" />
                      <span>request.completed (Dossier 100% validé)</span>
                    </label>
                    <label className="flex items-center gap-2 text-slate-300 font-medium cursor-pointer">
                      <input type="checkbox" checked disabled className="rounded accent-brand-500" />
                      <span>document.validated (Document certifié)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Direct Notion Integration Box */}
            <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Database className="h-5 w-5 text-indigo-400" /> Intégration Directe Notion (Workspace & Databases)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Créez automatiquement une nouvelle entrée dans votre base de données Notion lorsqu&apos;un client complète son dossier.
                  </p>
                </div>

                {hasNotionToken ? (
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-full flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Notion Connecté
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-800 text-slate-400 border border-slate-700 text-xs font-bold rounded-full">
                    Non connecté
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200 block">
                    Notion Internal Integration Token (Jeton Secret)
                  </label>
                  <input
                    type="password"
                    placeholder="secret_xxxxxxxxxxxxxxxxxxxxxxxx"
                    value={notionToken}
                    onChange={(e) => setNotionToken(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-2xl text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                  <p className="text-[11px] text-slate-400">
                    Générez votre jeton sur{' '}
                    <a
                      href="https://www.notion.so/my-integrations"
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 underline font-bold inline-flex items-center gap-0.5"
                    >
                      notion.so/my-integrations <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200 block">
                    ID de la Base de Données Notion (Database ID)
                  </label>
                  <input
                    type="text"
                    placeholder="ex: 3a2f8b1c4d5e..."
                    value={notionDatabaseId}
                    onChange={(e) => setNotionDatabaseId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-2xl text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                  <p className="text-[11px] text-slate-400">
                    L&apos;identifiant à 32 caractères dans l&apos;URL de votre base de données Notion cible.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Developer API Keys Box */}
            <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <Key className="h-5 w-5 text-amber-400" /> Clés API Développeurs (REST API)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Utilisez votre clé API pour créer des liens de collecte par programmation et interroger les statuts.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateApiKey}
                  disabled={isGeneratingKey}
                  className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-extrabold rounded-2xl transition flex items-center gap-2"
                >
                  {isGeneratingKey ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                  {apiKey ? 'Régénérer la Clé API' : 'Générer une Clé API'}
                </button>
              </div>

              {apiKey ? (
                <div className="p-4 bg-slate-950 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-4">
                  <code className="text-xs font-mono text-amber-300 select-all truncate">{apiKey}</code>
                  <button
                    type="button"
                    onClick={handleCopyApiKey}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0"
                  >
                    {copiedKey ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    {copiedKey ? 'Copiée !' : 'Copier'}
                  </button>
                </div>
              ) : (
                <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-2xl text-center space-y-2">
                  <p className="text-xs text-slate-400">Aucune clé API développeur générée pour le moment.</p>
                  <p className="text-[11px] text-slate-500">Cliquez sur &quot;Générer une Clé API&quot; ci-dessus pour activer vos accès programmatiques.</p>
                </div>
              )}
            </div>

            {/* 4. Pre-built Templates Showcase Grid */}
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-400" /> Modèles d&apos;Intégration Prêts à l&apos;emploi
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
                  <div className="h-10 w-10 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center font-bold">
                    Zapier
                  </div>
                  <h4 className="text-sm font-bold text-white">Zapier Connector</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Connectez Fylynx à +5 000 applications via Webhooks Zapier en 2 minutes sans une ligne de code.
                  </p>
                </div>

                <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
                  <div className="h-10 w-10 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold">
                    Make
                  </div>
                  <h4 className="text-sm font-bold text-white">Make (Integromat)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Créez des scénarios complexes de traitement documentaire et d&apos;archivage automatisé.
                  </p>
                </div>

                <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
                  <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold">
                    CRM
                  </div>
                  <h4 className="text-sm font-bold text-white">HubSpot & Salesforce</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Mettez à jour le statut de vos opportunités CRM dès que les pièces justificatives sont certifiées.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
