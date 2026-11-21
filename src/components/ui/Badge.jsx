import { cn } from '@/lib/cn';

// Animated "status pill" in the 21st.dev style: a pulsing dot plus label.
export function Badge({ children, dark, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium',
        dark ? 'glass text-linen/90' : 'border border-deep/10 bg-white/70 text-deep',
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber" />
      </span>
      {children}
    </span>
  );
}
