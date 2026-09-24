'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import {
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
  X,
  Mail,
  Send,
  Save,
  Loader2,
  Sparkles,
  Eye,
  Info,
  Check,
} from 'lucide-react';

interface TemplateItem {
  id: string;
  name: string;
  requiredDocTypes: string[];
  createdAt: string;
}

export default function TemplatesClientView({
  initialTemplates,
}: {
  initialTemplates: TemplateItem[];
}) {
  const [activeTab, setActiveTab] = useState<'FOLDERS' | 'EMAILS'>('FOLDERS');

  // Folder templates state
  const [templates, setTemplates] = useState<TemplateItem[]>(initialTemplates);
  const [name, setName] = useState('');
  const [docTypeInput, setDocTypeInput] = useState('');
  const [docTypes, setDocTypes] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Email templates state
  const [inviteEmailSubject, setInviteEmailSubject] = useState(
    'Demande de pièces justificatives - {company_name}'
  );
  const [inviteEmailBody, setInviteEmailBody] = useState(
    'Bonjour {client_name},\n\nNous attendons la transmission de vos documents justificatifs pour valider votre dossier.\n\nCliquez sur ce lien sécurisé 1-clic pour nous les transmettre en 2 minutes depuis votre smartphone :\n{link}\n\nCordialement,\n{company_name}'
  );
  const [reminderEmailSubject, setReminderEmailSubject] = useState(
    'Rappel : Votre dossier pour {company_name} est incomplet'
  );
  const [reminderEmailBody, setReminderEmailBody] = useState(
    'Bonjour {client_name},\n\nSauf erreur de notre part, votre dossier est toujours en attente des pièces suivantes :\n{missing_docs}\n\nMerci de les déposer via votre lien sécurisé :\n{link}\n\nCordialement,\n{company_name}'
  );

  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  const [isSavingEmails, setIsSavingEmails] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch email templates on mount
  useEffect(() => {
    setIsLoadingEmails(true);
    fetch('/api/user/email-templates')
      .then((res) => res.json())
      .then((data) => {
        if (data.inviteEmailSubject) setInviteEmailSubject(data.inviteEmailSubject);
        if (data.inviteEmailBody) setInviteEmailBody(data.inviteEmailBody);
        if (data.reminderEmailSubject) setReminderEmailSubject(data.reminderEmailSubject);
        if (data.reminderEmailBody) setReminderEmailBody(data.reminderEmailBody);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoadingEmails(false));
  }, []);

  const handleAddDocType = () => {
    if (!docTypeInput.trim()) return;
    setDocTypes((prev) => [...prev, docTypeInput.trim()]);
    setDocTypeInput('');
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || docTypes.length === 0) return;

    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, requiredDocTypes: docTypes }),
      });

      if (res.ok) {
        const data = await res.json();
        setTemplates((prev) => [data.template, ...prev]);
        setName('');
        setDocTypes([]);
        setIsCreating(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEmailTemplates = async () => {
    setIsSavingEmails(true);
    setEmailStatus(null);

    try {
      const res = await fetch('/api/user/email-templates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inviteEmailSubject,
          inviteEmailBody,
          reminderEmailSubject,
          reminderEmailBody,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur de sauvegarde');

      setEmailStatus({
        type: 'success',
        message: 'Modèles d\'e-mails d\'invitation et de relance enregistrés avec succès !',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue';
      setEmailStatus({ type: 'error', message: msg });
    } finally {
      setIsSavingEmails(false);
    }
  };

  const insertVariable = (
    variable: string,
    target: 'inviteSub' | 'inviteBody' | 'remindSub' | 'remindBody'
  ) => {
    if (target === 'inviteSub') setInviteEmailSubject((prev) => prev + ` ${variable}`);
    if (target === 'inviteBody') setInviteEmailBody((prev) => prev + ` ${variable}`);
    if (target === 'remindSub') setReminderEmailSubject((prev) => prev + ` ${variable}`);
    if (target === 'remindBody') setReminderEmailBody((prev) => prev + ` ${variable}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Modèles Certifiés & Relances Intelligentes
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Gestion des Modèles & E-mails
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Préparez des configurations de dossiers types et personnalisez l&apos;objet et le corps de vos e-mails de relance.
            </p>
          </div>

          {activeTab === 'FOLDERS' && (
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-brand-500/20 flex items-center gap-2 transition self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" /> Créer un modèle de dossier
            </button>
          )}

          {activeTab === 'EMAILS' && (
            <button
              onClick={handleSaveEmailTemplates}
              disabled={isSavingEmails}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition self-start sm:self-auto shrink-0"
            >
              {isSavingEmails ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Enregistrer les e-mails
            </button>
          )}
        </div>

        {/* View Selection Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('FOLDERS')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 ${
              activeTab === 'FOLDERS'
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" /> Modèles de Dossiers ({templates.length})
          </button>
          <button
            onClick={() => setActiveTab('EMAILS')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 ${
              activeTab === 'EMAILS'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Mail className="h-4 w-4" /> ✉️ Éditeur de Modèles d&apos;E-mails & Relances
          </button>
        </div>

        {/* TAB 1: FOLDER TEMPLATES */}
        {activeTab === 'FOLDERS' && (
          <div className="space-y-8">
            {isCreating && (
              <form
                onSubmit={handleCreateTemplate}
                className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-6 rounded-3xl shadow-2xl space-y-5 max-w-2xl animate-in fade-in duration-200"
              >
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-brand-400" /> Nouveau Modèle Réutilisable
                </h2>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Nom du modèle *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Dossier Bail Habitation, Achat Auto..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Pièces requises par défaut
                  </label>
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="ex: Bulletin de salaire (-1 mois)"
                      value={docTypeInput}
                      onChange={(e) => setDocTypeInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddDocType();
                        }
                      }}
                      className="flex-1 px-4 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddDocType}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-xs font-extrabold border border-slate-700 transition"
                    >
                      Ajouter
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {docTypes.map((dt, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-500/10 text-brand-300 border border-brand-500/30 rounded-xl text-xs font-bold"
                      >
                        {dt}
                        <button
                          type="button"
                          onClick={() => setDocTypes(docTypes.filter((_, i) => i !== idx))}
                          className="hover:text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-brand-500/20"
                  >
                    Enregistrer le modèle
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-4 flex flex-col justify-between hover:border-slate-700 transition"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                        <FileSpreadsheet className="h-5 w-5" />
                      </div>
                      <h3 className="font-extrabold text-white text-base">{tpl.name}</h3>
                    </div>

                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        {tpl.requiredDocTypes.length} pièces configurées :
                      </span>
                      <ul className="space-y-2 text-xs text-slate-300 font-medium">
                        {tpl.requiredDocTypes.map((dt, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                            {dt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>Créé le {new Date(tpl.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: EMAIL TEMPLATE EDITOR */}
        {activeTab === 'EMAILS' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {emailStatus && (
              <div
                className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
                  emailStatus.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {emailStatus.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : (
                  <Info className="h-4 w-4 text-rose-400 shrink-0" />
                )}
                {emailStatus.message}
              </div>
            )}

            {isLoadingEmails ? (
              <div className="py-20 text-center text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-brand-400" />
                <span>Chargement des modèles d&apos;e-mails...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Editor Column */}
                <div className="lg:col-span-7 space-y-8">
                  {/* Template 1: E-mail d'Invitation Initial */}
                  <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold">
                          <Send className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-white text-base">E-mail d&apos;Invitation Initial</h3>
                          <p className="text-xs text-slate-400">Envoyé lors de la création d&apos;un nouveau dossier client</p>
                        </div>
                      </div>
                    </div>

                    {/* Variable Quick Tags */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Insérer des variables dynamiques :
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {['{client_name}', '{company_name}', '{link}'].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => insertVariable(v, 'inviteBody')}
                            className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-brand-300 border border-slate-800 hover:border-brand-500/50 rounded-lg text-xs font-mono transition"
                          >
                            + {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                        Objet du mail *
                      </label>
                      <input
                        type="text"
                        value={inviteEmailSubject}
                        onChange={(e) => setInviteEmailSubject(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-semibold text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>

                    {/* Body */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                        Corps du texte d&apos;invitation *
                      </label>
                      <textarea
                        rows={6}
                        value={inviteEmailBody}
                        onChange={(e) => setInviteEmailBody(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-slate-200 focus:outline-none focus:border-brand-500 leading-relaxed resize-none"
                      />
                    </div>
                  </div>

                  {/* Template 2: E-mail de Relance Automatique / Manuelle */}
                  <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-6 rounded-3xl shadow-xl space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                          <Mail className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-white text-base">E-mail de Relance Automatique</h3>
                          <p className="text-xs text-slate-400">Envoyé lors des relances automatiques quotidiennes (Pro/Enterprise)</p>
                        </div>
                      </div>
                    </div>

                    {/* Variable Quick Tags */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Insérer des variables dynamiques :
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {['{client_name}', '{company_name}', '{missing_docs}', '{link}'].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => insertVariable(v, 'remindBody')}
                            className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-amber-300 border border-slate-800 hover:border-amber-500/50 rounded-lg text-xs font-mono transition"
                          >
                            + {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                        Objet de la relance *
                      </label>
                      <input
                        type="text"
                        value={reminderEmailSubject}
                        onChange={(e) => setReminderEmailSubject(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Body */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                        Corps du texte de relance *
                      </label>
                      <textarea
                        rows={6}
                        value={reminderEmailBody}
                        onChange={(e) => setReminderEmailBody(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Email Preview Column */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Eye className="h-4 w-4 text-emerald-400" /> Aperçu du Mail de Relance Client
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      Rendu Final HTML
                    </span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
                    {/* Mail Client Header */}
                    <div className="space-y-2 pb-3 border-b border-slate-800">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>De : <strong className="text-slate-200 font-mono">notifications@fylinx.com</strong></span>
                        <span className="text-[10px] text-slate-500">Aujourd&apos;hui 09:00</span>
                      </div>
                      <div className="text-xs text-slate-400">
                        À : <strong className="text-slate-200 font-mono">client.exemple@mail.com</strong>
                      </div>
                      <div className="text-sm font-extrabold text-white pt-1">
                        Objet: {reminderEmailSubject.replace('{company_name}', 'Votre Cabinet')}
                      </div>
                    </div>

                    {/* Mail Body Render Card */}
                    <div className="bg-white text-slate-900 rounded-2xl p-5 shadow-lg space-y-4 text-xs font-sans leading-relaxed">
                      <div className="border-b-2 border-indigo-600 pb-2 text-center">
                        <h4 className="text-lg font-black text-indigo-600 tracking-tight">FYLYNX<span className="text-sky-500">.app</span></h4>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Collecte Documentaire Sécurisée</p>
                      </div>

                      <div className="whitespace-pre-line text-slate-700">
                        {reminderEmailBody
                          .replace('{client_name}', 'Khalid Harrari')
                          .replace('{company_name}', 'Cabinet Immobilier')
                          .replace('{missing_docs}', '• Pièce d\'identité CNI / Passeport\n• Avis d\'imposition (-12 mois)')
                          .replace('{link}', 'https://fylinx.com/d/demo-123')}
                      </div>

                      <div className="text-center pt-2">
                        <span className="inline-block bg-indigo-600 text-white font-extrabold py-2.5 px-6 rounded-xl text-xs shadow-md">
                          Transmettre mes pièces en 1 Clic →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RGPD Footer Banner */}
        <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
          <div className="space-y-0.5">
            <span className="font-extrabold text-slate-200 text-sm">Protection des Données & Conformité RGPD</span>
            <p className="text-slate-400">
              Tous vos modèles de collecte et e-mails respectent le principe de minimisation des données (Article 5 du RGPD). Seules les pièces justificatives strictement nécessaires sont demandées à vos clients.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
