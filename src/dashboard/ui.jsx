import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X } from 'lucide-react';
import { useLang } from '@/i18n';
import { cn } from '@/lib/cn';
import { D } from './i18n';

export function useD() {
  const { lang } = useLang();
  return (k) => D[k]?.[lang] ?? k;
}

export function Card({ title, action, children, className }) {
  return (
    <section className={cn('rounded-3xl border border-deep/[.07] bg-white p-6 shadow-[0_1px_2px_rgba(15,59,87,.04),0_20px_40px_-32px_rgba(15,59,87,.35)]', className)}>
      {(title || action) && (
        <header className="mb-5 flex items-center justify-between gap-4">
          {title && <h3 className="font-display text-[17px] text-deep">{title}</h3>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function Kpi({ icon: Icon, label, value, hint, tone = 'deep' }) {
  const tones = { deep: 'bg-deep text-linen', amber: 'bg-amber/15 text-[#8a5a1e]', calm: 'bg-mist text-deep', sand: 'bg-sand text-deep' };
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-deep/[.07] bg-white p-5 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-30px_rgba(15,59,87,.45)]">
      <div className="flex items-start justify-between">
        <p className="text-[13px] text-slate">{label}</p>
        {Icon && (
          <span className={cn('grid h-9 w-9 place-items-center rounded-xl', tones[tone])}>
            <Icon size={17} />
          </span>
        )}
      </div>
      <p className="font-display mt-3 text-3xl text-deep">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate">{hint}</p>}
    </div>
  );
}

export const pillTones = {
  requested: 'bg-amber/15 text-[#8a5a1e]',
  confirmed: 'bg-mist text-deep',
  arrived: 'bg-calm/15 text-calm',
  completed: 'bg-[#e3efe7] text-[#2f6b49]',
  no_show: 'bg-sand text-[#7a5a3a]',
  cancelled: 'bg-slate/10 text-slate',
  open: 'bg-amber/15 text-[#8a5a1e]',
  handled: 'bg-[#e3efe7] text-[#2f6b49]',
};
export function Pill({ tone, children, className }) {
  return <span className={cn('inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium', pillTones[tone] || 'bg-mist text-deep', className)}>{children}</span>;
}

export function Drawer({ open, onClose, title, children, footer }) {
  const panel = useRef(null);
  const { dir } = useLang();
  useEffect(() => {
    if (open && panel.current) gsap.fromTo(panel.current, { xPercent: dir === 'rtl' ? -100 : 100 }, { xPercent: 0, duration: 0.5, ease: 'expo.out' });
  }, [open, dir]);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-deep-950/40 backdrop-blur-sm" onClick={onClose} />
      <div ref={panel} className="relative flex h-full w-full max-w-lg flex-col bg-linen shadow-2xl">
        <header className="flex items-center justify-between border-b border-deep/10 px-6 py-5">
          <h3 className="font-display text-xl text-deep">{title}</h3>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-deep/5" aria-label="close">
            <X size={18} />
          </button>
        </header>
        <div className="scroll-thin flex-1 space-y-5 overflow-y-auto px-6 py-6">{children}</div>
        {footer && <footer className="flex gap-3 border-t border-deep/10 px-6 py-4">{footer}</footer>}
      </div>
    </div>
  );
}

const inputCls = 'w-full rounded-xl border border-deep/15 bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-calm focus:ring-4 focus:ring-calm/10';
export function DField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-deep/75">{label}</span>
      {children}
    </label>
  );
}
export const DInput = (p) => <input {...p} className={cn(inputCls, p.className)} />;
export const DTextarea = (p) => <textarea rows={4} {...p} className={cn(inputCls, 'resize-none', p.className)} />;
export const DSelect = ({ children, ...p }) => (
  <select {...p} className={cn(inputCls, p.className)}>
    {children}
  </select>
);
export function DToggle({ checked, onChange, label }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3 text-sm text-ink/80">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn('relative h-6 w-11 rounded-full transition-colors', checked ? 'bg-deep' : 'bg-slate/30')}
      >
        <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', checked ? 'start-[22px]' : 'start-0.5')} />
      </button>
      {label}
    </label>
  );
}

export function Btn({ variant = 'primary', className, children, ...p }) {
  const v = {
    primary: 'bg-deep text-linen hover:bg-deep-700',
    amber: 'bg-amber text-deep-900 hover:bg-amber-soft',
    ghost: 'text-deep hover:bg-deep/5',
    outline: 'border border-deep/15 text-deep hover:bg-deep/5',
    danger: 'text-[#9a3b1e] hover:bg-[#9a3b1e]/10',
  };
  return (
    <button {...p} className={cn('inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium transition-all active:scale-[.98] disabled:opacity-50', v[variant], className)}>
      {children}
    </button>
  );
}

export function Empty({ children }) {
  return <div className="rounded-2xl border border-dashed border-deep/15 p-10 text-center text-sm text-slate">{children}</div>;
}

export function Segment({ value, onChange, options }) {
  return (
    <div className="inline-flex rounded-xl bg-deep/5 p-1">
      {options.map(([v, label]) => (
        <button key={v} onClick={() => onChange(v)} className={cn('rounded-lg px-3.5 py-1.5 text-sm transition-all', value === v ? 'bg-white text-deep shadow-sm' : 'text-slate hover:text-deep')}>
          {label}
        </button>
      ))}
    </div>
  );
}

export const fmtDate = (iso, lang) => (iso ? new Date(iso.length === 10 ? `${iso}T00:00` : iso).toLocaleDateString(lang === 'en' ? 'en-GB' : 'ar-EG-u-nu-latn', { day: 'numeric', month: 'short' }) : '');
export const fmtTime = (iso, lang) => new Date(iso).toLocaleTimeString(lang === 'en' ? 'en-GB' : 'ar-EG-u-nu-latn', { hour: '2-digit', minute: '2-digit' });
export const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
