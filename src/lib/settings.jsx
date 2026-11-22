import { createContext, useContext, useEffect, useState } from 'react';
import { getSettings } from './api';
import { withBase } from './cn';

const SettingsContext = createContext({});
export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({});
  useEffect(() => {
    getSettings().then(setSettings).catch(() => {});
  }, []);
  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

/** WhatsApp deep link with a prefilled message. Falls back to the booking page until the number is set. */
export function whatsappHref(settings, lang, text) {
  const num = (settings.whatsapp || '').replace(/\D/g, '');
  if (!num) return withBase(lang === 'en' ? '/en/book' : '/book');
  const msg = text || (lang === 'en' ? 'Hello, I would like to book a visit with Dr. Ayman El Sudany.' : 'السلام عليكم، عايز أحجز ميعاد مع د. أيمن السودانى.');
  const intl = num.startsWith('0') ? `20${num.slice(1)}` : num;
  return `https://wa.me/${intl}?text=${encodeURIComponent(msg)}`;
}
export const telHref = (settings) => (settings.phone ? `tel:${settings.phone.replace(/\s/g, '')}` : null);
