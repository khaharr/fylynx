'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageOptions, LanguageCode } from '@/locales';
import { Globe, ChevronDown } from 'lucide-react';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = LanguageOptions.find((o) => o.code === language) || LanguageOptions[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition shadow-sm"
        aria-label="Select Language"
      >
        <Globe className="h-3.5 w-3.5 text-brand-400" />
        <span>{currentOption.flag} {currentOption.code.toUpperCase()}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl">
          {LanguageOptions.map((opt) => (
            <button
              key={opt.code}
              type="button"
              onClick={() => {
                setLanguage(opt.code as LanguageCode);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                language === opt.code
                  ? 'bg-brand-600/20 text-brand-300 border border-brand-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{opt.flag}</span>
                <span>{opt.name}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
