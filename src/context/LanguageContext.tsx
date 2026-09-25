'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { LanguageCode, translations, LanguageOptions } from '@/locales';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: keyof typeof translations.fr, fallback?: string) => string;
  dir: 'ltr' | 'rtl';
  getLocalizedHref: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: (key) => translations.fr[key] || String(key),
  dir: 'ltr',
  getLocalizedHref: (path) => path,
});

const SUPPORTED_LOCALES: LanguageCode[] = ['fr', 'en', 'ar', 'de', 'es', 'zh'];

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('fr');
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    try {
      const pathnameSegments = window.location.pathname.split('/');
      const pathLang = pathnameSegments[1] as LanguageCode;
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang') as LanguageCode;
      const savedLang = localStorage.getItem('fylynx_lang') as LanguageCode;

      const targetLang = (pathLang && translations[pathLang])
        ? pathLang
        : (urlLang && translations[urlLang])
        ? urlLang
        : (savedLang && translations[savedLang])
        ? savedLang
        : 'fr';

      const option = LanguageOptions.find((o) => o.code === targetLang);
      const newDir = option?.dir || 'ltr';

      setLanguageState(targetLang);
      setDir(newDir);

      if (typeof document !== 'undefined') {
        document.documentElement.lang = targetLang;
        document.documentElement.dir = newDir;
      }
    } catch (e) {}
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    const option = LanguageOptions.find((o) => o.code === lang);
    const newDir = option?.dir || 'ltr';
    setDir(newDir);

    try {
      localStorage.setItem('fylynx_lang', lang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = lang;
        document.documentElement.dir = newDir;
      }
      if (typeof window !== 'undefined') {
        const pathSegments = window.location.pathname.split('/');
        if (SUPPORTED_LOCALES.includes(pathSegments[1] as LanguageCode)) {
          pathSegments[1] = lang;
        } else {
          pathSegments.splice(1, 0, lang);
        }
        const newPathname = pathSegments.join('/') || `/${lang}`;
        const newUrl = `${newPathname}${window.location.search}`;
        window.history.replaceState({}, '', newUrl);
      }
    } catch (e) {}
  };

  const getLocalizedHref = (path: string): string => {
    if (!path || path.startsWith('http') || path.startsWith('#')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const segments = cleanPath.split('/');
    if (SUPPORTED_LOCALES.includes(segments[1] as LanguageCode)) {
      return cleanPath;
    }
    return `/${language}${cleanPath}`;
  };

  const t = (key: keyof typeof translations.fr, fallback?: string): string => {
    const dict = translations[language] || translations.fr;
    return (dict as Record<string, string>)[key] || (translations.fr as Record<string, string>)[key] || fallback || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir, getLocalizedHref }}>
      <div dir={dir} className={dir === 'rtl' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
