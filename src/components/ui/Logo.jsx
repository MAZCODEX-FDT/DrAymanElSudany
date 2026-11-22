import { cn } from '@/lib/cn';
import { useLang } from '@/i18n';

// Logo option A (branding/v3/logos, master files): the mark joins the أ of Ayman (tall stroke, orange point) to the س of
// El Sudany (rising teeth and bowl). The name is set in Reem Kufi (logo only); the footer uses the outlined master lockup.
export const MARK_VIEWBOX = '0 0 750 1000';
export const MARK_PATH =
  'M 501.12 743.20 C 483.13 1041.94 98.86 1069.53 0.00 761.33 L 36.25 755.29 C 138.97 960.73 422.96 942.60 429.00 712.99 L 429.00 501.51 L 501.51 465.26 L 501.51 676.74 L 549.85 676.74 L 549.85 344.41 L 622.36 308.16 L 622.36 676.74 L 670.69 676.74 L 670.69 175.23 L 743.20 138.97 L 743.20 743.20 L 501.12 743.20 Z';
export const MARK_DOT = { cx: 706.95, cy: 42.3, r: 42.3 };

const PALETTES = {
  color: ['#1B2D8F', '#F26A2E'],
  reverse: ['#FFFFFF', '#F26A2E'],
  // Tonal version used huge and cropped on Neuro Blue backgrounds.
  tonal: ['#2C44BC', '#F26A2E'],
};

/** The mark. variant: color | reverse | tonal. */
export function Emblem({ variant = 'color', weight, className, dotClassName, ...props }) { // eslint-disable-line no-unused-vars
  const [glyph, dot] = PALETTES[variant] ?? PALETTES.color;
  return (
    <svg viewBox={MARK_VIEWBOX} className={className} aria-hidden {...props}>
      <path className="emblem-contour" d={MARK_PATH} fill={glyph} />
      <circle className={dotClassName} cx={MARK_DOT.cx} cy={MARK_DOT.cy} r={MARK_DOT.r} fill={dot} />
    </svg>
  );
}

export function LogoMark({ className, light }) {
  return <Emblem variant={light ? 'reverse' : 'color'} className={cn('h-10 w-10', className)} />;
}

const KUFI = { fontFamily: '"Reem Kufi", Cairo, sans-serif' };
const OUTFIT = { fontFamily: 'Outfit, sans-serif' };

/** Header lockup: mark + the name in the page language + specialty line. Never "Sudany" alone. */
export function Logo({ light, className }) {
  const { lang } = useLang();
  const name = light ? 'text-white' : 'text-deep';
  const sub = light ? 'text-amber-soft' : 'text-amber-ink';
  return (
    // Always composed left-to-right like the master lockup: mark on the left, name on the right.
    <span className={cn('inline-flex items-center gap-2.5', className)} dir="ltr">
      <LogoMark light={light} className="h-11 w-9 shrink-0" />
      <span className={cn('leading-tight', lang === 'en' ? 'text-left' : 'text-right')}>
        {lang === 'en' ? (
          <>
            <span className={cn('block text-[19px] font-semibold tracking-tight', name)} style={OUTFIT}>
              Dr. Ayman El Sudany
            </span>
            <span className={cn('block text-[10px] tracking-[0.16em]', light ? 'text-linen/70' : 'text-slate')} style={OUTFIT}>
              Neurology &amp; Neuro-Intervention
            </span>
          </>
        ) : (
          <>
            <span className={cn('block text-[22px] font-bold leading-none', name)} style={KUFI}>
              د. أيمن السودانى
            </span>
            <span className={cn('mt-1 block text-[12px] font-medium', sub)} style={KUFI}>
              مخ وأعصاب وقسطرة المخ
            </span>
          </>
        )}
      </span>
    </span>
  );
}

/** Full bilingual lockup (option A master file, text outlined). */
export function LogoFull({ light, tight, className }) {
  // tight: cropped to the artwork (no safe-area padding), for the header and menu.
  const [w, h] = tight ? [1495, 548] : [1615, 668];
  return (
    <img
      src={`${import.meta.env.BASE_URL}brand/logo-horizontal-${light ? 'reverse' : 'color'}${tight ? '-tight' : ''}.svg`}
      alt="د. أيمن السودانى · Dr. Ayman El Sudany"
      width={w}
      height={h}
      className={cn('h-auto w-72', className)}
    />
  );
}
