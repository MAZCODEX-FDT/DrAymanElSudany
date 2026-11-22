import { Award, Newspaper, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '@/i18n';
import { press } from '@/data/content';
import { useContent, imgSrc } from '@/lib/content';
import { BranchCards } from '@/site/BranchCards';
import { ProcedureIcon } from '@/components/ui/ProcedureIcon';
import { Seo } from '@/site/Seo';
import { PageHero } from '@/site/PageHero';
import { ClosingCta } from '@/site/home/ClosingCta';
import ScrollReveal from '@/components/reactbits/ScrollReveal';
import AnimatedContent from '@/components/reactbits/AnimatedContent';
import { cn } from '@/lib/cn';

// Everything on this page except the press names comes from the dashboard (Website > About the doctor / Images / Branches).
export default function About() {
  const { t, L, lang, to } = useLang();
  const { about, media, gallery, branches, procedures } = useContent();
  const en = lang === 'en';
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

      {about.steps.length > 0 && (
        <section className="bg-deep-glow on-dark grain relative overflow-hidden py-24 text-linen">
          <div className="relative mx-auto max-w-7xl px-6">
            <p className="eyebrow mb-4">{en ? 'Your visit' : 'الكشف'}</p>
            <h2 className="font-display max-w-2xl text-3xl sm:text-4xl">{en ? 'How a visit with Dr. Ayman goes' : 'الكشف مع د. أيمن بيمشى إزاى'}</h2>
            <AnimatedContent stagger={0.1} className={cn('mt-12 grid gap-5 sm:grid-cols-2', about.steps.length >= 4 && 'lg:grid-cols-4', about.steps.length === 3 && 'lg:grid-cols-3')}>
              {about.steps.map((st, i) => (
                <div key={st.id} className="rounded-3xl border border-white/10 bg-white/[.04] p-7">
                  <span className="font-display text-4xl text-amber-soft">{String(i + 1).padStart(2, '0')}</span>
                  <p className="font-display mt-6 text-xl">{L(st.title)}</p>
                  <p className="mt-3 leading-relaxed text-linen/70">{L(st.body)}</p>
                </div>
              ))}
            </AnimatedContent>
          </div>
        </section>
      )}

      {procedures.length > 0 && (
        <section className="bg-linen py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="eyebrow mb-4">{t('nav.procedures')}</p>
                <h2 className="font-display max-w-2xl text-3xl text-deep sm:text-4xl">{en ? 'What Dr. Ayman treats' : 'الحالات اللى د. أيمن بيتعامل معاها'}</h2>
              </div>
              <Link to={to('/procedures')} className="inline-flex items-center gap-2 font-medium text-calm hover:text-deep">
                {t('procedures.all')} ({procedures.length}) <ArrowUpRight size={18} className="rtl:-scale-x-100" />
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {procedures.map((p) => (
                <Link key={p.id} to={to(`/procedures/${p.slug}`)} className="group flex min-w-0 items-center gap-4 rounded-2xl border border-deep/10 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-deep/25">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-mist text-deep">
                    <ProcedureIcon name={p.icon} className="h-8 w-8" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-deep">{L(p.title)}</span>
                    <span className="mt-0.5 block truncate text-sm text-slate">{L(p.short)}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {about.credentials.length > 0 && (
        <section className="bg-sand/60 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <p className="eyebrow mb-8">{en ? 'Qualifications' : 'المؤهلات'}</p>
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
            <p className="eyebrow mb-8">{en ? 'The clinic' : 'العيادة'}</p>
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
            <p className="eyebrow mb-8">{en ? 'Where to find us' : 'أماكن الكشف'}</p>
            <BranchCards />
          </div>
        </section>
      )}
      <ClosingCta />
    </>
  );
}
