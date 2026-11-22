import { MapPin, Clock, Phone } from 'lucide-react';
import { useLang } from '@/i18n';
import { useContent, imgSrc } from '@/lib/content';
import { useSettings } from '@/lib/settings';
import { track } from '@/lib/api';

/** Branches from Website > Branches (falls back to the clinic address in Settings). */
export function BranchCards({ className = 'grid gap-5 md:grid-cols-2 lg:grid-cols-3' }) {
  const { t, L } = useLang();
  const { branches } = useContent();
  const s = useSettings();
  const places = branches.length
    ? branches
    : s.address_ar
      ? [{ id: 0, name: { ar: '', en: '' }, address: { ar: s.address_ar, en: s.address_en || s.address_ar }, hours: { ar: s.hours_ar || '', en: s.hours_en || s.hours_ar || '' }, map_url: s.map_url, phone: '', image: '' }]
      : [];
  if (!places.length) return null;
  return (
    <div className={className}>
      {places.map((b) => (
        <div key={b.id} className="flex flex-col overflow-hidden rounded-3xl border border-deep/10 bg-white">
          {b.image && <img src={imgSrc(b.image)} alt={L(b.name)} loading="lazy" className="aspect-[16/9] w-full object-cover" />}
          <div className="flex flex-1 flex-col gap-3 p-7">
            {L(b.name) && <p className="font-display text-xl text-deep">{L(b.name)}</p>}
            <p className="flex gap-3 text-ink/75">
              <MapPin size={18} className="mt-1 shrink-0 text-amber" /> {L(b.address)}
            </p>
            {L(b.hours) && (
              <p className="flex gap-3 text-ink/75">
                <Clock size={18} className="mt-1 shrink-0 text-amber" /> {L(b.hours)}
              </p>
            )}
            {(b.phone || s.phone) && (
              <a href={`tel:${(b.phone || s.phone).replace(/\s/g, '')}`} onClick={() => track('call')} className="flex gap-3 text-ink/75 hover:text-deep">
                <Phone size={18} className="mt-1 shrink-0 text-amber" /> <span dir="ltr">{b.phone || s.phone}</span>
              </a>
            )}
            {b.map_url && (
              <a href={b.map_url} target="_blank" rel="noopener" onClick={() => track('map')} className="mt-auto inline-flex h-11 items-center justify-center rounded-full bg-deep px-5 text-sm font-medium text-linen transition-colors hover:bg-deep-700">
                {t('cta.map')}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
