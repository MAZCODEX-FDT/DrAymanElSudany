import { useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useLang } from '@/i18n';
import { useFaqs } from '@/lib/useFaqs';
import { useLenis } from '@/lib/smooth';
import { Seo } from '@/site/Seo';
import { PageHero } from '@/site/PageHero';
import { Accordion } from '@/components/ui/Accordion';
import { ClosingCta } from '@/site/home/ClosingCta';
import { cn } from '@/lib/cn';

/** FAQ grouped by topic: pick a topic (or search) and only those questions show, so nobody scrolls past topics they don't need. */
export default function Faq() {
  const { t } = useLang();
  const faqs = useFaqs();
  const lenis = useLenis();
  const top = useRef(null);
  const [topic, setTopic] = useState('');
  const [query, setQuery] = useState('');

  const other = t('faq.other');
  const groups = useMemo(() => {
    const map = new Map();
    for (const f of faqs) {
      const c = f.category || other;
      if (!map.has(c)) map.set(c, []);
      map.get(c).push(f);
    }
    return [...map.entries()].map(([name, items]) => ({ name, items }));
  }, [faqs, other]);

  const q = query.trim().toLowerCase();
  const visible = groups
    .filter((g) => !topic || g.name === topic)
    .map((g) => ({ ...g, items: q ? g.items.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(q)) : g.items }))
    .filter((g) => g.items.length);

  const pick = (name) => {
    setTopic(name);
    const el = top.current;
    if (el && el.getBoundingClientRect().top < 0) lenis ? lenis.scrollTo(el, { offset: -90 }) : el.scrollIntoView({ behavior: 'smooth' });
  };

  const jsonLd = useMemo(
    () => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }),
    [faqs]
  );
  const chip = (active) => cn('shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 min-h-11 text-sm transition-all', active ? 'border-deep bg-deep text-linen' : 'border-deep/15 bg-white text-deep hover:border-deep/40');

  return (
    <>
      <Seo title={t('nav.faq')} description={t('faq.title')} jsonLd={jsonLd} />
      <PageHero eyebrow={t('faq.eyebrow')} title={t('faq.title')} />
      <section ref={top} className="bg-linen py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 lg:grid-cols-12">
          {/* topics: sidebar on desktop, sticky chip row on phones */}
          <aside className="min-w-0 lg:col-span-4">
            <div className="sticky top-20 z-10 -mx-6 bg-linen/95 px-6 py-3 backdrop-blur lg:top-28 lg:mx-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-0">
              <label className="relative block">
                <Search size={17} className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-slate" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('faq.search')}
                  aria-label={t('faq.search')}
                  className="h-12 w-full rounded-full border border-deep/15 bg-white pe-10 ps-11 text-[15px] text-ink outline-none focus:border-calm focus:ring-4 focus:ring-calm/10"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="absolute end-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-slate hover:bg-deep/5" aria-label={t('nav.close')}>
                    <X size={15} />
                  </button>
                )}
              </label>
              <p className="eyebrow mb-3 mt-6 hidden lg:block">{t('faq.topics')}</p>
              <nav className="scroll-thin mt-3 flex gap-2 overflow-x-auto pb-1 lg:mt-0 lg:flex-col lg:overflow-visible" aria-label={t('faq.topics')}>
                <button onClick={() => pick('')} className={cn(chip(!topic), 'lg:flex lg:justify-between lg:rounded-2xl lg:px-5 lg:py-3 lg:text-start')} aria-pressed={!topic}>
                  {t('faq.allTopics')} <span className="ms-2 opacity-60">{faqs.length}</span>
                </button>
                {groups.map((g) => (
                  <button key={g.name} onClick={() => pick(g.name)} className={cn(chip(topic === g.name), 'lg:flex lg:justify-between lg:rounded-2xl lg:px-5 lg:py-3 lg:text-start')} aria-pressed={topic === g.name}>
                    {g.name} <span className="ms-2 opacity-60">{g.items.length}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>
          <div className="min-w-0 space-y-14 lg:col-span-8">
            {visible.length === 0 ? (
              <p className="rounded-3xl border border-dashed border-deep/15 p-10 text-center text-slate">{t('faq.noResults')}</p>
            ) : (
              visible.map((g) => (
                <div key={g.name + q}>
                  {(groups.length > 1 || q) && <h2 className="font-display mb-2 text-2xl text-deep sm:text-3xl">{g.name}</h2>}
                  <Accordion items={g.items} defaultOpen={topic || q ? 0 : -1} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      <ClosingCta />
    </>
  );
}
