// Data layer. Talks to the PHP API in /api (Bluehost). If the API is not reachable
// (local preview, design review) it falls back to demo data kept in localStorage.
import { db, save, nextId, GOOGLE_SAMPLE } from './demo';

const FORCE_DEMO = import.meta.env.VITE_DEMO === '1';
const BASE = import.meta.env.VITE_API_BASE || '/api/index.php';

let mode = FORCE_DEMO ? 'demo' : 'unknown';
const listeners = new Set();
export const isDemo = () => mode === 'demo';
export const onModeChange = (fn) => (listeners.add(fn), () => listeners.delete(fn));
function setMode(m) {
  if (mode !== m) {
    mode = m;
    listeners.forEach((fn) => fn(m));
  }
}

async function http(method, r, { id, body } = {}) {
  const url = `${BASE}?r=${encodeURIComponent(r)}${id != null ? `&id=${encodeURIComponent(id)}` : ''}`;
  const res = await fetch(url, {
    method,
    credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const type = res.headers.get('content-type') || '';
  if (!type.includes('application/json')) throw Object.assign(new Error('API unavailable'), { unavailable: true });
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status });
  return data;
}

async function call(method, r, opts, demoFn) {
  if (mode !== 'demo') {
    try {
      const data = await http(method, r, opts);
      setMode('live');
      return data;
    } catch (e) {
      if (!(e.unavailable || e instanceof TypeError)) throw e;
      setMode('demo');
    }
  }
  return demoFn();
}

const now = () => new Date().toISOString();

// ---------- resources (dashboard) ----------
export const RESOURCES = ['appointments', 'leads', 'cases', 'referrers', 'patients', 'testimonials', 'faqs', 'events', 'procedures', 'branches', 'about', 'media'];
const CONTENT = ['procedures', 'faqs', 'branches', 'about', 'media'];
const bySort = (a, b) => (a.sort ?? 0) - (b.sort ?? 0) || a.id - b.id;

export const list = (r) => call('GET', r, {}, () => {
  const rows = [...(db()[r] || [])];
  return CONTENT.includes(r) ? rows.sort(bySort) : rows;
});

export const create = (r, item) =>
  call('POST', r, { body: item }, () => {
    const rec = { id: nextId(), created_at: now(), ...item };
    db()[r] = [rec, ...(db()[r] || [])];
    save();
    return rec;
  });

export const update = (r, id, patch) =>
  call('PUT', r, { id, body: patch }, () => {
    db()[r] = db()[r].map((x) => (x.id === id ? { ...x, ...patch } : x));
    save();
    return db()[r].find((x) => x.id === id);
  });

export const remove = (r, id) =>
  call('DELETE', r, { id }, () => {
    db()[r] = db()[r].filter((x) => x.id !== id);
    save();
    return { ok: true };
  });

// ---------- settings ----------
export const getSettings = () => call('GET', 'settings', {}, () => ({ ...db().settings }));
export const saveSettings = (s) =>
  call('PUT', 'settings', { body: s }, () => {
    db().settings = { ...db().settings, ...s };
    save();
    return db().settings;
  });

// ---------- public ----------
/** Website forms: booking, referral, contact. Lands in the dashboard inbox. */
export const submitLead = (lead) =>
  call('POST', 'lead', { body: lead }, () => {
    const rec = { id: nextId(), status: 'open', label: lead.type === 'referral' ? 'referring_doctor' : 'new', created_at: now(), responded_at: null, ...lead };
    db().leads = [rec, ...db().leads];
    save();
    return { ok: true };
  });

/** Everything the public site shows from the Website section of the dashboard (enabled rows only). */
export const publicContent = () =>
  call('GET', 'public-content', {}, () => {
    const out = {};
    for (const r of CONTENT) {
      const flag = r === 'faqs' ? 'published' : 'enabled';
      out[r] = (db()[r] || []).filter((x) => x[flag] !== false).sort(bySort);
    }
    return out;
  });

/** Upload an image. Live: stored on the server under /uploads. Demo: kept in the browser as a compressed data URL. */
export async function upload(file) {
  if (mode !== 'demo') {
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${BASE}?r=upload`, { method: 'POST', credentials: 'same-origin', body: fd });
      const type = res.headers.get('content-type') || '';
      if (!type.includes('application/json')) throw Object.assign(new Error('API unavailable'), { unavailable: true });
      const data = await res.json();
      if (!res.ok) throw Object.assign(new Error(data.error || 'Upload failed'), { status: res.status });
      setMode('live');
      return data.url;
    } catch (e) {
      if (!(e.unavailable || e instanceof TypeError)) throw e;
      setMode('demo');
    }
  }
  return compressToDataUrl(file);
}

function compressToDataUrl(file, max = 1400) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * s);
      c.height = Math.round(img.height * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      resolve(c.toDataURL('image/webp', 0.8));
    };
    img.onerror = () => reject(new Error('not an image'));
    img.src = URL.createObjectURL(file);
  });
}

/** Google rating and recent 4-5 star reviews. Live: the server asks Google Places and caches the answer for 12 hours. */
export const publicGoogle = () => call('GET', 'public-google', {}, () => GOOGLE_SAMPLE);

export const refreshGoogle = () => call('POST', 'google-refresh', {}, () => GOOGLE_SAMPLE);

export const publicFaqs = () => call('GET', 'public-faqs', {}, () => db().faqs.filter((f) => f.published !== false));
export const publicTestimonials = () => call('GET', 'public-testimonials', {}, () => db().testimonials.filter((t) => t.approved));

/** Click tracking (WhatsApp, call, map, form). Fire and forget. */
export function track(type, page = window.location.pathname) {
  try {
    if (typeof window.gtag === 'function') window.gtag('event', `click_${type}`, { page_path: page });
  } catch {
    /* analytics optional */
  }
  call('POST', 'event', { body: { type, page } }, () => {
    db().events.push({ id: nextId(), type, page, created_at: now() });
    save();
    return { ok: true };
  }).catch(() => {});
}

// ---------- auth ----------
export const login = (email, password) =>
  call('POST', 'login', { body: { email, password } }, () => {
    if (email && password === 'demo') {
      sessionStorage.setItem('aes-demo-auth', email);
      return { user: { email, name: 'Clinic Admin' } };
    }
    throw new Error('invalid');
  });
export const me = () =>
  call('GET', 'me', {}, () => {
    const email = sessionStorage.getItem('aes-demo-auth');
    if (!email) throw Object.assign(new Error('unauthorized'), { status: 401 });
    return { user: { email, name: 'Clinic Admin' } };
  });
export const logout = () => call('POST', 'logout', {}, () => (sessionStorage.removeItem('aes-demo-auth'), { ok: true }));
