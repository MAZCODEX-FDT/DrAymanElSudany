import { useLang } from '@/i18n';
import { costFactors } from '@/data/content';
import AnimatedContent from '@/components/reactbits/AnimatedContent';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function Cost() {
  const { t, L } = useLang();
  return (
    <section className="bg-linen py-28 sm:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeader eyebrow={t('cost.eyebrow')} title={t('cost.title')} sub={t('cost.sub')} />
        </div>
        <AnimatedContent stagger={0.12} distance={50} className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {costFactors.map((f, i) => (
            <div key={i} className="group rounded-3xl border border-deep/10 bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgba(15,59,87,.6)]">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-mist font-mono text-sm text-deep transition-colors group-hover:bg-deep group-hover:text-linen">0{i + 1}</span>
              <h3 className="font-display mt-8 text-xl text-deep">{L(f.title)}</h3>
              <p className="mt-3 leading-relaxed text-ink/70">{L(f.body)}</p>
            </div>
          ))}
        </AnimatedContent>
      </div>
    </section>
  );
}
