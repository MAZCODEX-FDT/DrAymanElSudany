import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, CalendarCheck, X, MapPin } from 'lucide-react';
import { useLang } from '@/i18n';
import { useSettings, whatsappHref } from '@/lib/settings';
import { track } from '@/lib/api';
import { usePlaces } from './BranchCards';
import { WhatsAppIcon } from './WhatsAppFab';

const PICK = 'aes-branch';
const tel = (p) => (p ? `tel:${p.replace(/\s/g, '')}` : '');
const dist = (a, b) => {
  const r = Math.PI / 180;
  const x = (b.lng - a.lng) * r * Math.cos(((a.lat + b.lat) / 2) * r);
  const y = (b.lat - a.lat) * r;
  return x * x + y * y;
};

/**
 * The place call/WhatsApp buttons go to. One place: that one. Several: the one the visitor picked before,
 * else the nearest one when location permission was already given (we never prompt for it), else null (show a picker).
 */
function useNearest(places) {
  const [id, setId] = useState(() => {
    try {
      return Number(localStorage.getItem(PICK)) || null;
    } catch {
      return null;
    }
  });
  useEffect(() => {
    if (places.length < 2 || id || !navigator.permissions || !navigator.geolocation) return;
    const withCoords = places.filter((p) => p.lat && p.lng);
    if (withCoords.length < 2) return;
    navigator.permissions
      .query({ name: 'geolocation' })
      .then((st) => {
        if (st.state !== 'granted') return;
        navigator.geolocation.getCurrentPosition(({ coords }) => {
          const me = { lat: coords.latitude, lng: coords.longitude };
          setId([...withCoords].sort((a, b) => dist(me, a) - dist(me, b))[0].id);
        });
      })
      .catch(() => {});
  }, [places, id]);
  const choose = (pid) => {
    setId(pid);
    try {
      localStorage.setItem(PICK, String(pid));
    } catch {
      /* optional */
    }
  };
  if (places.length === 1) return [places[0], choose];
  return [places.find((p) => p.id === id) || null, choose];
}

/**
 * WhatsApp and call on every page. Desktop: two floating buttons. Mobile: a fixed bottom bar
 * (WhatsApp, call, book) with 56px targets, and a spacer so it never covers the footer.
 */
export function ContactDock() {
  const { t, lang, L, to } = useLang();
  const s = useSettings();
  const places = usePlaces();
  const [place, choose] = useNearest(places);
  const [picker, setPicker] = useState(null);
  const en = lang === 'en';

  const phoneOf = (p) => p?.phone || s.phone || '';
  const waOf = (p) => (p?.whatsapp ? whatsappHref({ whatsapp: p.whatsapp }, lang) : whatsappHref(s, lang));
  const needsPick = places.length > 1 && !place && places.some((p) => p.phone || p.whatsapp);
  const phone = phoneOf(place);
  const hasPhone = needsPick ? places.some((p) => phoneOf(p)) : !!phone;
  const ext = (href) => (href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {});

  const onTap = (kind) => (e) => {
    if (needsPick) {
      e.preventDefault();
      setPicker(kind);
      return;
    }
    track(kind);
  };

  const wa = waOf(place);
  return (
    <>
      {/* desktop */}
      <div className="fixed bottom-8 end-8 z-40 hidden flex-col items-end gap-3 sm:flex">
        {hasPhone && (
          <a href={needsPick ? '#' : tel(phone)} onClick={onTap('call')} aria-label={t('cta.call')} className="group flex min-h-14 items-center gap-3 rounded-full bg-deep p-4 text-linen shadow-lg transition-all hover:pe-6">
            <Phone size={22} />
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-500 group-hover:max-w-40">{t('cta.call')}</span>
          </a>
        )}
        <a href={needsPick ? '#' : wa} {...(needsPick ? {} : ext(wa))} onClick={onTap('whatsapp')} aria-label={t('cta.whatsapp')} className="group flex min-h-14 items-center gap-3 rounded-full bg-[#1f9d55] p-4 text-white shadow-lg transition-all hover:pe-6">
          <span className="relative">
            <span className="absolute inset-0 animate-ping rounded-full bg-white/30 motion-reduce:hidden" />
            <WhatsAppIcon size={26} />
          </span>
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-500 group-hover:max-w-40">{t('cta.whatsapp')}</span>
        </a>
      </div>

      {/* mobile */}
      <div className="h-[calc(4.5rem+env(safe-area-inset-bottom))] sm:hidden" aria-hidden />
      <nav aria-label={en ? 'Contact the clinic' : 'تواصل مع العيادة'} className="fixed inset-x-0 bottom-0 z-40 border-t border-deep/10 bg-white/95 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur sm:hidden">
        <div className="flex gap-2">
          <a href={needsPick ? '#' : wa} {...(needsPick ? {} : ext(wa))} onClick={onTap('whatsapp')} className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#1f9d55] text-[15px] font-semibold text-white">
            <WhatsAppIcon size={22} /> {en ? 'WhatsApp' : 'واتساب'}
          </a>
          {hasPhone && (
            <a href={needsPick ? '#' : tel(phone)} onClick={onTap('call')} className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-deep text-[15px] font-semibold text-linen">
              <Phone size={20} /> {en ? 'Call' : 'اتصل'}
            </a>
          )}
          <Link to={to('/book')} className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-deep text-[15px] font-semibold text-deep">
            <CalendarCheck size={20} /> {en ? 'Book' : 'احجز'}
          </Link>
        </div>
      </nav>

      {picker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-deep-900/50 sm:items-center" onClick={() => setPicker(null)} role="dialog" aria-modal="true" aria-label={en ? 'Choose a clinic' : 'اختار العيادة'}>
          <div className="w-full max-w-md rounded-t-3xl bg-white p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-2xl text-deep">{en ? 'Which clinic is closer to you?' : 'أنهى عيادة أقرب ليك؟'}</p>
              <button type="button" onClick={() => setPicker(null)} className="grid h-11 w-11 place-items-center rounded-full text-slate hover:bg-mist" aria-label={t('nav.close')}>
                <X size={20} />
              </button>
            </div>
            <ul className="flex flex-col gap-2">
              {places.map((p) => {
                const href = picker === 'call' ? tel(phoneOf(p)) : waOf(p);
                if (!href) return null;
                return (
                  <li key={p.id}>
                    <a
                      href={href}
                      {...ext(href)}
                      onClick={() => {
                        choose(p.id);
                        track(picker);
                        setPicker(null);
                      }}
                      className="flex min-h-14 items-start gap-3 rounded-2xl border border-deep/10 p-4 hover:border-deep"
                    >
                      <MapPin size={18} className="mt-1 shrink-0 text-amber" />
                      <span>
                        <span className="block font-medium text-deep">{L(p.name) || L(p.address)}</span>
                        {L(p.name) && <span className="block text-sm text-slate">{L(p.address)}</span>}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
