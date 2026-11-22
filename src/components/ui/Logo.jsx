import { cn } from '@/lib/cn';
import { useLang } from '@/i18n';

// Brand v2 emblem: three brain contours closing in on an orange dot (the exact point).
// Geometry copied from branding/v2/logos/emblem-*.svg (viewBox 0 0 200 200).
export const BRAIN =
  'M38,108 C30,66 62,34 102,34 C144,32 176,58 174,94 C178,122 158,142 134,142 C128,158 108,162 98,150 C84,160 56,154 46,138 C38,130 36,120 38,108 Z';
export const CONTOURS = [
  { transform: 'translate(0 0) scale(1)', width: 12 },
  { transform: 'translate(31.2 29.4) scale(0.7)', width: 17.14 },
  { transform: 'translate(62.4 58.8) scale(0.4)', width: 30 },
];
export const DOT = { cx: 104, cy: 98, r: 11.4 };

const PALETTES = {
  color: ['#1B2D8F', '#2E7BEF', '#1B2D8F'],
  reverse: ['#FFFFFF', '#7FB2FF', '#FFFFFF'],
  // Tonal version used huge and cropped on Neuro Blue backgrounds.
  tonal: ['#2C44BC', '#2C44BC', '#2C44BC'],
};

/** The emblem. variant: color | reverse | tonal. `weight` thickens the strokes for the large cropped graphic. */
export function Emblem({ variant = 'color', weight = 1, className, dotClassName, ...props }) {
  const colors = PALETTES[variant] ?? PALETTES.color;
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden {...props}>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {CONTOURS.map((c, i) => (
          <path key={i} className="emblem-contour" d={BRAIN} transform={c.transform} stroke={colors[i]} strokeWidth={c.width * weight} />
        ))}
      </g>
      <circle className={dotClassName} cx={DOT.cx} cy={DOT.cy} r={DOT.r * (weight > 1 ? 1.2 : 1)} fill="#F26A2E" />
    </svg>
  );
}

export function LogoMark({ className, light }) {
  return <Emblem variant={light ? 'reverse' : 'color'} className={cn('h-10 w-10', className)} />;
}

/** Horizontal lockup: emblem + "Dr. Ayman" (bold) "El Sudany" (light). Never "Sudany" alone. */
export function Logo({ light, className }) {
  const { lang } = useLang();
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <LogoMark light={light} className="h-11 w-11" />
      <span className="leading-tight">
        {lang === 'en' ? (
          <span className={cn('block text-[18px] tracking-tight', light ? 'text-white' : 'text-deep')} style={{ fontFamily: 'Outfit, sans-serif' }}>
            <b className="font-bold">Dr. Ayman</b> <span className="font-light">El Sudany</span>
          </span>
        ) : (
          <span className={cn('block text-[18px]', light ? 'text-white' : 'text-deep')} style={{ fontFamily: 'Cairo, sans-serif' }}>
            <b className="font-bold">د. أيمن</b> <span className="font-normal">السودانى</span>
          </span>
        )}
        <span className={cn('block text-[9.5px] uppercase tracking-[0.22em]', light ? 'text-[#7FB2FF]' : 'text-calm')} style={{ fontFamily: 'Outfit, sans-serif' }}>
          Neurology · Neuro-intervention
        </span>
      </span>
    </span>
  );
}
