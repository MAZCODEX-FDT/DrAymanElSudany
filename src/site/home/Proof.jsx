import { useLang } from '@/i18n';
import { press } from '@/data/content';
import CountUp from '@/components/reactbits/CountUp';
import AnimatedContent from '@/components/reactbits/AnimatedContent';
import { Marquee } from '@/components/ui/Marquee';

export function Proof() {
  const { t, L, lang } = useLang();
  const items = [
    { value: <CountUp to={715} duration={2.2} separator="," />, suffix: '+', text: t('proof.reviews') },
    { value: lang === 'en' ? '1 of a kind' : 'نادر', text: t('proof.rare') },
    { value: lang === 'en' ? '1st' : 'الأول', text: t('proof.first') },
  ];
  return (
    <section className="relative bg-linen py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <p className="eyebrow mb-12">{t('proof.eyebrow')}</p>
        <AnimatedContent stagger={0.15} distance={60} blur={8} className="grid gap-px overflow-hidden rounded-[2rem] border border-deep/10 bg-deep/10 md:grid-cols-3">
          {items.map((it, i) => (
            <div key={i} className="group relative bg-linen p-8 transition-colors duration-500 hover:bg-white sm:p-10">
              <div className="font-display flex items-baseline gap-1 text-5xl text-deep sm:text-6xl">
                {it.value}
                {it.suffix && <span className="text-amber">{it.suffix}</span>}
              </div>
              <div className="my-6 h-px w-12 bg-amber transition-all duration-700 group-hover:w-24" />
              <p className="text-lg leading-relaxed text-ink/75">{it.text}</p>
            </div>
          ))}
        </AnimatedContent>
        <div className="mt-16 flex flex-col items-center gap-6 sm:flex-row">
          <p className="shrink-0 text-sm text-slate">{t('proof.pressTitle')}</p>
          <Marquee speed={30} className="w-full">
            {[...press, ...press].map((p, i) => (
              <span key={i} className="font-display whitespace-nowrap text-2xl text-deep/35 sm:text-3xl">
                {L(p)}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
