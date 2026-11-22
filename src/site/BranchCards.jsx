import { MapPin, Clock, Phone } from 'lucide-react';
import { useLang } from '@/i18n';
import { useContent, imgSrc } from '@/lib/content';
import { useSettings, whatsappHref } from '@/lib/settings';
import { track } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/site/WhatsAppFab';
import { cn } from '@/lib/cn';

/** Places from Website > Branches, falling back to the clinic address in Settings. */
export function usePlaces() {
  const { branches } = useContent();
  const s = useSettings();
  if (branches.length) return branches;
  return s.address_ar ? [{ id: 0, name: { ar: '', en: '' }, address: { ar: s.address_ar, en: s.address_en || s.address_ar }, hours: { ar: s.hours_ar || '', en: s.hours_en || s.hours_ar || '' }, map_url: s.map_url, phone: '', whatsapp: '', image: '' }] : [];
}

function Details({ b, big }) {
  const { t, L } = useLang();
  const s = useSettings();
  const phone = b.phone || s.phone;
  return (
    <div className={cn('flex flex-col gap-4', big ? 'text-lg' : '')}>
      {L(b.name) && <p className={cn('font-display text-deep', big ? 'text-3xl sm:text-4xl' : 'text-xl')}>{L(b.name)}</p>}
      <p className="flex gap-3 text-ink/75">
        <MapPin size={big ? 22 : 18} className="mt-1 shrink-0 text-amber" /> {L(b.address)}
      </p>
      {L(b.hours) && (
        <p className="flex gap-3 text-ink/75">
          <Clock size={big ? 22 : 18} className="mt-1 shrink-0 text-amber" /> {L(b.hours)}
        </p>
      )}
      {phone && (
        <a href={`tel:${phone.replace(/\s/g, '')}`} onClick={() => track('call')} className="flex gap-3 text-ink/75 hover:text-deep">
          <Phone size={big ? 22 : 18} className="mt-1 shrink-0 text-amber" /> <span dir="ltr">{phone}</span>
        </a>
      )}
    </div>
  );
}

/**
 * One place: a wide card with photo, details and actions.
 * More than one (future branches): a grid of compact cards. Nothing changes in the code when a branch is added.
 */
export function BranchCards() {
  const { t, L, lang } = useLang();
  const s = useSettings();
  const places = usePlaces();
  if (!places.length) return null;

  if (places.length === 1) {
    const b = places[0];
    const wa = b.whatsapp ? whatsappHref({ whatsapp: b.whatsapp }, lang) : whatsappHref(s, lang);
    return (
      <div className={cn('grid overflow-hidden rounded-[2rem] border border-deep/10 bg-white', b.image && 'lg:grid-cols-2')}>
        {b.image && <img src={imgSrc(b.image)} alt={L(b.name)} loading="lazy" className="aspect-[16/10] h-full w-full object-cover lg:aspect-auto" />}
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <Details b={b} big />
          <div className="mt-8 flex flex-wrap gap-3">
            {b.map_url && (
              <Button href={b.map_url} target="_blank" rel="noopener" onClick={() => track('map')}>
                <MapPin size={18} /> {t('cta.map')}
              </Button>
            )}
            <Button href={wa} target="_blank" rel="noopener" onClick={() => track('whatsapp')} variant="outline">
              <WhatsAppIcon size={18} /> {t('cta.whatsapp')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {places.map((b) => (
        <div key={b.id} className="flex flex-col overflow-hidden rounded-3xl border border-deep/10 bg-white">
          {b.image && <img src={imgSrc(b.image)} alt={L(b.name)} loading="lazy" className="aspect-[16/9] w-full object-cover" />}
          <div className="flex flex-1 flex-col gap-6 p-7">
            <Details b={b} />
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

/** Section with a heading that reads right for one place or several. */
export function BranchSection({ className = 'bg-white py-20 sm:py-24' }) {
  const { lang } = useLang();
  const places = usePlaces();
  if (!places.length) return null;
  const one = places.length === 1;
  const en = lang === 'en';
  return (
    <section className={className}>
      <div className="mx-auto max-w-7xl px-6">
        <p className="eyebrow mb-4">{one ? (en ? 'The clinic' : 'العيادة') : en ? 'Our clinics' : 'أماكن الكشف'}</p>
        <h2 className="font-display mb-10 text-3xl text-deep sm:text-4xl">{one ? (en ? 'Where to find us' : 'مكان الكشف') : en ? 'Where to find us' : 'تقدر تكشف فين'}</h2>
        <BranchCards />
      </div>
    </section>
  );
}
