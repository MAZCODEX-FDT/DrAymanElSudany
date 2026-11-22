import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock } from 'lucide-react';
import { useLang } from '@/i18n';
import { useSettings, whatsappHref, telHref } from '@/lib/settings';
import { track } from '@/lib/api';
import { useContent } from '@/lib/content';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  const { t, L, to, lang } = useLang();
  const s = useSettings();
  const { procedures, branches } = useContent();
  const places = branches.length
    ? branches
    : [{ id: 0, name: { ar: '', en: '' }, address: { ar: s.address_ar, en: s.address_en }, hours: { ar: s.hours_ar, en: s.hours_en }, map_url: s.map_url, phone: '' }];
  const year = new Date().getFullYear();
  return (
    <footer className="bg-deep-glow on-dark relative overflow-hidden text-linen">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo light />
            <p className="mt-6 max-w-sm leading-relaxed text-linen/65">{t('hero.sub')}</p>
          </div>
          <div className="md:col-span-3">
            <p className="eyebrow mb-5">{t('nav.procedures')}</p>
            <ul className="space-y-3">
              {procedures.slice(0, 7).map((p) => (
                <li key={p.slug}>
                  <Link to={to(`/procedures/${p.slug}`)} className="text-linen/70 transition-colors hover:text-amber-soft">
                    {L(p.title)}
                  </Link>
                </li>
              ))}
              {procedures.length > 7 && (
                <li>
                  <Link to={to('/procedures')} className="text-amber-soft hover:underline">
                    {t('procedures.all')}
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="eyebrow mb-5">{t('nav.menu')}</p>
            <ul className="space-y-3">
              {[['/about', 'nav.about'], ['/for-doctors', 'nav.doctors'], ['/faq', 'nav.faq'], ['/book', 'nav.book']].map(([h, k]) => (
                <li key={h}>
                  <Link to={to(h)} className="text-linen/70 transition-colors hover:text-amber-soft">
                    {t(k)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4 md:col-span-3">
            <p className="eyebrow mb-5">{t('book.address')}</p>
            {places.map((b) => (
              <div key={b.id} className="space-y-2">
                {L(b.name) && <p className="font-medium text-linen">{L(b.name)}</p>}
                <a href={b.map_url || '#'} onClick={() => track('map')} target="_blank" rel="noopener" className="flex gap-3 text-linen/70 hover:text-linen">
                  <MapPin size={18} className="mt-1 shrink-0 text-amber" /> {L(b.address)}
                </a>
                {L(b.hours) && (
                  <p className="flex gap-3 text-linen/70">
                    <Clock size={18} className="mt-1 shrink-0 text-amber" /> {L(b.hours)}
                  </p>
                )}
              </div>
            ))}
            {telHref(s) && (
              <a href={telHref(s)} onClick={() => track('call')} className="flex gap-3 text-linen/70 hover:text-linen" dir="ltr">
                <Phone size={18} className="mt-1 shrink-0 text-amber" /> {s.phone}
              </a>
            )}
            <a href={whatsappHref(s, lang)} onClick={() => track('whatsapp')} target="_blank" rel="noopener" className="inline-block text-amber-soft underline-offset-4 hover:underline">
              {t('cta.whatsapp')}
            </a>
          </div>
        </div>
        <div className="font-display pointer-events-none mt-20 select-none whitespace-nowrap text-center text-[8vw] leading-none text-white/[.04]">
          {t('brand.name')}
        </div>
        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-linen/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {t('brand.fullName')}. {t('footer.rights')}.
          </p>
          <p className="max-w-xl">{t('footer.disclaimer')}</p>
          <p>
            {t('footer.built')}{' '}
            <a href="https://mazcodex.com" target="_blank" rel="noopener" className="text-linen/70 hover:text-amber-soft">
              MAZCODEX
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
