import { useEffect, useState } from 'react';
import { Star, ArrowUpRight } from 'lucide-react';
import { useLang } from '@/i18n';
import { publicGoogle } from '@/lib/api';

export function GoogleG({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

const Stars = ({ n, size = 16 }) => (
  <span className="flex gap-0.5 text-amber" aria-label={`${n}/5`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} size={size} fill="currentColor" className={i > Math.round(n) ? 'opacity-25' : ''} />
    ))}
  </span>
);

/** First sentence, at most ~140 characters: a short quote, with the full review one tap away on Google. */
function short(text) {
  const t = (text || '').replace(/\s+/g, ' ').trim();
  const first = t.split(/(?<=[.!؟?])\s/)[0];
  const s = first.length >= 40 ? first : t;
  return s.length > 140 ? `${s.slice(0, 137).trimEnd()}…` : s;
}

/** Google rating and short quotes. The server refreshes them from Google Places once a week. Hidden until there is data. */
export function GoogleReviews() {
  const { lang } = useLang();
  const en = lang === 'en';
  const [g, setG] = useState(null);
  useEffect(() => {
    publicGoogle().then(setG).catch(() => {});
  }, []);
  if (!g || !g.rating) return null;
  const reviews = (g[`reviews_${lang}`]?.length ? g[`reviews_${lang}`] : g.reviews_ar || []).filter((r) => r.text).slice(0, 3);

  return (
    <div className="mx-auto mt-20 max-w-7xl px-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <div className="flex flex-col justify-between rounded-3xl bg-white p-7 text-ink">
          <div className="flex items-center gap-3">
            <GoogleG />
            <span className="font-medium text-deep">{en ? 'Google reviews' : 'تقييمات جوجل'}</span>
          </div>
          <div className="mt-6">
            <p className="font-display text-6xl text-deep" dir="ltr" style={{ textAlign: 'start' }}>
              {Number(g.rating).toFixed(1)}
            </p>
            <div className="mt-2">
              <Stars n={g.rating} size={20} />
            </div>
            <p className="mt-2 text-sm text-slate">{en ? `${g.count} reviews` : `${g.count} تقييم`}</p>
          </div>
          {g.url && (
            <a href={g.url} target="_blank" rel="noopener" className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-deep underline-offset-4 hover:underline">
              {en ? 'See all on Google' : 'شوف كل التقييمات على جوجل'} <ArrowUpRight size={16} className="rtl:-scale-x-100" />
            </a>
          )}
          {g.demo && <p className="mt-4 text-xs text-slate">{en ? 'Sample for preview. Real Google reviews appear once the Place ID is set.' : 'مثال للمعاينة. التقييمات الحقيقية بتظهر لما يتحط رقم المكان على جوجل.'}</p>}
        </div>
        {reviews.length > 0 && (
          <div className="grid gap-5 md:grid-cols-3">
            {reviews.map((r, i) => (
              <figure key={i} className="flex min-w-0 flex-col rounded-3xl border border-white/10 bg-white/5 p-6 text-linen">
                <Stars n={r.rating} size={14} />
                <blockquote className="mt-4 flex-1 text-lg leading-relaxed">«{short(r.text)}»</blockquote>
                <figcaption className="mt-5 text-sm text-linen/60">
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noopener" className="hover:text-linen">
                      {r.author}
                    </a>
                  ) : (
                    r.author
                  )}
                  {r.when && <span className="block text-xs text-linen/40">{r.when}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
