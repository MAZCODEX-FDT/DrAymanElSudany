import { useState } from 'react';
import { MapPin, Clock, Phone, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useLang } from '@/i18n';
import { useSettings, whatsappHref } from '@/lib/settings';
import { useContent, imgSrc } from '@/lib/content';
import { submitLead, track } from '@/lib/api';
import { attribution, trackLead } from '@/lib/analytics';
import { Link } from 'react-router-dom';
import { Seo } from '@/site/Seo';
import { PageHero } from '@/site/PageHero';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select, Textarea, Segmented } from '@/components/ui/Form';
import { WhatsAppIcon } from '@/site/WhatsAppFab';

export default function Book() {
  const { t, L, lang, to } = useLang();
  const en = lang === 'en';
  const s = useSettings();
  const { branches, media } = useContent();
  const places = branches.length
    ? branches
    : [{ id: 0, name: { ar: '', en: '' }, address: { ar: s.address_ar, en: s.address_en }, hours: { ar: s.hours_ar, en: s.hours_en }, map_url: s.map_url, phone: '', image: '' }];
  const [form, setForm] = useState({ name: '', phone: '', relation: 'self', reason: '', preferred: '', notes: '', hasScans: false });
  const [state, setState] = useState('idle');
  const set = (k) => (e) => setForm({ ...form, [k]: e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e });

  const waSummary = [
    en ? 'New booking request from the website' : 'طلب حجز جديد من الموقع',
    `${t('book.name')}: ${form.name}`,
    `${t('book.phone')}: ${form.phone}`,
    form.reason && `${t('book.reason')}: ${form.reason}`,
    form.preferred && `${t('book.preferred')}: ${form.preferred}`,
    form.notes && `${en ? 'Notes' : 'ملاحظات'}: ${form.notes}`,
  ]
    .filter(Boolean)
    .join('\n');

  const submit = async (e) => {
    e.preventDefault();
    setState('sending');
    try {
      await submitLead({ type: 'booking', name: form.name, phone: form.phone, payload: { relation: form.relation, reason: form.reason, preferred: form.preferred, notes: form.notes, hasScans: form.hasScans, lang, ...attribution() } });
      track('form');
      trackLead('booking', form.reason);
      setState('done');
    } catch {
      setState('error');
    }
  };

  return (
    <>
      <Seo title={t('nav.book')} description={t('book.sub')} />
      <PageHero eyebrow={t('book.eyebrow')} title={t('book.title')} sub={t('book.sub')} image={media.book?.url} imageAlt={media.book ? L(media.book.alt) : ''} />
      <section className="bg-linen py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-[2rem] border border-deep/10 bg-white/60 p-7 shadow-[0_40px_80px_-50px_rgba(15,59,87,.5)] sm:p-10">
              {state === 'done' ? (
                <div className="py-16 text-center">
                  <CheckCircle2 size={56} className="mx-auto text-calm" />
                  <p className="font-display mt-6 text-2xl text-deep">{t('book.success')}</p>
                  {s.whatsapp && (
                    <>
                      <p className="mx-auto mt-4 max-w-md text-ink/70">{en ? 'Want a faster reply? Send the same details to the clinic on WhatsApp.' : 'عايز رد أسرع؟ ابعت نفس التفاصيل للعيادة على واتساب.'}</p>
                      <Button className="mt-6" href={whatsappHref(s, lang, waSummary)} target="_blank" rel="noopener" onClick={() => track('whatsapp')}>
                        <WhatsAppIcon size={18} /> {en ? 'Send on WhatsApp' : 'ابعتها على واتساب'}
                      </Button>
                    </>
                  )}
                  <p className="mt-8">
                    <Link to={to('/before-your-visit')} className="inline-flex min-h-11 items-center font-medium text-deep underline underline-offset-4">
                      {en ? 'Before your visit: what to bring and how to prepare' : 'قبل زيارتك: تجيب معاك إيه وتجهز إزاى'}
                    </Link>
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="grid gap-6 sm:grid-cols-2">
                  <Field label={t('book.name')}>
                    <Input required value={form.name} onChange={set('name')} autoComplete="name" />
                  </Field>
                  <Field label={t('book.phone')}>
                    <Input required type="tel" dir="ltr" inputMode="tel" pattern="[0-9+ ]{10,15}" value={form.phone} onChange={set('phone')} autoComplete="tel" placeholder="01xxxxxxxxx" />
                  </Field>
                  <div className="sm:col-span-2">
                    <span className="mb-2 block text-sm font-medium text-deep/80">{t('book.relation')}</span>
                    <Segmented name="relation" value={form.relation} onChange={set('relation')} options={[['self', t('book.self')], ['parent', t('book.parent')], ['other', t('book.other')]]} />
                  </div>
                  <Field label={t('book.reason')}>
                    <Select required value={form.reason} onChange={set('reason')}>
                      <option value="" />
                      {t('book.reasons').map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label={t('book.preferred')}>
                    <Input type="date" value={form.preferred} onChange={set('preferred')} min={new Date().toISOString().slice(0, 10)} />
                  </Field>
                  <Field label={t('book.notes')} className="sm:col-span-2">
                    <Textarea value={form.notes} onChange={set('notes')} />
                  </Field>
                  <label className="flex items-center gap-3 text-ink/75 sm:col-span-2">
                    <input type="checkbox" checked={form.hasScans} onChange={set('hasScans')} className="h-5 w-5 accent-[#1B2D8F]" />
                    {t('book.hasScans')}
                  </label>
                  {state === 'error' && <p className="text-sm text-[#B8461A] sm:col-span-2">{t('book.error')}</p>}
                  <div className="flex flex-wrap gap-3 sm:col-span-2">
                    <Button type="submit" size="lg" disabled={state === 'sending'}>
                      {state === 'sending' ? t('cta.sending') : t('cta.send')}
                    </Button>
                    <Button href={whatsappHref(s, lang)} target="_blank" rel="noopener" onClick={() => track('whatsapp')} variant="outline" size="lg">
                      <WhatsAppIcon size={18} /> {t('cta.whatsapp')}
                    </Button>
                  </div>
                </form>
              )}
            </div>
            <p className="mt-6 flex gap-3 rounded-2xl bg-sand p-5 text-sm leading-relaxed text-ink/80">
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber" /> {t('book.emergency')}
            </p>
          </div>
          <aside className="space-y-5 lg:col-span-5">
            {places.map((b) => (
              <div key={b.id} className="overflow-hidden rounded-[2rem] bg-deep text-linen">
                {b.image && <img src={imgSrc(b.image)} alt={L(b.name)} loading="lazy" className="aspect-[16/9] w-full object-cover" />}
                <div className="p-8">
                  {L(b.name) && <p className="font-display mb-6 text-xl">{L(b.name)}</p>}
                  <div className="space-y-6">
                    <a href={b.map_url || '#'} target="_blank" rel="noopener" onClick={() => track('map')} className="flex gap-4">
                      <MapPin className="shrink-0 text-amber-soft" />
                      <span>
                        <span className="block text-sm text-linen/55">{t('book.address')}</span>
                        {L(b.address)}
                      </span>
                    </a>
                    {L(b.hours) && (
                      <div className="flex gap-4">
                        <Clock className="shrink-0 text-amber-soft" />
                        <span>
                          <span className="block text-sm text-linen/55">{t('book.hours')}</span>
                          {L(b.hours)}
                        </span>
                      </div>
                    )}
                    {(b.phone || s.phone) && (
                      <a href={`tel:${(b.phone || s.phone).replace(/\s/g, '')}`} onClick={() => track('call')} className="flex gap-4">
                        <Phone className="shrink-0 text-amber-soft" />
                        <span>
                          <span className="block text-sm text-linen/55">{t('cta.call')}</span>
                          <span dir="ltr">{b.phone || s.phone}</span>
                        </span>
                      </a>
                    )}
                  </div>
                  {b.map_url && (
                    <Button href={b.map_url} target="_blank" rel="noopener" onClick={() => track('map')} variant="ghostDark" className="mt-8 w-full">
                      {t('cta.map')}
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <div className="rounded-[2rem] border border-deep/10 bg-white p-8">
              <FileText className="text-calm" />
              <p className="font-display mt-5 text-lg text-deep">{t('book.bring')}</p>
              <p className="mt-2 leading-relaxed text-ink/70">{t('book.bringList')}</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
