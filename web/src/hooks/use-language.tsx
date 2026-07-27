import { createContext, useContext } from 'react';

export type LanguageType = 'NL' | 'EN';

export type LanguageContextType = {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (nl: string, en: string) => string;
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage moet binnen een LanguageProvider worden gebruikt');
  }
  return context;
}
