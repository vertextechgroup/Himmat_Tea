"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import en from '../locales/en.json';

type Translations = Record<string, string>;

interface TranslationCtx {
  t: (key: string, params?: Record<string, string | number>) => string;
  lang: string;
  setLang: (lang: string) => void;
  isLoading: boolean;
}

const TRANSLATION_VERSION = 'v3'; // Increment this when translation files change

const TranslationContext = createContext<TranslationCtx>({
  t: (k) => k,
  lang: 'en',
  setLang: () => {},
  isLoading: false,
});

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState('en');
  const [translations, setTranslations] = useState<Translations>(en);
  const [isLoading, setIsLoading] = useState(false);

  // Validate if cached data has all keys
  const isValidCache = (data: Translations): boolean => {
    const allEnglishKeys = Object.keys(en);
    const cachedKeys = Object.keys(data);
    // Check if all English keys are present in cached data
    return allEnglishKeys.every(key => data[key] !== undefined);
  };

  const setLang = useCallback(async (newLang: string) => {
    setLangState(newLang);

    if (newLang === 'en') {
      setTranslations(en);
      return;
    }

    // Check sessionStorage first
    let cachedVersion: string | null = null;
    let cachedData: string | null = null;
    if (typeof window !== 'undefined') {
      cachedVersion = sessionStorage.getItem(`tr_${newLang}_version`);
      cachedData = sessionStorage.getItem(`tr_${newLang}`);
    }
    if (cachedVersion === TRANSLATION_VERSION && cachedData) {
      const parsedData = JSON.parse(cachedData);
      if (isValidCache(parsedData)) {
        setTranslations(parsedData);
        return;
      }
    }

    // Try to load from locale file (since we have them pre-generated!)
    try {
      const localeModule = await import(`../locales/${newLang}.json`);
      const localeData = localeModule.default;
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`tr_${newLang}`, JSON.stringify(localeData));
        sessionStorage.setItem(`tr_${newLang}_version`, TRANSLATION_VERSION);
      }
      setTranslations(localeData);
    } catch (err) {
      console.error('Failed to load translations, falling back to English', err);
      setTranslations(en);
    }
  }, []);

  // Fallback to key, then English - with interpolation support
  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      let text = translations[key] ?? en[key as keyof typeof en] ?? key;
      
      // Handle interpolation if params are provided
      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          const regex = new RegExp(`{${paramKey}}`, 'g');
          text = text.replace(regex, String(paramValue));
        });
      }
      
      return text;
    },
    [translations]
  );

  return (
    <TranslationContext.Provider value={{ t, lang, setLang, isLoading }}>
      {/* Thin progress bar during language fetch */}
      {isLoading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: '#2d5a3d',
            zIndex: 9999,
            animation: 'shimmer 1.2s ease-in-out infinite',
          }}
        />
      )}
      {children}
    </TranslationContext.Provider>
  );
}

export const useTranslation = () => useContext(TranslationContext);
