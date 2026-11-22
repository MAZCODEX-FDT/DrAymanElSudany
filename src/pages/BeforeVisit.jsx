import { useState } from 'react';
import { ClipboardList, UtensilsCrossed, Pill, CalendarCheck, HeartHandshake, AlertTriangle, Printer, Check } from 'lucide-react';
import { useLang } from '@/i18n';
import { useSettings, whatsappHref } from '@/lib/settings';
import { track } from '@/lib/api';
import { Seo } from '@/site/Seo';
import { PageHero } from '@/site/PageHero';
import { Button } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/site/WhatsAppFab';
import { guideSections, warningSigns, guideNote } from '@/data/visitGuide';
import { cn } from '@/lib/cn';

const ICONS = { ClipboardList, UtensilsCrossed, Pill, CalendarCheck, HeartHandshake };
const KEY = 'aes-guide-ticks';

function useTicks() {
  const [ticks, setTicks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '{}');
    } catch {
      return {};
    }
  });
  const toggle = (k) =>
    setTicks((prev) => {
      const next = { ...prev, [k]: !prev[k] };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* optional */
      }
      return next;
    });
  return [ticks, toggle];
}

/** "Before your visit": what to bring, fasting, medicines, the day itself, aftercare and warning signs. Prints as a one-sheet. */
export default function BeforeVisit() {
  const { L, lang, t } = useLang();
  const s = useSettings();
  const en = lang === 'en';
  const [ticks, toggle] = useTicks();
  const title = en ? 'Before your visit' : 'قبل زيارتك';
  const sub = en ? 'What to bring, how to prepare, and what happens on the day. We explain before we begin.' : 'تجيب معاك إيه، تجهز إزاى، وإيه اللى هيحصل يوم الإجراء. بنشرحلك قبل ما نبدأ.';
  const print = () => {
    track('form');
    window.print();
  };
  const wa = whatsappHref(s, lang, en ? 'Hello, I have a question about preparing for my visit.' : 'السلام عليكم، عندى سؤال عن التجهيز للزيارة.');

  return (
    <>
      <Seo title={title} description={sub} />
      <div className="print:hidden">
        <PageHero eyebrow={en ? 'Patient guide' : 'دليل المريض'} title={title} sub={sub}>
          <div className="flex flex-wrap gap-3">
            <Button onClick={print} variant="amber">
              <Printer size={18} /> {en ? 'Download or print the sheet' : 'حمّل أو اطبع الورقة'}
            </Button>
            <Button href={wa} target="_blank" rel="noopener" onClick={() => track('whatsapp')} variant="ghostDark">
              <WhatsAppIcon size={18} /> {en ? 'Ask on WhatsApp' : 'اسأل على واتساب'}
            </Button>
          </div>
        </PageHero>
      </div>

      {/* print-only header */}
      <div className="hidden px-8 pt-6 print:block">
        <p className="font-display text-2xl text-deep">{t('brand.fullName')}</p>
        <p className="text-sm text-slate">
          {t('brand.tagline')}
          {s.phone && <span dir="ltr"> · {s.phone}</span>}
          {s.whatsapp && <span dir="ltr"> · WhatsApp {s.whatsapp}</span>}
        </p>
        <h1 className="font-display mt-4 text-3xl text-deep">{title}</h1>
      </div>

      <section className="bg-linen py-16 sm:py-20 print:bg-white print:py-4">
        <div className="mx-auto max-w-5xl px-6 print:px-8">
          <nav aria-label={en ? 'Sections' : 'الأقسام'} className="-mx-6 mb-10 flex gap-2 overflow-x-auto px-6 pb-2 print:hidden">
            {guideSections.map((g) => (
              <a key={g.id} href={`#${g.id}`} className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-deep/15 bg-white px-5 text-sm font-medium text-deep hover:border-deep">
                {L(g.title)}
              </a>
            ))}
            <a href="#warning" className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-[#B42318]/30 bg-white px-5 text-sm font-medium text-[#B42318]">
              {L(warningSigns.title).split(/[:،,]/)[0]}
            </a>
          </nav>

          <div className="grid gap-6 print:gap-3">
            {guideSections.map((g, gi) => {
              const Icon = ICONS[g.icon] || ClipboardList;
              return (
                <article key={g.id} id={g.id} className="scroll-mt-28 rounded-3xl border border-deep/10 bg-white p-7 sm:p-10 print:break-inside-avoid print:rounded-none print:border-0 print:border-b print:p-0 print:pb-3">
                  <div className="flex items-start gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mist text-deep print:hidden">
                      <Icon size={22} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate">{String(gi + 1).padStart(2, '0')}</p>
                      <h2 className="font-display text-2xl text-deep sm:text-3xl print:text-xl">{L(g.title)}</h2>
                      <p className="mt-2 leading-relaxed text-ink/70 print:text-sm">{L(g.intro)}</p>
                    </div>
                  </div>
                  <ul className="mt-6 grid gap-2 sm:grid-cols-2 print:mt-2 print:gap-1">
                    {g.items.map((it, i) => {
                      const k = `${g.id}-${i}`;
                      const on = !!ticks[k];
                      return (
                        <li key={k}>
                          <button
                            type="button"
                            onClick={() => toggle(k)}
                            aria-pressed={on}
                            className={cn('flex min-h-12 w-full items-start gap-3 rounded-2xl p-3 text-start transition-colors hover:bg-linen print:min-h-0 print:p-0', on && 'text-ink/50')}
                          >
                            <span className={cn('mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border-2', on ? 'border-deep bg-deep text-linen' : 'border-deep/30')}>{on && <Check size={14} />}</span>
                            <span className={cn('leading-relaxed print:text-sm', on && 'line-through')}>{L(it)}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </article>
              );
            })}

            <article id="warning" className="scroll-mt-28 rounded-3xl border-2 border-[#B42318]/30 bg-[#FEF3F2] p-7 sm:p-10 print:break-inside-avoid print:rounded-none print:p-3">
              <div className="flex items-center gap-3 text-[#B42318]">
                <AlertTriangle size={24} />
                <h2 className="font-display text-2xl sm:text-3xl print:text-xl">{L(warningSigns.title)}</h2>
              </div>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2 print:mt-2 print:gap-1">
                {warningSigns.items.map((it, i) => (
                  <li key={i} className="flex gap-3 leading-relaxed text-ink print:text-sm">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B42318]" /> {L(it)}
                  </li>
                ))}
              </ul>
              {s.phone && (
                <a href={`tel:${s.phone.replace(/\s/g, '')}`} onClick={() => track('call')} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#B42318] px-6 font-medium text-white print:hidden">
                  {t('cta.call')} <span dir="ltr">{s.phone}</span>
                </a>
              )}
            </article>
          </div>

          <p className="mt-8 text-sm leading-relaxed text-slate print:mt-3 print:text-xs">{L(guideNote)}</p>
          <div className="mt-8 print:hidden">
            <Button onClick={print} variant="outline">
              <Printer size={18} /> {en ? 'Download or print the sheet' : 'حمّل أو اطبع الورقة'}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
