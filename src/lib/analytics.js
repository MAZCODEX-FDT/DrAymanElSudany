// Visitor analytics. Google Analytics 4 and Meta Pixel load only when their IDs are set in dashboard Settings.
// No patient details are ever sent: only the page, the procedure slug and the kind of action.

const ATTR = 'aes-attr';

/** Remember how this visit started (first page, referrer, utm tags) so a booking can say what brought it. */
export function captureAttribution() {
  try {
    if (sessionStorage.getItem(ATTR)) return;
    const q = new URLSearchParams(window.location.search);
    const ref = document.referrer && !document.referrer.startsWith(window.location.origin) ? new URL(document.referrer).hostname : '';
    const a = { landing: window.location.pathname, referrer: ref };
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) if (q.get(k)) a[k] = q.get(k).slice(0, 80);
    sessionStorage.setItem(ATTR, JSON.stringify(a));
  } catch {
    /* optional */
  }
}
export function attribution() {
  try {
    return JSON.parse(sessionStorage.getItem(ATTR) || '{}');
  } catch {
    return {};
  }
}

const procedureOf = (path) => (path.match(/\/procedures\/([a-z0-9-]+)/) || [])[1];
const articleOf = (path) => (path.match(/\/articles\/([a-z0-9-]+)/) || [])[1];

let loaded = false;
export function initAnalytics({ ga_id, meta_pixel_id } = {}) {
  if (loaded || typeof window === 'undefined') return;
  const ga = /^G-[A-Z0-9]{4,}$/.test(ga_id || '') ? ga_id : '';
  const px = /^\d{6,20}$/.test(meta_pixel_id || '') ? meta_pixel_id : '';
  if (!ga && !px) return;
  loaded = true;
  if (ga) {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${ga}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments); // eslint-disable-line prefer-rest-params
    };
    window.gtag('js', new Date());
    window.gtag('config', ga, { send_page_view: false });
  }
  if (px) {
    /* Meta's standard loader, inlined */
    const f = window;
    if (!f.fbq) {
      const n = (f.fbq = function fbq() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); // eslint-disable-line prefer-rest-params
      });
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(s);
    }
    f.fbq('init', px);
  }
  pageView(window.location.pathname);
}

export function pageView(path) {
  try {
    window.gtag?.('event', 'page_view', { page_path: path, page_location: window.location.href, procedure: procedureOf(path), article: articleOf(path) });
    window.fbq?.('track', 'PageView');
    const p = procedureOf(path);
    if (p) window.fbq?.('track', 'ViewContent', { content_category: 'procedure', content_ids: [p] });
  } catch {
    /* optional */
  }
}

/** WhatsApp, call and map taps. */
export function trackAction(type, path = window.location.pathname) {
  try {
    window.gtag?.('event', `click_${type}`, { page_path: path, procedure: procedureOf(path), landing: attribution().landing });
    if (type === 'whatsapp' || type === 'call') window.fbq?.('track', 'Contact', { method: type });
  } catch {
    /* optional */
  }
}

/** A booking or referral form was sent. */
export function trackLead(kind) {
  try {
    const a = attribution();
    window.gtag?.('event', 'generate_lead', { form: kind, landing: a.landing, procedure: procedureOf(a.landing || ''), source: a.utm_source || a.referrer || 'direct' });
    window.fbq?.('track', 'Lead', { content_category: kind });
  } catch {
    /* optional */
  }
}
