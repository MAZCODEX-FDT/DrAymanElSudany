import { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { strings } from './strings';

const LangContext = createContext({ lang: 'ar', dir: 'rtl' });

/** Arabic is the default at "/", English lives under "/en". */
export function langFromPath(pathname) {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'ar';
}

export function LangProvider({ children, lang: forced }) {
  const { pathname } = useLocation();
  const lang = forced || langFromPath(pathname);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const value = useMemo(() => {
    const t = (key) => {
      const entry = key.split('.').reduce((o, k) => (o ? o[k] : undefined), strings);
      if (!entry) return key;
      return entry[lang] ?? entry.ar ?? key;
    };
    /** Pick the right language from a {ar, en} object (or return plain strings as-is). */
    const L = (v) => (v && typeof v === 'object' && ('ar' in v || 'en' in v) ? v[lang] ?? v.ar : v);
    /** Build a link for the current language. */
    const to = (path = '/') => (lang === 'en' ? (path === '/' ? '/en' : `/en${path}`) : path);
    return { lang, dir, t, L, to, isAr: lang === 'ar' };
  }, [lang, dir]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** Path of the same page in the other language. */
export function switchLangPath(pathname) {
  if (langFromPath(pathname) === 'en') {
    const rest = pathname.replace(/^\/en/, '');
    return rest || '/';
  }
  return pathname === '/' ? '/en' : `/en${pathname}`;
}
