import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { publicContent } from './api';

// Website content managed from the dashboard (Website section): procedures, FAQs, branches,
// about-the-doctor blocks and images. Loaded once per visit; the last copy is kept in
// localStorage so returning visitors see it instantly while the fresh copy loads.

const CACHE = 'aes-content-v1';
const ContentContext = createContext({ ready: false });
export const useContent = () => useContext(ContentContext);

const bi = (row, key) => ({ ar: row[`${key}_ar`] || '', en: row[`${key}_en`] || row[`${key}_ar`] || '' });

export function normalize(raw) {
  if (!raw) return null;
  const procedures = (raw.procedures || []).map((p) => ({ id: p.id, slug: p.slug, icon: p.icon, image: p.image || '', ...(p.content || {}) })).filter((p) => p.slug && p.title);
  const faqs = (raw.faqs || []).map((f) => ({ id: f.id, q: bi(f, 'q'), a: bi(f, 'a') })).filter((f) => f.q.ar || f.q.en);
  const branches = (raw.branches || []).map((b) => ({
    id: b.id,
    name: bi(b, 'name'),
    address: bi(b, 'address'),
    hours: bi(b, 'hours'),
    phone: b.phone || '',
    whatsapp: b.whatsapp || '',
    map_url: b.map_url || '',
    image: b.image || '',
  }));
  const blocks = (raw.about || []).map((a) => ({ id: a.id, kind: a.kind, title: bi(a, 'title'), body: bi(a, 'body'), image: a.image || '' }));
  const about = {
    intro: blocks.find((b) => b.kind === 'intro') || null,
    statement: blocks.find((b) => b.kind === 'statement') || null,
    highlights: blocks.filter((b) => b.kind === 'highlight'),
    sections: blocks.filter((b) => b.kind === 'section'),
    credentials: blocks.filter((b) => b.kind === 'credential'),
  };
  const media = {};
  const gallery = [];
  for (const m of raw.media || []) {
    if (!m.url) continue;
    const item = { id: m.id, url: m.url, alt: bi(m, 'alt') };
    if (m.slot === 'gallery') gallery.push(item);
    else if (!media[m.slot]) media[m.slot] = item;
  }
  return { procedures, faqs, branches, about, media, gallery };
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function ContentProvider({ children }) {
  const [raw, setRaw] = useState(readCache);
  const [fresh, setFresh] = useState(false);
  useEffect(() => {
    let alive = true;
    publicContent()
      .then((data) => {
        if (!alive) return;
        setRaw(data);
        setFresh(true);
        try {
          localStorage.setItem(CACHE, JSON.stringify(data));
        } catch {
          /* cache is optional */
        }
      })
      .catch(() => alive && setFresh(true));
    return () => {
      alive = false;
    };
  }, []);
  const value = useMemo(() => {
    const n = normalize(raw);
    return n ? { ready: true, fresh, ...n } : { ready: false, fresh, procedures: [], faqs: [], branches: [], about: { highlights: [], sections: [], credentials: [] }, media: {}, gallery: [] };
  }, [raw, fresh]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

/** URL of a site image: uploaded paths are made relative to the deploy base (GitHub Pages demo lives under a sub-path). */
export function imgSrc(url) {
  if (!url) return '';
  if (/^(https?:|data:|blob:)/.test(url)) return url;
  return `${import.meta.env.BASE_URL}${url.replace(/^\//, '')}`;
}
