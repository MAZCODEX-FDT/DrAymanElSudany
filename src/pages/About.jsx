import { Award, MapPin, Newspaper } from 'lucide-react';
import { useLang } from '@/i18n';
import { about, press } from '@/data/content';
import { Seo } from '@/site/Seo';
import { PageHero } from '@/site/PageHero';
import { ClosingCta } from '@/site/home/ClosingCta';
import ScrollReveal from '@/components/reactbits/ScrollReveal';
import AnimatedContent from '@/components/reactbits/AnimatedContent';
import CountUp from '@/components/reactbits/CountUp';

export default function About() {
  const { t, L, lang } = useLang();
  return (
    <>
      <Seo title={t('nav.about')} description={L(about.intro)} />
      <PageHero eyebrow={t('about.eyebrow')} title={t('about.title')} sub={L(about.intro)} />
      <section className="bg-linen py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <ScrollReveal key={lang} baseOpacity={0.15} baseRotation={0} textClassName="font-display text-2xl leading-[1.6] text-deep sm:text-4xl sm:leading-[1.5]">
            {L(about.philosophy)}
          </ScrollReveal>
        </div>
      </section>
      <section className="bg-linen pb-24">
        <AnimatedContent stagger={0.12} className="mx-auto grid max-w-7xl gap-5 px-6 md:grid-cols-3">
          <div className="rounded-3xl bg-deep p-9 text-linen">
            <p className="font-display text-6xl text-amber-soft">
              <CountUp to={715} separator="," />+
            </p>
            <p className="mt-4 text-linen/70">{t('proof.reviews')}</p>
          </div>
          <div className="rounded-3xl border border-deep/10 bg-white p-9">
            <Newspaper className="text-calm" />
            <p className="font-display mt-6 text-xl text-deep">{t('proof.first')}</p>
            <p className="mt-3 text-slate">{press.map(L).join(' · ')}</p>
          </div>
          <div className="rounded-3xl border border-deep/10 bg-white p-9">
            <MapPin className="text-calm" />
            <p className="font-display mt-6 text-xl text-deep">{lang === 'en' ? 'Serving' : 'بيخدم مرضى'}</p>
            <p className="mt-3 leading-relaxed text-slate">{L(about.areas).join(' · ')}</p>
          </div>
        </AnimatedContent>
      </section>
      <section className="bg-sand/60 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="eyebrow mb-8">{lang === 'en' ? 'Qualifications' : 'المؤهلات'}</p>
          <ul className="grid gap-4 md:grid-cols-3">
            {about.credentials.map((c, i) => (
              <li key={i} className="flex items-center gap-4 rounded-2xl border border-dashed border-deep/20 bg-linen p-6 text-ink/60">
                <Award className="shrink-0 text-amber" /> {L(c)}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <ClosingCta />
    </>
  );
}
