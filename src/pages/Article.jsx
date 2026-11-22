import { useMemo } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { useLang } from '@/i18n';
import { useContent, imgSrc } from '@/lib/content';
import { useSettings, whatsappHref } from '@/lib/settings';
import { track } from '@/lib/api';
import { Seo } from '@/site/Seo';
import { PageHero } from '@/site/PageHero';
import { RichText, plainText } from '@/site/RichText';
import { Button } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/site/WhatsAppFab';
import { ArticleCard } from './Articles';

export default function Article() {
  const { slug } = useParams();
  const { L, lang, to, t } = useLang();
  const s = useSettings();
  const { articles, fresh } = useContent();
  const en = lang === 'en';
  const a = articles.find((x) => x.slug === slug);
  const jsonLd = useMemo(
    () =>
      a && {
        '@context': 'https://schema.org',
        '@type': 'MedicalWebPage',
        headline: L(a.title),
        description: L(a.excerpt),
        inLanguage: lang,
        datePublished: a.date || undefined,
        image: a.image ? new URL(imgSrc(a.image), window.location.origin).href : undefined,
        author: { '@type': 'Physician', name: t('brand.fullName') },
      },
    [a, lang] // eslint-disable-line react-hooks/exhaustive-deps
  );
  if (!a) return fresh ? <Navigate to={to('/articles')} replace /> : <div className="min-h-screen bg-deep" />;
  const more = articles.filter((x) => x.id !== a.id).slice(0, 3);
  const wa = whatsappHref(s, lang, en ? `Hello, I read "${L(a.title)}" and have a question.` : `السلام عليكم، قريت «${L(a.title)}» وعندى سؤال.`);

  return (
    <>
      <Seo title={L(a.title)} description={L(a.excerpt) || plainText(L(a.body)).slice(0, 155)} jsonLd={jsonLd} />
      <PageHero eyebrow={L(a.category)} title={L(a.title)} sub={L(a.excerpt)} />
      <article className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6">
          {a.image && <img src={imgSrc(a.image)} alt="" className="mb-6 aspect-[16/9] w-full rounded-3xl object-cover" />}
          <RichText text={L(a.body)} />
          <div className="mt-12 rounded-3xl bg-linen p-7 sm:p-9">
            <p className="font-display text-2xl text-deep">{en ? 'Have a question about your own case?' : 'عندك سؤال عن حالتك أنت؟'}</p>
            <p className="mt-2 text-ink/70">{en ? 'Send it with your scans and we reply fast.' : 'ابعته مع الأشعة وهنرد عليك بسرعة.'}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={wa} target="_blank" rel="noopener" onClick={() => track('whatsapp')}>
                <WhatsAppIcon size={18} /> {t('cta.whatsapp')}
              </Button>
              <Button to={to('/book')} variant="outline">
                {t('cta.book')}
              </Button>
            </div>
          </div>
          <p className="mt-8 text-sm leading-relaxed text-slate">
            {en ? 'General information, not a diagnosis. Your own plan is decided with the doctor at your visit.' : 'معلومات عامة، مش تشخيص. خطة حالتك بتتحدد مع الدكتور فى الكشف.'}
          </p>
        </div>
      </article>
      {more.length > 0 && (
        <section className="bg-linen py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="font-display text-3xl text-deep">{en ? 'More answers' : 'إجابات تانية'}</h2>
              <Link to={to('/articles')} className="inline-flex min-h-11 items-center font-medium text-deep underline-offset-4 hover:underline">
                {en ? 'All articles' : 'كل المقالات'}
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {more.map((x) => (
                <ArticleCard key={x.id} a={x} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
