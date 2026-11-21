import { cn } from '@/lib/cn';
import { useLang } from '@/i18n';

// Official mark from the brand guide v1: an open circle with a line that rises and forks, ending at an amber dot.
export const RING = 'M 11.89 72.00 C 6.56 62.76 4.76 51.89 6.85 41.42 C 8.93 30.95 14.75 21.59 23.21 15.09 C 31.68 8.59 42.23 5.40 52.88 6.09 C 63.53 6.79 73.56 11.34 81.11 18.89 C 88.66 26.44 93.21 36.47 93.91 47.12 C 94.60 57.77 91.41 68.32 84.91 76.79 C 78.41 85.25 69.05 91.07 58.58 93.15 C 48.11 95.24 37.24 93.44 28.00 88.11';
export const PATH = 'M 24.00 92.00 C 27.00 74.00 44.00 70.00 47.00 56.00 C 49.00 47.00 52.00 43.00 56.00 40.00 M 47.00 56.00 C 45.50 48.00 41.00 42.50 34.50 38.50';

export function LogoMark({ className, light }) {
  return (
    <svg viewBox="0 0 100 100" className={cn('h-10 w-10', className)} aria-hidden>
      <path d={RING} fill="none" stroke={light ? '#D7E5EC' : '#2F6F8F'} strokeWidth="3.57" strokeLinecap="round" />
      <path d={PATH} fill="none" stroke={light ? '#FFFFFF' : '#0F3B57'} strokeWidth="8.5" strokeLinecap="round" />
      <circle cx="63" cy="33" r="7.5" fill="#D99A4E" />
    </svg>
  );
}

export function Logo({ light, className }) {
  const { t } = useLang();
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <LogoMark light={light} />
      <span className="leading-tight">
        <span className={cn('font-display block text-[17px]', light ? 'text-linen' : 'text-deep')}>{t('brand.name')}</span>
        <span className={cn('block text-[11.5px] tracking-wide', light ? 'text-linen/60' : 'text-slate')}>{t('brand.tagline')}</span>
      </span>
    </span>
  );
}
