import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/cn';

function Item({ q, a, open, onToggle, dark }) {
  const body = useRef(null);
  useGSAP(
    () => {
      gsap.to(body.current, { height: open ? 'auto' : 0, opacity: open ? 1 : 0, duration: 0.5, ease: 'power3.inOut' });
    },
    { dependencies: [open] }
  );
  return (
    <div className={cn('border-b', dark ? 'border-white/10' : 'border-deep/10')}>
      <button onClick={onToggle} aria-expanded={open} className="flex w-full items-center justify-between gap-6 py-6 text-start">
        <span className={cn('font-display text-lg sm:text-xl', dark ? 'text-linen' : 'text-deep')}>{q}</span>
        <span
          className={cn(
            'grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-500',
            open ? 'rotate-45 border-amber bg-amber text-deep-900' : dark ? 'border-white/15 text-linen' : 'border-deep/15 text-deep'
          )}
        >
          <Plus size={18} />
        </span>
      </button>
      <div ref={body} className="h-0 overflow-hidden opacity-0">
        <p className={cn('pb-7 pe-14 text-[17px] leading-loose', dark ? 'text-linen/70' : 'text-ink/75')}>{a}</p>
      </div>
    </div>
  );
}

export function Accordion({ items, dark, defaultOpen = 0 }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      {items.map((it, i) => (
        <Item key={it.id || i} {...it} dark={dark} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
      ))}
    </div>
  );
}
