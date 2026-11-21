import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Check } from 'lucide-react';
import { useLang } from '@/i18n';
import { personas } from '@/data/content';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { cn } from '@/lib/cn';

export function Personas() {
  const { t, L, lang } = useLang();
  const [active, setActive] = useState(0);
  const panel = useRef(null);
  const p = personas[active];

  useGSAP(
    () => {
      gsap.fromTo(panel.current.children, { y: 30, opacity: 0, filter: 'blur(6px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.08, duration: 0.7, ease: 'power3.out' });
    },
    { dependencies: [active, lang] }
  );

  return (
    <section className="bg-linen py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow={t('families.eyebrow')} title={t('families.title')} />
        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          <div role="tablist" className="flex gap-2 overflow-x-auto pb-2 lg:col-span-4 lg:flex-col lg:overflow-visible">
            {personas.map((x, i) => (
              <button
                key={x.key}
                role="tab"
                aria-selected={active === i}
                onClick={() => setActive(i)}
                className={cn(
                  'relative shrink-0 rounded-2xl px-6 py-5 text-start text-lg transition-all duration-500',
                  active === i ? 'bg-deep text-linen shadow-[0_20px_40px_-20px_rgba(15,59,87,.7)]' : 'text-deep/70 hover:bg-deep/5'
                )}
              >
                <span className="font-display">{L(x.tab)}</span>
              </button>
            ))}
          </div>
          <div ref={panel} className="rounded-[2rem] border border-deep/10 bg-white p-8 sm:p-12 lg:col-span-8">
            <p className="text-sm text-slate">{lang === 'en' ? 'Their worry' : 'بيقلق من'}</p>
            <p className="mt-2 text-xl text-ink/80">{L(p.fear)}</p>
            <p className="font-display mt-10 text-3xl leading-snug text-deep sm:text-4xl">«{L(p.message)}»</p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              {L(p.points).map((pt) => (
                <li key={pt} className="flex gap-3 rounded-2xl bg-mist/50 p-5 text-ink/80">
                  <Check size={18} className="mt-1 shrink-0 text-calm" /> {pt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
