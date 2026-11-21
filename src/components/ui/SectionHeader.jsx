import { cn } from '@/lib/cn';
import BlurText from '@/components/reactbits/BlurText';

export function SectionHeader({ eyebrow, title, sub, dark, center, className }) {
  return (
    <div className={cn('max-w-3xl', center && 'mx-auto text-center', dark && 'on-dark', className)}>
      {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
      <BlurText
        key={title}
        text={title}
        animateBy="words"
        delay={70}
        className={cn('font-display text-balance text-3xl leading-[1.25] sm:text-4xl lg:text-5xl', center && 'justify-center', dark ? 'text-linen' : 'text-deep')}
      />
      {sub && <p className={cn('mt-6 text-lg leading-relaxed', dark ? 'text-linen/70' : 'text-slate')}>{sub}</p>}
    </div>
  );
}
