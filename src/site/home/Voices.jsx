import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { useLang } from '@/i18n';
import { publicTestimonials } from '@/lib/api';
import CountUp from '@/components/reactbits/CountUp';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Marquee } from '@/components/ui/Marquee';

/** Real review statistics, plus quotes the clinic approves in the dashboard. */
export function Voices() {
  const { t, lang } = useLang();
  const [quotes, setQuotes] = useState([]);
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
        <Marquee speed={55} className="mt-20">
          {quotes.map((q) => (
            <figure key={q.id} className="glass w-[340px] shrink-0 rounded-3xl p-7 sm:w-[420px]">
              <Quote size={22} className="text-amber" />
              <blockquote className="mt-4 text-lg leading-relaxed text-linen/85">{lang === 'en' && q.quote_en ? q.quote_en : q.quote_ar}</blockquote>
              <figcaption className="mt-5 text-sm text-linen/50">
                {q.author} {q.source && `· ${q.source}`}
              </figcaption>
            </figure>
          ))}
        </Marquee>
      )}
    </section>
  );
}
