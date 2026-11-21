import { cn } from '@/lib/cn';

const base =
  'w-full rounded-2xl border bg-white px-5 py-4 text-[16px] text-ink outline-none transition-all placeholder:text-slate/60 focus:border-calm focus:ring-4 focus:ring-calm/10 border-deep/15';

export function Field({ label, children, className }) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-2 block text-sm font-medium text-deep/80">{label}</span>
      {children}
    </label>
  );
}
export const Input = ({ className, ...p }) => <input className={cn(base, className)} {...p} />;
export const Textarea = ({ className, ...p }) => <textarea rows={4} className={cn(base, 'resize-none', className)} {...p} />;
export const Select = ({ className, children, ...p }) => (
  <select className={cn(base, 'appearance-none bg-[length:16px] bg-no-repeat', className)} {...p}>
    {children}
  </select>
);

/** Segmented radio group (21st.dev style). */
export function Segmented({ options, value, onChange, name }) {
  return (
    <div className="grid gap-2 sm:auto-cols-fr sm:grid-flow-col" role="radiogroup">
      {options.map(([v, label]) => (
        <label
          key={v}
          className={cn(
            'cursor-pointer rounded-2xl border px-4 py-3.5 text-center text-[15px] transition-all',
            value === v ? 'border-deep bg-deep text-linen shadow-lg' : 'border-deep/15 bg-white text-ink/75 hover:border-deep/40'
          )}
        >
          <input type="radio" name={name} value={v} checked={value === v} onChange={() => onChange(v)} className="sr-only" />
          {label}
        </label>
      ))}
    </div>
  );
}
