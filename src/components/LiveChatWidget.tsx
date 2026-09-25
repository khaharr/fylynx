'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MessageSquare, X, Send, Sparkles, Bot, CheckCircle2, ArrowRight, ShieldCheck, Zap, CreditCard, Rocket } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  cta?: { label: string; href: string };
}

const FAQ_RESPONSES: Record<string, { answer: string; cta?: { label: string; href: string } }> = {
  ia: {
    answer: "Notre IA Vision analyse en moins de 3 secondes l'authenticité des CNI et passeports (lecture automatique des bandes MRZ ISO 7501), vérifie la date des justificatifs de domicile (< 3 mois) et contrôle la cohérence des fiches de paie.",
    cta: { label: "Tester la démo IA en direct", href: "/#demo-ia" },
  },
  essai: {
    answer: "Absolument ! Vous bénéficiez de 14 jours d'essai gratuit avec accès complet à toutes les fonctionnalités Starter sans saisir de carte bancaire.",
    cta: { label: "Démarrer l'essai gratuit 14j", href: "/register" },
  },
  tarifs: {
    answer: "Nous proposons 3 formules : Starter à 29€/mois (jusqu'à 10 portails), Pro Illimité à 79€/mois (relances automatiques & marque blanche), et IA Enterprise à 149€/mois (inspection IA vision complète).",
    cta: { label: "Voir le tableau comparatif", href: "/#tarifs" },
  },
  default: {
    answer: "Merci pour votre message ! Notre équipe support et notre assistant IA analysent votre demande. Pour démarrer sans attendre, vous pouvez tester Fylynx gratuitement pendant 14 jours sans carte bancaire.",
    cta: { label: "Créer un compte gratuit", href: "/register" },
  },
};

export default function LiveChatWidget() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Bonjour ! 👋 Je suis Sarah de l\'équipe Fylynx. Comment puis-je vous aider aujourd\'hui ?',
      time: 'À l\'instant',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Do not render live sales chat widget on client depositor links (/d/[token])
  if (pathname?.startsWith('/d/')) {
    return null;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    try {
      const history = newMessages.slice(-5).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await res.json();
      const replyText = data?.reply || "Merci pour votre message ! Vous pouvez créer un compte gratuit et démarrer 14 jours d'essai offerts.";

      const lower = text.toLowerCase();
      let cta: { label: string; href: string } | undefined = undefined;
      if (lower.includes('essai') || lower.includes('gratuit') || lower.includes('inscription') || lower.includes('compte')) {
        cta = { label: "Démarrer l'essai gratuit 14j (Sans CB)", href: "/register" };
      } else if (lower.includes('tarif') || lower.includes('prix') || lower.includes('formule')) {
        cta = { label: "Voir les formules & tarifs", href: "/#tarifs" };
      } else if (lower.includes('ia') || lower.includes('démo') || lower.includes('vérification')) {
        cta = { label: "Tester la démo IA", href: "/#demo-ia" };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cta,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: "Pour toute question, vous pouvez démarrer votre essai gratuit de 14 jours sans carte bancaire.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cta: { label: "Démarrer l'essai gratuit", href: "/register" },
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Ouvrir le chat de support"
          className="relative group p-4 bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 hover:brightness-110 text-white rounded-full shadow-2xl glow-brand transition duration-300 flex items-center justify-center cursor-pointer"
        >
          <div className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
          <MessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
            Besoin d'aide ?
          </span>
        </button>
      )}

      {/* Chat Window Drawer */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[380px] h-[520px] bg-slate-950/95 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center p-0.5 border border-white/20">
                  <Image
                    src="/fylynx-logo.png"
                    alt="Fylynx Assistant"
                    width={32}
                    height={32}
                    className="rounded-xl object-contain bg-slate-950 p-1"
                  />
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-400 rounded-full border-2 border-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-sm font-extrabold text-white">
                  <span>Support & Assistance</span>
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  En ligne 24/7 • Réponse instantanée
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              aria-label="Fermer le chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-br-none font-medium'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>

                  {msg.cta && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                      <Link
                        href={msg.cta.href}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-cyan-400 hover:text-cyan-300 transition"
                      >
                        <span>{msg.cta.label}</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 font-semibold mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs bg-slate-900 border border-slate-800 px-3.5 py-2.5 rounded-2xl w-max">
                <Bot className="h-4 w-4 text-brand-400 animate-spin" />
                <span>Sarah rédige une réponse...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Quick Prompts */}
          <div className="px-3 py-2 bg-slate-950 border-t border-slate-900 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleSendMessage("Comment fonctionne l'IA de vérification ?")}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-semibold rounded-xl whitespace-nowrap transition flex items-center gap-1"
            >
              <Bot className="h-3 w-3 text-indigo-400" /> IA de vérification ?
            </button>
            <button
              onClick={() => handleSendMessage("Puis-je tester 14 jours sans CB ?")}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-semibold rounded-xl whitespace-nowrap transition flex items-center gap-1"
            >
              <Rocket className="h-3 w-3 text-amber-400" /> Essai gratuit 14j ?
            </button>
            <button
              onClick={() => handleSendMessage("Quels sont les tarifs et formules ?")}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-semibold rounded-xl whitespace-nowrap transition flex items-center gap-1"
            >
              <CreditCard className="h-3 w-3 text-brand-400" /> Tarifs &amp; formules ?
            </button>
          </div>

          {/* Footer Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Posez votre question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-brand-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-xl transition"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
