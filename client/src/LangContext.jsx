import { createContext, useState, useContext, useEffect } from 'react';
import { translations } from './translations';

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('jojo-lang') || 'en';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.body.classList.forEach(cls => {
      if (cls.startsWith('lang-')) {
        document.body.classList.remove(cls);
      }
    });
    document.body.classList.add(`lang-${lang}`);
    localStorage.setItem('jojo-lang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang][key] || translations['en'][key] || key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
