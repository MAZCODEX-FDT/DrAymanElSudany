import { Award, MapPin, Newspaper, Clock } from 'lucide-react';
import { useLang } from '@/i18n';
import { press } from '@/data/content';
import { useContent, imgSrc } from '@/lib/content';
import { track } from '@/lib/api';
import { Seo } from '@/site/Seo';
import { PageHero } from '@/site/PageHero';
import { ClosingCta } from '@/site/home/ClosingCta';
import ScrollReveal from '@/components/reactbits/ScrollReveal';
import AnimatedContent from '@/components/reactbits/AnimatedContent';
import { cn } from '@/lib/cn';

// Everything on this page except the press names comes from the dashboard (Website > About the doctor / Images / Branches).
export default function About() {
  const { t, L, lang } = useLang();
  const { about, media, gallery, branches } = useContent();
  const intro = about.intro ? L(about.intro.body) : '';
  const photo = media.about_doctor;

  return (
    <>
      <Seo title={t('nav.about')} description={intro} />
      <PageHero eyebrow={t('about.eyebrow')} title={t('about.title')} sub={intro} image={photo?.url} imageAlt={photo ? L(photo.alt) : ''} />

      {about.statement && L(about.statement.body) && (
        <section className="bg-linen py-24 sm:py-32">
          <div className="mx-auto max-w-5xl px-6">
            <ScrollReveal key={lang + about.statement.id} baseOpacity={0.15} baseRotation={0} textClassName="font-display text-2xl leading-[1.6] text-deep sm:text-4xl sm:leading-[1.5]">
              {L(about.statement.body)}
            </ScrollReveal>
          </div>
        </section>
      )}

      {about.highlights.length > 0 && (
        <section className="bg-linen pb-24">
          <AnimatedContent stagger={0.12} className="mx-auto grid max-w-7xl gap-5 px-6 md:grid-cols-3">
            {about.highlights.map((h, i) => (
              <div key={h.id} className={cn('rounded-3xl p-9', i === 0 ? 'bg-deep text-linen' : 'border border-deep/10 bg-white')}>
                {i === 1 ? <Newspaper className="text-calm" /> : null}
                <p className={cn('font-display text-5xl', i === 0 ? 'text-amber-soft' : 'mt-4 text-deep')}>{L(h.title)}</p>
                <p className={cn('mt-4', i === 0 ? 'text-linen/70' : 'text-slate')}>{L(h.body)}</p>
              </div>
            ))}
          </AnimatedContent>
          <p className="mx-auto mt-6 max-w-7xl px-6 text-sm text-slate">
            {t('proof.pressTitle')}: {press.map(L).join(' · ')}
          </p>
        </section>
      )}

      {about.sections.map((s, i) => (
        <section key={s.id} className={cn('py-20', i % 2 ? 'bg-white' : 'bg-linen')}>
          <AnimatedContent className={cn('mx-auto grid max-w-7xl items-center gap-12 px-6', s.image && 'lg:grid-cols-2')}>
            <div className={cn(s.image && i % 2 && 'lg:order-2')}>
              {L(s.title) && <h2 className="font-display text-3xl text-deep sm:text-4xl">{L(s.title)}</h2>}
              <p className="mt-6 whitespace-pre-line text-lg leading-loose text-ink/80">{L(s.body)}</p>
            </div>
            {s.image && <img src={imgSrc(s.image)} alt={L(s.title)} loading="lazy" className="aspect-[4/3] w-full rounded-[2rem] object-cover" />}
          </AnimatedContent>
        </section>
      ))}

      {about.credentials.length > 0 && (
        <section className="bg-sand/60 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <p className="eyebrow mb-8">{lang === 'en' ? 'Qualifications' : 'المؤهلات'}</p>
            <ul className="grid gap-4 md:grid-cols-3">
              {about.credentials.map((c) => (
                <li key={c.id} className="flex items-center gap-4 rounded-2xl border border-deep/10 bg-linen p-6 text-ink/75">
                  {c.image ? <img src={imgSrc(c.image)} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" /> : <Award className="shrink-0 text-amber" />}
                  <span>
                    {L(c.title)}
                    {L(c.body) && <span className="mt-1 block text-sm text-slate">{L(c.body)}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="bg-linen py-24">
          <div className="mx-auto max-w-7xl px-6">
            <p className="eyebrow mb-8">{lang === 'en' ? 'The clinic' : 'العيادة'}</p>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {gallery.map((g) => (
                <img key={g.id} src={imgSrc(g.url)} alt={L(g.alt)} loading="lazy" className="aspect-square w-full rounded-3xl object-cover" />
              ))}
            </div>
          </div>
        </section>
      )}

      {branches.length > 0 && (
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <p className="eyebrow mb-8">{lang === 'en' ? 'Where to find us' : 'أماكن الكشف'}</p>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {branches.map((b) => (
                <a key={b.id} href={b.map_url || '#'} target="_blank" rel="noopener" onClick={() => track('map')} className="group overflow-hidden rounded-3xl border border-deep/10 bg-linen transition-all hover:-translate-y-1">
                  {b.image && <img src={imgSrc(b.image)} alt={L(b.name)} loading="lazy" className="aspect-[16/9] w-full object-cover" />}
                  <div className="space-y-3 p-7">
                    <p className="font-display text-xl text-deep">{L(b.name)}</p>
                    <p className="flex gap-3 text-ink/75">
                      <MapPin size={18} className="mt-1 shrink-0 text-amber" /> {L(b.address)}
                    </p>
                    {L(b.hours) && (
                      <p className="flex gap-3 text-ink/75">
                        <Clock size={18} className="mt-1 shrink-0 text-amber" /> {L(b.hours)}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
      <ClosingCta />
    </>
  );
}
