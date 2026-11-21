import { useEffect, useState } from 'react';
import { publicFaqs } from './api';
import { defaultFaqs } from '@/data/faqs';
import { useLang } from '@/i18n';

/** FAQs from the dashboard if any are published, otherwise the defaults. Returns {q, a} in the current language. */
export function useFaqs() {
  const { L, lang } = useLang();
  const [remote, setRemote] = useState(null);
  useEffect(() => {
    publicFaqs().then(setRemote).catch(() => setRemote([]));
  }, []);
  const source =
    remote && remote.length
      ? remote.map((f) => ({ id: f.id, q: { ar: f.q_ar, en: f.q_en || f.q_ar }, a: { ar: f.a_ar, en: f.a_en || f.a_ar } }))
      : defaultFaqs;
  return source.map((f) => ({ id: f.id, q: L(f.q), a: L(f.a), lang }));
}
