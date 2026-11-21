import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowDown, Star } from 'lucide-react';
import { ArrowForward } from '@/components/ui/ArrowForward';
import { useLang } from '@/i18n';
import { useSettings, whatsappHref } from '@/lib/settings';
import { track } from '@/lib/api';
import { prefersReducedMotion } from '@/lib/smooth';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LogoMark, RING, PATH } from '@/components/ui/Logo';
import { WhatsAppIcon } from '@/site/WhatsAppFab';
import Threads from '@/components/reactbits/Threads';
import Magnet from '@/components/reactbits/Magnet';
import ShinyText from '@/components/reactbits/ShinyText';

function useWide() {
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 768);
  useEffect(() => {
    const m = window.matchMedia('(min-width: 768px)');
    const fn = () => setWide(m.matches);
    m.addEventListener('change', fn);
    return () => m.removeEventListener('change', fn);
  }, []);
  return wide;
}

export function Hero() {
  const { t, to, lang, dir } = useLang();
  const settings = useSettings();
  const root = useRef(null);
  const wide = useWide();
  const [photo, setPhoto] = useState(true);
  const words = t('hero.title').split(' ');

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('.h-badge', { y: 20, opacity: 0, duration: 1 })
        .from('.h-word', { yPercent: 110, opacity: 0, rotate: dir === 'rtl' ? -4 : 4, duration: 1.2, stagger: 0.07 }, '-=0.6')
        .from('.h-sub', { y: 24, opacity: 0, duration: 1 }, '-=0.8')
        .fromTo('.h-cta > *', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, clearProps: 'transform,opacity' }, '-=0.7')
        .from('.h-arch', { clipPath: 'inset(100% 0 0 0 round 999px 999px 32px 32px)', duration: 1.6, ease: 'expo.inOut' }, 0.2)
        .from('.h-chip', { scale: 0.8, opacity: 0, y: 20, duration: 0.9, stagger: 0.15, ease: 'back.out(1.6)' }, '-=0.6')
        .fromTo('.h-path', { strokeDashoffset: 260 }, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' }, 0.6);

      // Parallax on scroll
      gsap.to('.h-arch-inner', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.h-content', { y: -60, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.h-chip-a', { y: -30, repeat: -1, yoyo: true, duration: 3.2, ease: 'sine.inOut' });
      gsap.to('.h-chip-b', { y: 24, repeat: -1, yoyo: true, duration: 3.8, ease: 'sine.inOut' });
    },
    { scope: root, dependencies: [lang] }
  );

  return (
    <section ref={root} className="bg-deep-glow on-dark grain relative flex min-h-[100svh] items-center overflow-hidden text-linen">
      {wide && !prefersReducedMotion() ? (
        <div className="absolute inset-0 opacity-60">
          <Threads color={[0.92, 0.75, 0.55]} accentColor={[0.35, 0.62, 0.75]} amplitude={1.1} distance={0.25} lineCount={56} thickness={0.5} speed={0.35} angle={dir === 'rtl' ? -18 : 18} enableMouseInteraction />
        </div>
      ) : (
        <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 400 800" preserveAspectRatio="none" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M-20 ${640 + i * 22}C120 ${600 + i * 18} 160 ${380 + i * 14} 260 ${330 + i * 12}S380 ${190 + i * 10} 440 ${120 + i * 8}`} fill="none" stroke={i % 2 ? '#2F6F8F' : '#D99A4E'} strokeOpacity={0.6 - i * 0.08} />
          ))}
        </svg>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-deep-900 to-transparent" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-6 pb-24 pt-36 lg:grid-cols-12 lg:pt-32">
        <div className="h-content lg:col-span-7">
          <div className="h-badge">
            <Badge dark>{t('hero.eyebrow')}</Badge>
          </div>
          <h1 className="font-display mt-8 text-[2.6rem] leading-[1.2] sm:text-6xl lg:text-[4.4rem] lg:leading-[1.12]">
            {words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-2 align-bottom">
                <span className={`h-word inline-block ${i >= words.length - 2 ? 'text-amber-soft' : ''}`}>{w}</span>
                {i < words.length - 1 && ' '}
              </span>
            ))}
          </h1>
          <p className="h-sub mt-7 max-w-xl text-lg leading-relaxed text-linen/70 sm:text-xl">{t('hero.sub')}</p>
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

        <div className="relative mx-auto w-full max-w-[420px] lg:col-span-5">
          <div className="h-arch relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2rem] border border-white/10 bg-gradient-to-b from-calm/40 via-deep to-deep-900">
            <div className="h-arch-inner absolute inset-0 scale-110">
              {photo ? (
                <img src="/images/dr-ayman.webp" alt={t('brand.fullName')} onError={() => setPhoto(false)} className="h-full w-full object-cover object-top" />
              ) : (
                <div className="grid h-full place-items-center">
                  <svg viewBox="0 0 100 100" className="w-2/3 overflow-visible" aria-hidden>
                    <circle cx="50" cy="50" r="60" fill="none" stroke="#D7E5EC" strokeOpacity=".08" />
                    <path className="h-path" d={RING} fill="none" stroke="#D7E5EC" strokeOpacity=".55" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="260" pathLength="260" />
                    <path className="h-path" d={PATH} fill="none" stroke="#F5F1EA" strokeWidth="5" strokeLinecap="round" strokeDasharray="260" pathLength="260" />
                    <circle cx="63" cy="33" r="5" fill="#D99A4E" />
                    <circle cx="63" cy="33" r="12" fill="none" stroke="#D99A4E" strokeOpacity=".35" className="animate-ping origin-[63px_33px]" style={{ animationDuration: '3s' }} />
                  </svg>
                </div>
              )}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-deep-900/90 to-transparent" />
            <div className="absolute inset-x-6 bottom-6">
              <ShinyText text={t('brand.fullName')} color="#f5f1ea" shineColor="#ebc08c" speed={3} className="font-display text-2xl" />
              <p className="mt-1 text-sm text-linen/60">{t('brand.tagline')} · {t('brand.city')}</p>
            </div>
          </div>

          <div className="h-chip h-chip-a glass absolute start-0 top-16 rounded-2xl px-5 py-4 shadow-2xl sm:-start-14">
            <div className="flex items-center gap-1 text-amber">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={14} fill="currentColor" className={i === 4 ? 'opacity-50' : ''} />
              ))}
            </div>
            <p className="mt-1.5 text-2xl font-semibold">
              715<span className="text-amber-soft">+</span>
            </p>
            <p className="text-xs text-linen/60">{lang === 'en' ? 'patient reviews' : 'تقييم من المرضى'}</p>
          </div>
          <div className="h-chip h-chip-b glass absolute end-0 bottom-28 max-w-[220px] rounded-2xl px-5 py-4 shadow-2xl sm:-end-10">
            <div className="flex items-center gap-2 text-xs text-amber-soft">
              <LogoMark light className="h-5 w-5" /> {t('hero.cardTitle')}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-linen/85">{t('hero.cardBody')}</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 start-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-linen/50 md:flex rtl:translate-x-1/2">
        {t('hero.scroll')}
        <span className="grid h-10 w-6 justify-center rounded-full border border-white/20 pt-2">
          <ArrowDown size={12} className="animate-bounce" />
        </span>
      </div>
    </section>
  );
}
