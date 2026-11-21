import { Link } from 'react-router-dom';
import { useLang } from '@/i18n';
import { procedures } from '@/data/procedures';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import AnimatedContent from '@/components/reactbits/AnimatedContent';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProcedureIcon } from '@/components/ui/ProcedureIcon';
import { ArrowForward } from '@/components/ui/ArrowForward';
import { cn } from '@/lib/cn';

const spans = ['lg:col-span-3', 'lg:col-span-3', 'lg:col-span-2', 'lg:col-span-2', 'lg:col-span-2', 'lg:col-span-6'];

export function ProcedureCard({ p, i, className, big }) {
  const { L, to, t } = useLang();
  return (
    <Link to={to(`/procedures/${p.slug}`)} className={cn('group block h-full', className)}>
      <SpotlightCard theme="deep" spotlightSize={320} className={cn('flex h-full flex-col !p-8 sm:!p-10', big && 'lg:flex-row lg:items-center lg:gap-12')}>
        <div className="flex items-start justify-between">
          <span className="grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[.03] text-amber-soft transition-all duration-500 group-hover:border-amber/40 group-hover:bg-amber/10">
            <ProcedureIcon name={p.icon} className="h-9 w-9" />
          </span>
          {!big && <span className="font-mono text-sm text-linen/30">0{i + 1}</span>}
        </div>
        <div className={cn('mt-10', big && 'lg:mt-0 lg:flex-1')}>
          <h3 className="font-display text-2xl text-linen sm:text-[1.7rem]">{L(p.title)}</h3>
          <p className="mt-4 leading-relaxed text-linen/60">{L(p.short)}</p>
        </div>
        <span className="mt-8 inline-flex items-center gap-2 text-sm text-amber-soft lg:mt-auto lg:pt-8">
          {t('cta.readMore')}
          <ArrowForward size={16} className="transition-transform duration-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </span>
      </SpotlightCard>
    </Link>
  );
}

export function Procedures() {
  const { t } = useLang();
  return (
    <section className="bg-deep-glow on-dark relative overflow-hidden py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader dark eyebrow={t('procedures.eyebrow')} title={t('procedures.title')} sub={t('procedures.sub')} />
        <AnimatedContent stagger={0.1} distance={80} className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {procedures.map((p, i) => (
            <ProcedureCard key={p.slug} p={p} i={i} className={spans[i]} big={i === 5} />
          ))}
        </AnimatedContent>
      </div>
    </section>
  );
}
