import { Fragment, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowDown, Star } from 'lucide-react';
import { ArrowForward } from '@/components/ui/ArrowForward';
import { useLang } from '@/i18n';
import { useSettings, whatsappHref } from '@/lib/settings';
import { track } from '@/lib/api';
import { prefersReducedMotion } from '@/lib/smooth';
import { useContent, imgSrc } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LogoMark, Emblem } from '@/components/ui/Logo';
import { WhatsAppIcon } from '@/site/WhatsAppFab';
import Magnet from '@/components/reactbits/Magnet';


export function Hero() {
  const { t, L, to, lang, dir } = useLang();
  const settings = useSettings();
  const root = useRef(null);
  // The tagline reads as two beats: split after the comma / full stop so the second beat sits on its own line.
  const [lineA, lineB] = splitTagline(t('hero.title'));
  // Banner photo: Website > Images > hero_doctor. Without one, the column shows only the two cards.
  const photo = useContent().media.hero_doctor;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('.h-badge', { y: 20, opacity: 0, duration: 1 })
        .from('.h-word', { yPercent: 110, opacity: 0, duration: 1.2, stagger: 0.06 }, '-=0.6')
        .from('.h-sub', { y: 24, opacity: 0, duration: 1 }, '-=0.8')
        .fromTo('.h-cta > *', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, clearProps: 'transform,opacity' }, '-=0.7')
        .from('.h-emblem .emblem-contour', { scale: 0.6, opacity: 0, transformOrigin: '104px 98px', duration: 1.6, stagger: -0.18, ease: 'expo.out' }, 0.1)
        .from('.h-dot', { scale: 0, transformOrigin: '104px 98px', duration: 1.1, ease: 'back.out(2)' }, 0.7)
        .from('.h-chip', { y: 24, opacity: 0, duration: 0.9, stagger: 0.15 }, '-=0.6');

      // Scroll: the emblem drifts and the copy lifts away.
      gsap.to('.h-emblem', { yPercent: 10, rotate: dir === 'rtl' ? 6 : -6, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.h-content', { y: -60, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
    },
    { scope: root, dependencies: [lang] }
  );

  const word = (w, i, cls) => (
    <Fragment key={i}>
      <span className="inline-block overflow-hidden pb-2 align-bottom">
        <span className={`h-word inline-block ${cls}`}>{w}</span>
      </span>{' '}
    </Fragment>
  );

  return (
    <section ref={root} className="on-dark relative flex min-h-[100svh] items-center overflow-hidden bg-deep text-white">
      {/* The emblem, huge and cropped off the edge: the main graphic of brand v2. */}
      <Emblem
        variant="tonal"
        weight={1.2}
        dotClassName="h-dot"
        className="h-emblem pointer-events-none absolute -bottom-[30%] -end-[55%] w-[135vw] max-w-none sm:-end-[22%] sm:w-[95vw] lg:-bottom-[22%] lg:-end-[10%] lg:w-[66vw]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-6 pb-24 pt-36 lg:grid-cols-12 lg:pt-32">
        <div className="h-content lg:col-span-7">
          <div className="h-badge">
            <Badge dark>{t('hero.eyebrow')}</Badge>
          </div>
          <h1 className="font-display mt-8 text-[2.35rem] leading-[1.2] sm:text-6xl lg:text-[4.6rem] lg:leading-[1.1] ltr:lg:text-[3.8rem]">
            <span className="block">{lineA.split(' ').map((w, i) => word(w, i, ''))}</span>
            {lineB && <span className="block">{lineB.split(' ').map((w, i) => word(w, i, 'text-mist'))}</span>}
          </h1>
          <p className="h-sub mt-7 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">{t('hero.sub')}</p>
          <div className="h-cta mt-10 flex flex-wrap items-center gap-4">
            <Magnet padding={50} magnetStrength={4}>
              <Button href={whatsappHref(settings, lang)} target="_blank" rel="noopener" onClick={() => track('whatsapp')} variant="amber" size="lg">
                <WhatsAppIcon size={20} /> {t('cta.whatsapp')}
              </Button>
            </Magnet>
            <Button to={to('/procedures')} variant="ghostDark" size="lg">
              {t('cta.explore')} <ArrowForward size={18} />
            </Button>
          </div>
        </div>

        <div className={photo ? 'relative mx-auto w-full max-w-[420px] lg:col-span-5' : 'relative hidden h-[420px] lg:col-span-5 lg:block'}>
          {photo && <img src={imgSrc(photo.url)} alt={L(photo.alt) || t('brand.fullName')} className="aspect-[4/5] w-full rounded-[2rem] object-cover object-top" />}
          <div className={`h-chip absolute top-6 ${photo ? '-end-4 hidden sm:block' : 'end-0'} rounded-2xl bg-white px-5 py-4 text-ink`}>
            <div className="flex items-center gap-1 text-amber">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={14} fill="currentColor" className={i === 4 ? 'opacity-40' : ''} />
              ))}
            </div>
            <p className="mt-1.5 text-3xl font-bold text-deep" style={{ fontFamily: 'Outfit, sans-serif' }}>
              715<span className="text-amber">+</span>
            </p>
            <p className="text-xs text-slate">{lang === 'en' ? 'patient reviews' : 'تقييم من المرضى'}</p>
          </div>
          <div className={`h-chip absolute top-44 ${photo ? '-end-4 hidden sm:block' : 'end-0'} max-w-[250px] rounded-2xl bg-white px-5 py-4 text-ink`}>
            <div className="flex items-center gap-2 text-xs font-medium text-calm">
              <LogoMark className="h-5 w-5" /> {t('hero.cardTitle')}
            </div>
            <p className="mt-2 text-sm leading-relaxed">{t('hero.cardBody')}</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 start-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-white/60 md:flex rtl:translate-x-1/2">
        {t('hero.scroll')}
        <span className="grid h-10 w-6 justify-center rounded-full border border-white/25 pt-2">
          <ArrowDown size={12} className="animate-bounce" />
        </span>
      </div>
    </section>
  );
}

function splitTagline(s) {
  const m = s.match(/^(.+?[،,.])\s+(.+)$/);
  return m ? [m[1], m[2]] : [s, ''];
}
