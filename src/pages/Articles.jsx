import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '@/i18n';
import { useContent, imgSrc } from '@/lib/content';
import { Seo } from '@/site/Seo';
import { PageHero } from '@/site/PageHero';
import { ArrowForward } from '@/components/ui/ArrowForward';
import { cn } from '@/lib/cn';

export function ArticleCard({ a }) {
  const { L, to, lang } = useLang();
  return (
    <Link to={to(`/articles/${a.slug}`)} className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-deep/10 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgba(15,59,87,.55)]">
      {a.image && <img src={imgSrc(a.image)} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />}
      <div className="flex flex-1 flex-col p-7">
        <p className="text-sm font-medium text-calm-ink">
          {L(a.category)}
          {a.date && <span className="text-slate"> · {new Date(a.date).toLocaleDateString(lang === 'en' ? 'en-GB' : 'ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
        </p>
        <h2 className="font-display mt-3 text-2xl leading-snug text-deep">{L(a.title)}</h2>
        <p className="mt-3 flex-1 leading-relaxed text-ink/70">{L(a.excerpt)}</p>
        <span className="mt-6 inline-flex items-center gap-2 font-medium text-deep">
          {lang === 'en' ? 'Read' : 'اقرأ'} <ArrowForward size={16} />
        </span>
      </div>
    </Link>
  );
}

/** Short articles that answer what families ask. Written and published from the dashboard. */
export default function Articles() {
  const { L, lang } = useLang();
  const { articles } = useContent();
  const en = lang === 'en';
  const cats = [...new Map(articles.map((a) => [L(a.category), a.category])).keys()].filter(Boolean);
  const [cat, setCat] = useState('');
  const shown = cat ? articles.filter((a) => L(a.category) === cat) : articles;
  const title = en ? 'Answers for families' : 'إجابات للأهل';
  const sub = en ? 'Short, clear answers to the questions families ask us most, before and after a visit.' : 'إجابات قصيرة وواضحة على أكتر الأسئلة اللى الأهل بيسألوها، قبل الزيارة وبعدها.';

  return (
    <>
      <Seo title={title} description={sub} />
      <PageHero eyebrow={en ? 'Articles' : 'مقالات'} title={title} sub={sub} />
      <section className="bg-linen py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          {cats.length > 1 && (
            <div className="-mx-6 mb-10 flex gap-2 overflow-x-auto px-6 pb-2">
              {['', ...cats].map((c) => (
                <button key={c || 'all'} type="button" onClick={() => setCat(c)} aria-pressed={cat === c} className={cn('inline-flex min-h-11 shrink-0 items-center rounded-full border px-5 text-sm font-medium', cat === c ? 'border-deep bg-deep text-linen' : 'border-deep/15 bg-white text-deep hover:border-deep')}>
                  {c || (en ? 'All' : 'الكل')}
                </button>
              ))}
            </div>
          )}
          {shown.length ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {shown.map((a) => (
                <ArticleCard key={a.id} a={a} />
              ))}
            </div>
          ) : (
            <p className="text-slate">{en ? 'Articles are on the way.' : 'المقالات جاية قريب.'}</p>
          )}
        </div>
      </section>
    </>
  );
}
