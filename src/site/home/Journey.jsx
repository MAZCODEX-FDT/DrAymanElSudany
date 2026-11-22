import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { MessageCircle, CalendarClock, Stethoscope, FileText, HeartPulse, ClipboardCheck } from 'lucide-react';
import { useLang } from '@/i18n';
import { journey } from '@/data/content';
import { prefersReducedMotion } from '@/lib/smooth';

const ICONS = [MessageCircle, CalendarClock, Stethoscope, FileText, HeartPulse, ClipboardCheck];

/** Pinned horizontal scroll through the patient journey (desktop); stacked cards on mobile. */
export function Journey() {
  const { t, L, dir, lang } = useLang();
  const root = useRef(null);
  const track = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        if (prefersReducedMotion()) return;
        const distance = () => track.current.scrollWidth - window.innerWidth;
        const tween = gsap.to(track.current, {
          x: () => (dir === 'rtl' ? distance() : -distance()),
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: 1, pin: true, invalidateOnRefresh: true },
        });
        gsap.utils.toArray('.j-card').forEach((card) => {
          gsap.from(card.querySelector('.j-num'), {
            opacity: 0.1,
            scale: 0.7,
            scrollTrigger: { trigger: card, containerAnimation: tween, start: dir === 'rtl' ? 'right 85%' : 'left 85%', end: dir === 'rtl' ? 'right 45%' : 'left 45%', scrub: true },
          });
        });
        gsap.fromTo('.j-progress', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [lang] }
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-sand lg:h-screen">
      <div className="j-progress absolute inset-x-0 top-0 h-1 origin-[var(--o)] bg-amber" style={{ '--o': dir === 'rtl' ? 'right' : 'left' }} />
      <div ref={track} className="flex flex-col gap-6 px-6 py-24 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-8 lg:px-[8vw] lg:py-0">
        <div className="lg:w-[34vw] lg:shrink-0 lg:pe-12">
          <p className="eyebrow mb-5">{t('journey.eyebrow')}</p>
          <h2 className="font-display text-balance text-4xl leading-[1.25] text-deep sm:text-5xl">{t('journey.title')}</h2>
        </div>
        {journey.map((s, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <article key={s.n} className="j-card relative flex flex-col rounded-[2rem] border border-deep/10 bg-linen p-8 shadow-[0_30px_60px_-40px_rgba(15,59,87,.5)] sm:p-9 lg:w-[22rem] lg:shrink-0 xl:w-[24rem]">
              <div className="flex items-center justify-between">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-deep text-linen">
                  <Icon size={26} />
                </span>
                <span className="j-num font-display text-6xl leading-none text-amber">{s.n}</span>
              </div>
              <h3 className="font-display mt-8 text-2xl text-deep sm:text-3xl">{L(s.title)}</h3>
              <p className="mt-3 text-lg leading-relaxed text-ink/70">{L(s.body)}</p>
            </article>
          );
        })}
        <div className="hidden lg:block lg:w-[10vw] lg:shrink-0" />
      </div>
    </section>
  );
}
