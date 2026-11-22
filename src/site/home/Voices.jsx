import { useEffect, useState } from 'react';
import { Quote, Star } from 'lucide-react';
import { useSettings } from '@/lib/settings';
import { Button } from '@/components/ui/Button';
import { useLang } from '@/i18n';
import { publicTestimonials } from '@/lib/api';
import CountUp from '@/components/reactbits/CountUp';
import { SectionHeader } from '@/components/ui/SectionHeader';

/** Real review statistics, plus quotes the clinic approves in the dashboard. */
export function Voices() {
  const { t, lang } = useLang();
  const [quotes, setQuotes] = useState([]);
  const [all, setAll] = useState(false);
  const s = useSettings();
  useEffect(() => {
    publicTestimonials().then(setQuotes).catch(() => {});
  }, []);
  const stats = [
    { n: <CountUp to={58} duration={2} />, label: t('voices.listener') },
    { n: <CountUp to={66} duration={2} />, label: t('voices.respectful') },
    { n: <CountUp to={4.5} decimals={1} duration={2} />, label: t('voices.avg') },
  ];
  return (
    <section className="bg-deep-glow on-dark relative overflow-hidden py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader dark eyebrow={t('voices.eyebrow')} title={t('voices.title')} />
        <div className="mt-16 grid gap-10 sm:grid-cols-3">
          {stats.map((s, i) => (
            <div key={i} className="border-t border-white/15 pt-8">
              <div className="font-display text-7xl text-amber-soft sm:text-8xl">{s.n}</div>
              <p className="mt-4 text-lg text-linen/70">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm text-linen/40">{t('voices.source')}</p>
      </div>
      {quotes.length > 0 && (
        <div className="mx-auto mt-20 max-w-7xl px-6">
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {(all ? quotes : quotes.slice(0, 6)).map((q) => (
              <figure key={q.id} className="mb-5 break-inside-avoid rounded-3xl bg-white p-7 text-ink">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5 text-amber" aria-label={`${Number(q.rating) || 5}/5`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} size={16} fill="currentColor" className={n > (Number(q.rating) || 5) ? 'opacity-25' : ''} />
                    ))}
                  </div>
                  <Quote size={22} className="text-calm/40" />
                </div>
                <blockquote className="mt-5 text-lg leading-relaxed text-ink/85">{lang === 'en' && q.quote_en ? q.quote_en : q.quote_ar}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 text-sm text-slate">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-mist font-medium text-deep">{(q.author || '؟').trim().charAt(0)}</span>
                  <span>
                    {q.author} {q.source && <span className="block text-xs">{q.source}</span>}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {quotes.length > 6 && !all && (
              <Button variant="ghostDark" onClick={() => setAll(true)}>
                {lang === 'en' ? `All reviews (${quotes.length})` : `كل التقييمات (${quotes.length})`}
              </Button>
            )}
            {s.review_url && (
              <Button href={s.review_url} target="_blank" rel="noopener" variant="amber">
                <Star size={16} /> {lang === 'en' ? 'Leave a Google review' : 'اكتب تقييمك على جوجل'}
              </Button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
