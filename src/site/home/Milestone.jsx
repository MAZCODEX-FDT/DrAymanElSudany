import { useLang } from '@/i18n';
import { press } from '@/data/content';
import { Button } from '@/components/ui/Button';
import { ArrowForward } from '@/components/ui/ArrowForward';
import { Emblem } from '@/components/ui/Logo';
import AnimatedContent from '@/components/reactbits/AnimatedContent';

/** Home: the first brain catheterization in Sharqia (October 2026). The one place the site names a region, on purpose. */
export function Milestone() {
  const { t, L, to, lang } = useLang();
  return (
    <section className="on-dark relative overflow-hidden bg-deep py-24 text-white sm:py-32">
      <Emblem variant="tonal" weight={1.2} className="pointer-events-none absolute -top-[20%] -start-[40%] w-[110vw] max-w-none opacity-60 lg:-start-[18%] lg:w-[60vw]" />
      <AnimatedContent stagger={0.12} className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="relative mx-auto aspect-square w-full max-w-[280px] rounded-full bg-amber p-8 sm:max-w-[420px] sm:p-10 text-deep">
            <div className="flex h-full flex-col items-center justify-center text-center">
              {lang === 'en' ? (
                <span className="text-[5.5rem] font-bold leading-none sm:text-[7rem]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  1<span className="align-top text-[0.45em]">st</span>
                </span>
              ) : (
                <span className="font-display text-7xl leading-tight sm:text-8xl">{t('milestone.factFirst')}</span>
              )}
              <span className="font-display mt-4 text-2xl sm:text-3xl">{t('milestone.date')}</span>
              <span className="mt-2 max-w-[14rem] text-sm leading-relaxed text-deep/80">{t('milestone.factFirstText')}</span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <p className="eyebrow mb-5">{t('milestone.eyebrow')}</p>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">{t('milestone.title')}</h2>
          <p className="mt-8 max-w-2xl text-lg leading-loose text-white/80">{t('milestone.body')}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 pt-8">
            <span className="text-sm text-white/60">{t('milestone.pressTitle')}</span>
            {press.map((p, i) => (
              <a key={i} href={p.url} target="_blank" rel="noopener" className="font-display text-2xl text-white/90 underline decoration-amber/60 decoration-2 underline-offset-8 transition-colors hover:text-amber-soft hover:decoration-amber">
                {L(p)}
              </a>
            ))}
          </div>
          <div className="mt-10">
            <Button to={to('/about')} variant="ghostDark" size="lg">
              {t('milestone.cta')} <ArrowForward size={18} />
            </Button>
          </div>
        </div>
      </AnimatedContent>
    </section>
  );
}
