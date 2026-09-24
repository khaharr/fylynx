'use client';

import { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Send,
  Copy,
  Check,
  Mail,
  User,
  FileCheck,
  Sparkles,
  Loader2,
  Link2,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Zap,
  Layers,
} from 'lucide-react';

interface TemplateItem {
  id: string;
  name: string;
  requiredDocTypes: string[];
}

export default function CreateFolderModal({
  isOpen,
  onClose,
  onCreated,
  templates,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  templates: TemplateItem[];
}) {
  const [mode, setMode] = useState<'QUICK_LINK' | 'DIRECT_SEND'>('QUICK_LINK');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [documentTitles, setDocumentTitles] = useState<string[]>([
    'Pièce d\'identité (CNI / Passeport) (Recto + Verso)',
    'Justificatif de domicile (-3 mois)',
  ]);
  const [customTitle, setCustomTitle] = useState('');
  const [isRectoVerso, setIsRectoVerso] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [sendNotification, setSendNotification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (!templateId) return;
    const found = templates.find((t) => t.id === templateId);
    if (found && Array.isArray(found.requiredDocTypes)) {
      setDocumentTitles(found.requiredDocTypes);
    }
  };

  const handleAddTitle = () => {
    if (!customTitle.trim()) return;
    const baseTitle = customTitle.trim();
    const rvTag = isRectoVerso ? ' (Recto + Verso)' : '';
    const newItems: string[] = [];

    if (quantity > 1) {
      for (let i = 1; i <= quantity; i++) {
        newItems.push(`${baseTitle} #${i}${rvTag}`);
      }
    } else {
      newItems.push(`${baseTitle}${rvTag}`);
    }

    setDocumentTitles((prev) => [...prev, ...newItems]);
    setCustomTitle('');
    setIsRectoVerso(false);
    setQuantity(1);
  };

  const handleRemoveTitle = (index: number) => {
    setDocumentTitles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (documentTitles.length === 0) {
      setErrorMsg('Veuillez ajouter au moins une pièce justificative à demander.');
      return;
    }

    if (mode === 'DIRECT_SEND' && sendNotification && (!clientEmail || !clientEmail.includes('@'))) {
      setErrorMsg('Veuillez saisir une adresse e-mail valide pour l\'envoi automatique au client.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName.trim() || undefined,
          clientEmail: clientEmail.trim() || undefined,
          documentTitles,
          sendNotification: mode === 'DIRECT_SEND' && sendNotification,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création de la demande');
      }

      setCreatedLink(data.depositLink);
      onCreated();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (!createdLink) return;
    navigator.clipboard.writeText(createdLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour, voici le lien sécurisé Fylynx pour déposer vos pièces justificatives : ${createdLink}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto font-sans selection:bg-brand-500 selection:text-white">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-brand-500/20 border border-brand-500/40 text-brand-400 flex items-center justify-center font-bold">
              <Link2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">Créer un Lien de Dépôt</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  1-Clic Instantané
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Générez un lien à envoyer par WhatsApp, Mail ou lien direct sans obliger la saisie des coordonnées.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {createdLink ? (
          /* Success Screen with Copy Link CTA & Instant Sharing */
          <div className="p-6 space-y-6 text-center">
            <div className="h-14 w-14 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <Sparkles className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">Lien de Dépôt Généré avec Succès !</h3>
              <p className="text-xs text-slate-400 mt-1">
                Le lien public sécurisé est prêt. Copiez-le ou partagez-le directement avec votre client.
              </p>
            </div>

            <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-3 text-left">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-brand-400 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Lien public sécurisé Chiffré RGPD
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={createdLink}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-emerald-300 font-mono focus:outline-none select-all"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition shadow-lg shadow-brand-500/20 shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-300" /> Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copier le lien
                    </>
                  )}
                </button>
              </div>

              {/* Direct share action buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
                <a
                  href={`https://api.whatsapp.com/send?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-3.5 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <MessageSquare className="h-4 w-4 text-emerald-400" /> Partager via WhatsApp
                </a>
                <a
                  href={createdLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <ExternalLink className="h-4 w-4 text-brand-400" /> Tester la page client
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCreatedLink(null);
                  setClientName('');
                  setClientEmail('');
                  onClose();
                }}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-extrabold text-xs transition border border-slate-700 shadow-md"
              >
                Fermer & Retourner au Tableau de bord
              </button>
            </div>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {errorMsg && (
              <div className="p-3 bg-rose-950/80 border border-rose-500/40 rounded-2xl text-rose-300 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Mode selector */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMode('QUICK_LINK');
                  setSendNotification(false);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  mode === 'QUICK_LINK'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="h-3.5 w-3.5 text-amber-300" /> ⚡ Lien Rapide (1 Clic)
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('DIRECT_SEND');
                  setSendNotification(true);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  mode === 'DIRECT_SEND'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mail className="h-3.5 w-3.5 text-brand-300" /> 📧 Envoi direct par Email
              </button>
            </div>

            {/* Client Info (Explicitly marked Optional for Quick Link) */}
            <div className="space-y-3 p-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-brand-400" /> Coordonnées Client (Optionnel)
                </h3>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                  {mode === 'QUICK_LINK' ? 'Pas obligatoire pour créer le lien' : 'Requis pour envoi direct'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nom du client <span className="text-slate-500 font-normal">(Optionnel)</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="ex: Marc Martin"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Email du client <span className="text-slate-500 font-normal">(Optionnel)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      placeholder="client@domaine.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Template Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileCheck className="h-3.5 w-3.5 text-brand-400" /> Pièces justificatives à demander
                </h3>
                {templates.length > 0 && (
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    className="text-xs border border-slate-800 rounded-xl px-2.5 py-1 bg-slate-950 text-slate-300 font-bold focus:outline-none"
                  >
                    <option value="">Charger un modèle prédéfini...</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Added Items List */}
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {documentTitles.map((title, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs font-bold text-slate-200"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-brand-500/20 text-brand-300 text-[10px] flex items-center justify-center font-extrabold border border-brand-500/30">
                        {index + 1}
                      </span>
                      {title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTitle(index)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Custom Title Input & Recto-Verso / Quantity Controls */}
              <div className="space-y-2 pt-1 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="ex: Carte d'Identité, Bulletins de paie..."
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTitle();
                      }
                    }}
                    className="flex-1 px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTitle}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1 transition shadow-md shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" /> Ajouter
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  {/* Recto-Verso Option Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsRectoVerso(!isRectoVerso)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold flex items-center gap-1.5 transition ${
                      isRectoVerso
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5 text-emerald-400" />
                    {isRectoVerso ? '✓ Format Recto + Verso Exigé' : '+ Option Recto / Verso'}
                  </button>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px] font-bold">Quantité :</span>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white font-bold focus:outline-none"
                    >
                      <option value={1}>1 document</option>
                      <option value={2}>2 exemplaires</option>
                      <option value={3}>3 exemplaires</option>
                      <option value={5}>5 exemplaires</option>
                      <option value={10}>10 exemplaires</option>
                    </select>
                  </div>
                </div>

                {/* Quick Presets Bar */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Raccourcis :</span>
                  <button
                    type="button"
                    onClick={() => {
                      setDocumentTitles((prev) => [...prev, 'Carte Nationale d\'Identité (Recto + Verso)']);
                    }}
                    className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded text-[10px] font-semibold border border-slate-800 transition"
                  >
                    + CNI (Recto+Verso)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDocumentTitles((prev) => [...prev, 'Permis de Conduire (Recto + Verso)']);
                    }}
                    className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded text-[10px] font-semibold border border-slate-800 transition"
                  >
                    + Permis (Recto+Verso)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDocumentTitles((prev) => [
                        ...prev,
                        'Bulletin de salaire #1 (-1 mois)',
                        'Bulletin de salaire #2 (-2 mois)',
                        'Bulletin de salaire #3 (-3 mois)',
                      ]);
                    }}
                    className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded text-[10px] font-semibold border border-slate-800 transition"
                  >
                    + 3 Bulletins de Salaire
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:brightness-110 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-brand-500/25 flex items-center gap-2 transition glow-brand"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Génération du lien...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Générer le lien du dossier (1 Clic)
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
