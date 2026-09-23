'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Plus, FileSpreadsheet, CheckCircle2, ShieldCheck, X } from 'lucide-react';

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
  const [templates, setTemplates] = useState<TemplateItem[]>(initialTemplates);
  const [name, setName] = useState('');
  const [docTypeInput, setDocTypeInput] = useState('');
  const [docTypes, setDocTypes] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Modèles de Collecte Certifiés RGPD
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Modèles de dossiers types
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Préparez des configurations réutilisables en 1 clic (&quot;Location Immo&quot;, &quot;Véhicule&quot;, &quot;Recrutement&quot;, etc.)
            </p>
          </div>

          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-extrabold rounded-2xl text-xs shadow-lg shadow-brand-500/20 flex items-center gap-2 transition self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Créer un modèle
          </button>
        </div>

        {isCreating && (
          <form
            onSubmit={handleCreateTemplate}
            className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl p-6 rounded-3xl shadow-2xl space-y-5 max-w-2xl animate-in fade-in duration-200"
          >
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-brand-400" /> Nouveau Modèle Reutilisable
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

        {/* RGPD Footer Banner */}
        <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
          <div className="space-y-0.5">
            <span className="font-extrabold text-slate-200 text-sm">Protection des Données & Conformité RGPD</span>
            <p className="text-slate-400">
              Tous vos modèles de collecte d&apos;informations respectent le principe de minimisation des données (Article 5 du RGPD). Seules les pièces justificatives strictement nécessaires sont demandées à vos clients.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
