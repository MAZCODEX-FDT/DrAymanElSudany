import { cn } from '@/lib/cn';
import { useLang } from '@/i18n';

// Seamless CSS marquee (21st.dev pattern). Moves the right way in both RTL and LTR, pauses on hover, focus or touch,
// and becomes a swipeable row for visitors who turn off animations (prefers-reduced-motion).
// `repeat` repeats the children inside each copy, so a short list still fills a wide screen without a gap.
export function Marquee({ children, className, trackClassName, speed = 40, reverse, repeat = 1, label }) {
  const { dir } = useLang();
  const name = (dir === 'rtl') !== !!reverse ? 'marquee-rtl' : 'marquee-ltr';
  const items = Array.from({ length: Math.max(1, repeat) }, (_, i) => <Repeat key={i}>{children}</Repeat>);
  return (
    <div
      role={label ? 'region' : undefined}
      aria-label={label}
      className={cn(
        'group relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]',
        'motion-reduce:snap-x motion-reduce:overflow-x-auto motion-reduce:[mask-image:none]',
        className
      )}
    >
      {[0, 1].map((k) => (
        <div
          key={k}
          aria-hidden={k === 1}
          inert={k === 1 ? '' : undefined}
          className={cn(
            'flex shrink-0 items-center gap-16 pe-16 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] group-active:[animation-play-state:paused]',
            'motion-reduce:![animation:none]',
            k === 1 && 'motion-reduce:hidden',
            trackClassName
          )}
          style={{ animation: `${name} ${speed}s linear infinite` }}
        >
          {items}
        </div>
      ))}
      <style>{'@keyframes marquee-ltr{from{transform:translateX(0)}to{transform:translateX(-100%)}}@keyframes marquee-rtl{from{transform:translateX(0)}to{transform:translateX(100%)}}'}</style>
    </div>
  );
}

const Repeat = ({ children }) => children;
