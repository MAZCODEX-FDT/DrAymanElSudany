import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import BlurText from '@/components/reactbits/BlurText';
import { cn } from '@/lib/cn';
import { imgSrc } from '@/lib/content';

/** Dark hero band for inner pages, with a slow drifting path line. */
export function PageHero({ eyebrow, title, sub, children, className, image, imageAlt = '' }) {
  const root = useRef(null);
  useGSAP(
    () => {
      gsap.fromTo('.ph-line', { strokeDashoffset: 1400 }, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut' });
      gsap.from('.ph-fade', { y: 24, opacity: 0, duration: 0.9, stagger: 0.12, delay: 0.3, ease: 'power3.out' });
    },
    { scope: root }
  );
  return (
    <section ref={root} className={cn('bg-deep-glow on-dark grain relative overflow-hidden pb-20 pt-40 text-linen sm:pb-28 sm:pt-48', className)}>
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-40" viewBox="0 0 1440 600" preserveAspectRatio="none" aria-hidden>
        <path className="ph-line" d="M-20 520C260 500 380 330 620 300s420-60 560-190 300-110 300-110" fill="none" stroke="#2E7BEF" strokeWidth="1.5" strokeDasharray="1400" />
        <path className="ph-line" d="M-20 560C300 540 420 380 660 350s420-70 560-200 300-120 300-120" fill="none" stroke="#F26A2E" strokeOpacity=".5" strokeWidth="1" strokeDasharray="1400" />
      </svg>
      <div className={cn('relative mx-auto max-w-7xl px-6', image && 'grid items-center gap-12 lg:grid-cols-12')}>
        <div className={cn(image && 'lg:col-span-7')}>
        {eyebrow && <p className="eyebrow ph-fade mb-6">{eyebrow}</p>}
        <BlurText key={title} as="h1" text={title} animateBy="words" delay={80} className="font-display text-balance max-w-4xl text-4xl leading-[1.2] sm:text-5xl lg:text-6xl" />
        {sub && <p className="ph-fade mt-7 max-w-2xl text-lg leading-relaxed text-linen/70">{sub}</p>}
        {children && <div className="ph-fade mt-10">{children}</div>}
        </div>
        {image && (
          <div className="ph-fade lg:col-span-5">
            <img src={imgSrc(image)} alt={imageAlt} className="aspect-[4/3] w-full rounded-[2rem] object-cover lg:aspect-[4/5]" loading="eager" />
          </div>
        )}
      </div>
    </section>
  );
}
