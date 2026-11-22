import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';

// shadcn / 21st.dev style button with a sliding sheen on hover.
const variants = {
  primary: 'bg-deep text-white hover:bg-deep-700',
  // Navy text on Pulse Orange: 5:1 contrast (white on this orange is only 3:1).
  amber: 'bg-amber text-deep-950 hover:bg-[#ff8a55]',
  light: 'bg-white text-deep hover:bg-mist',
  outline: 'border border-deep/20 text-deep hover:border-deep/50 hover:bg-deep/5',
  ghostDark: 'border border-white/15 text-linen hover:border-white/35 hover:bg-white/5',
  ghost: 'text-deep hover:bg-deep/5',
};
const sizes = {
  sm: 'h-11 px-4 text-sm',
  md: 'h-12 px-6 text-[15px]',
  lg: 'h-14 px-8 text-base',
};

export const Button = forwardRef(function Button({ as, to, href, variant = 'primary', size = 'md', className, children, ...props }, ref) {
  const cls = cn(
    'group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-medium transition-all duration-300 ease-out active:scale-[.98] disabled:opacity-50 disabled:pointer-events-none',
    variants[variant],
    sizes[size],
    className
  );
  const inner = (
    <>
      <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 opacity-0 blur-md transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100" />
      <span className="relative inline-flex items-center gap-2.5">{children}</span>
    </>
  );
  if (to) return <Link ref={ref} to={to} className={cls} {...props}>{inner}</Link>;
  if (href) return <a ref={ref} href={href} className={cls} {...props}>{inner}</a>;
  const Comp = as || 'button';
  return <Comp ref={ref} className={cls} {...props}>{inner}</Comp>;
});
