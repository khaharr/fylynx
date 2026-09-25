import { fr } from './fr';
import { en } from './en';
import { ar } from './ar';
import { de } from './de';
import { es } from './es';
import { zh } from './zh';

export type LanguageCode = 'fr' | 'en' | 'ar' | 'de' | 'es' | 'zh';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const LanguageOptions: LanguageOption[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr' },
];

export const translations = { fr, en, ar, de, es, zh };
