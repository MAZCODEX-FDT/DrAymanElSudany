import { useRef } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Check, ShieldCheck, Info } from 'lucide-react';
import { useLang } from '@/i18n';
import { getProcedure, procedures } from '@/data/procedures';
import { useSettings, whatsappHref } from '@/lib/settings';
import { track } from '@/lib/api';
import { Seo } from '@/site/Seo';
import { PageHero } from '@/site/PageHero';
import { ClosingCta } from '@/site/home/ClosingCta';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { ProcedureIcon } from '@/components/ui/ProcedureIcon';
import { ArrowForward } from '@/components/ui/ArrowForward';
import { WhatsAppIcon } from '@/site/WhatsAppFab';
import AnimatedContent from '@/components/reactbits/AnimatedContent';

export default function Procedure() {
  const { slug } = useParams();
  const { t, L, to, lang } = useLang();
  const s = useSettings();
  const p = getProcedure(slug);
  const steps = useRef(null);

  useGSAP(
    () => {
      if (!steps.current) return;
      gsap.fromTo('.step-line', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: steps.current, start: 'top 70%', end: 'bottom 60%', scrub: true } });
      gsap.utils.toArray('.step-item').forEach((el) =>
        gsap.from(el, { x: lang === 'ar' ? 40 : -40, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 80%' } })
      );
    },
    { scope: steps, dependencies: [slug, lang] }
  );

  if (!p) return <Navigate to={to('/procedures')} replace />;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'MedicalProcedure', name: L(p.title), description: L(p.short), procedureType: 'https://schema.org/PercutaneousProcedure', howPerformed: L(p.steps.during) },
      { '@type': 'FAQPage', mainEntity: p.faqs.map((f) => ({ '@type': 'Question', name: L(f.q), acceptedAnswer: { '@type': 'Answer', text: L(f.a) } })) },
    ],
  };
  const waText = lang === 'en' ? `Hello, I have a question about ${L(p.title)}.` : `السلام عليكم، عندى سؤال عن ${L(p.title)}.`;
  const others = procedures.filter((x) => x.slug !== p.slug).slice(0, 3);

  return (
    <>
      <Seo title={L(p.title)} description={L(p.short)} jsonLd={jsonLd} />
      <PageHero eyebrow={t('procedures.eyebrow')} title={L(p.title)} sub={L(p.short)}>
        <Button href={whatsappHref(s, lang, waText)} target="_blank" rel="noopener" onClick={() => track('whatsapp')} variant="amber" size="lg">
          <WhatsAppIcon size={20} /> {t('cta.whatsapp')}
        </Button>
      </PageHero>

      <section className="bg-linen py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-4">
              <div className="grid h-24 w-24 place-items-center rounded-3xl bg-deep text-amber-soft">
                <ProcedureIcon name={p.icon} className="h-12 w-12" />
              </div>
              <nav className="rounded-3xl border border-deep/10 bg-white p-6">
                {[['what', t('procedures.whatIs')], ['who', t('procedures.whoFor')], ['steps', t('procedures.steps')], ['risk', t('procedures.risky')], ['cost', t('procedures.cost')], ['faq', t('procedures.faq')]].map(([id, label]) => (
                  <a key={id} href={`#${id}`} className="block rounded-xl px-3 py-2.5 text-ink/70 transition-colors hover:bg-mist/60 hover:text-deep">
                    {label}
                  </a>
                ))}
              </nav>
              <p className="flex gap-2 px-2 text-xs leading-relaxed text-slate">
                <Info size={14} className="mt-0.5 shrink-0" /> {t('procedures.pending')}
              </p>
            </div>
          </aside>
          <article className="space-y-20 lg:col-span-8">
            <AnimatedContent>
              <section id="what" className="scroll-mt-28">
                <h2 className="font-display text-3xl text-deep">{t('procedures.whatIs')}</h2>
                <p className="mt-6 text-lg leading-loose text-ink/80">{L(p.whatIs)}</p>
              </section>
            </AnimatedContent>
            <AnimatedContent>
              <section id="who" className="scroll-mt-28">
                <h2 className="font-display text-3xl text-deep">{t('procedures.whoFor')}</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {L(p.whoFor).map((w) => (
                    <li key={w} className="flex gap-3 rounded-2xl bg-mist/50 p-5 text-ink/80">
                      <Check size={18} className="mt-1 shrink-0 text-calm" /> {w}
                    </li>
                  ))}
                </ul>
              </section>
            </AnimatedContent>
            <section id="steps" ref={steps} className="scroll-mt-28">
              <h2 className="font-display text-3xl text-deep">{t('procedures.steps')}</h2>
              <div className="relative mt-10 space-y-10 ps-12">
                <span className="step-line absolute start-[19px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b from-amber to-calm" />
                {['before', 'during', 'after'].map((k, i) => (
                  <div key={k} className="step-item relative">
                    <span className="absolute -start-12 top-0 grid h-10 w-10 place-items-center rounded-full border-2 border-amber bg-linen font-mono text-sm text-deep">{i + 1}</span>
                    <h3 className="font-display text-xl text-deep">{t(`procedures.${k}`)}</h3>
                    <p className="mt-3 text-lg leading-relaxed text-ink/75">{L(p.steps[k])}</p>
                  </div>
                ))}
              </div>
            </section>
            <AnimatedContent>
              <section id="risk" className="scroll-mt-28 rounded-[2rem] bg-deep p-9 text-linen sm:p-12">
                <ShieldCheck className="text-amber-soft" size={32} />
                <h2 className="font-display mt-6 text-3xl">{t('procedures.risky')}</h2>
                <p className="mt-6 text-lg leading-loose text-linen/80">{L(p.risky)}</p>
              </section>
            </AnimatedContent>
            <AnimatedContent>
              <section id="cost" className="scroll-mt-28">
                <h2 className="font-display text-3xl text-deep">{t('procedures.cost')}</h2>
                <p className="mt-4 text-ink/70">{t('cost.sub')}</p>
                <ul className="mt-6 space-y-3">
                  {L(p.costFactors).map((c, i) => (
                    <li key={c} className="flex items-center gap-4 rounded-2xl border border-deep/10 bg-white p-5 text-ink/80">
                      <span className="font-mono text-sm text-amber">0{i + 1}</span> {c}
                    </li>
                  ))}
                </ul>
              </section>
            </AnimatedContent>
            <section id="faq" className="scroll-mt-28">
              <h2 className="font-display text-3xl text-deep">{t('procedures.faq')}</h2>
              <div className="mt-4">
                <Accordion items={p.faqs.map((f) => ({ q: L(f.q), a: L(f.a) }))} />
              </div>
            </section>
          </article>
        </div>
      </section>

      <section className="bg-sand/60 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl text-deep">{t('procedures.others')}</h2>
            <Link to={to('/procedures')} className="inline-flex items-center gap-2 text-calm hover:text-deep">
              {t('procedures.all')} <ArrowForward size={16} />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {others.map((o) => (
              <Link key={o.slug} to={to(`/procedures/${o.slug}`)} className="group rounded-3xl border border-deep/10 bg-linen p-7 transition-all hover:-translate-y-1 hover:bg-white">
                <ProcedureIcon name={o.icon} className="h-10 w-10 text-calm" />
                <h3 className="font-display mt-6 text-xl text-deep">{L(o.title)}</h3>
                <p className="mt-2 line-clamp-2 text-ink/65">{L(o.short)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ClosingCta />
    </>
  );
}
