import { cn } from '@/lib/cn';
import { useLang } from '@/i18n';

// Seamless CSS marquee (21st.dev pattern). Moves the right way in both RTL and LTR.
export function Marquee({ children, className, speed = 40, reverse }) {
  const { dir } = useLang();
  const name = (dir === 'rtl') !== !!reverse ? 'marquee-rtl' : 'marquee-ltr';
  return (
    <div className={cn('group relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]', className)}>
      {[0, 1].map((k) => (
        <div
          key={k}
          aria-hidden={k === 1}
          className="flex shrink-0 items-center gap-16 pe-16 group-hover:[animation-play-state:paused]"
          style={{ animation: `${name} ${speed}s linear infinite` }}
        >
          {children}
        </div>
      ))}
      <style>{'@keyframes marquee-ltr{from{transform:translateX(0)}to{transform:translateX(-100%)}}@keyframes marquee-rtl{from{transform:translateX(0)}to{transform:translateX(100%)}}'}</style>
    </div>
  );
}
