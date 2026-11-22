import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Check, FileText } from 'lucide-react';
import { referSteps, whenToRefer, whatToSend, reportIncludes, doctorFaqs } from '@/data/forDoctors';
import { Accordion } from '@/components/ui/Accordion';
import { useSettings, whatsappHref } from '@/lib/settings';
import { WhatsAppIcon } from '@/site/WhatsAppFab';
import { ProcedureIcon } from '@/components/ui/ProcedureIcon';
import { CheckCircle2, PhoneCall, FileCheck2, Undo2 } from 'lucide-react';
import { useLang } from '@/i18n';
import { submitLead, track } from '@/lib/api';
import { attribution, trackLead } from '@/lib/analytics';
import { Seo } from '@/site/Seo';
import { PageHero } from '@/site/PageHero';
import { useContent, imgSrc } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { Field, Input, Textarea, Segmented } from '@/components/ui/Form';
import AnimatedContent from '@/components/reactbits/AnimatedContent';

export default function ForDoctors() {
  const { t, L, lang, to } = useLang();
    const s = useSettings();
  const { procedures, media } = useContent();
  // The referring doctor's own details are remembered on this device, so the next referral only needs the patient.
  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem('aes-referrer') || '{}');
    } catch {
      return {};
    }
  })();
  const blankCase = { patientName: '', patientPhone: '', summary: '', urgency: 'routine' };
  const [f, setF] = useState({ docName: '', docSpecialty: '', docPhone: '', docCity: '', ...saved, ...blankCase });
  const [state, setState] = useState('idle');
  const set = (k) => (e) => setF({ ...f, [k]: e?.target ? e.target.value : e });
  const submit = async (e) => {
    e.preventDefault();
    setState('sending');
    try {
      await submitLead({
        type: 'referral',
        name: f.docName,
        phone: f.docPhone,
        payload: { specialty: f.docSpecialty, city: f.docCity, patient: f.patientName, patientPhone: f.patientPhone, summary: f.summary, urgency: f.urgency, lang, ...attribution() },
      });
      track('form');
      trackLead('referral');
      try {
        localStorage.setItem('aes-referrer', JSON.stringify({ docName: f.docName, docSpecialty: f.docSpecialty, docPhone: f.docPhone, docCity: f.docCity }));
      } catch {
        /* optional */
      }
      setState('done');
    } catch {
      setState('error');
    }
  };
  const promises = [
    [PhoneCall, t('refer.promise1')],
    [FileCheck2, t('refer.promise2')],
    [Undo2, t('refer.promise3')],
  ];
  const en = lang === 'en';
  const L2 = (x) => L(x);
  return (
    <>
      <Seo title={t('nav.doctors')} description={t('doctorsBand.sub')} />
      <PageHero className="!pb-14 !pt-32 sm:!pb-16 sm:!pt-36" eyebrow={t('nav.doctors')} title={t('doctorsBand.title')} sub={t('doctorsBand.sub')} />

      {/* 1. The form, first thing on the page */}
      <section id="refer" className="bg-linen py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <h2 className="font-display text-3xl text-deep sm:text-4xl">{t('refer.title')}</h2>
            <p className="mt-3 text-lg text-ink/70">{t('refer.sub')}</p>
            <div className="mt-8 rounded-[2rem] border border-deep/10 bg-white p-6 sm:p-10">
              {state === 'done' ? (
                <div className="py-14 text-center">
                  <CheckCircle2 size={56} className="mx-auto text-calm" />
                  <p className="font-display mt-6 text-2xl text-deep">{t('refer.success')}</p>
                  <Button className="mt-8" variant="outline" onClick={() => (setF({ ...f, ...blankCase }), setState('idle'))}>
                    {en ? 'Refer another patient' : 'حوّل حالة تانية'}
                  </Button>
                </div>
              ) : (
                <form onSubmit={submit} className="grid gap-6 sm:grid-cols-2">
                  <Field label={t('refer.docName')}>
                    <Input required value={f.docName} onChange={set('docName')} />
                  </Field>
                  <Field label={t('refer.docSpecialty')}>
                    <Input value={f.docSpecialty} onChange={set('docSpecialty')} />
                  </Field>
                  <Field label={t('refer.docPhone')}>
                    <Input required type="tel" dir="ltr" value={f.docPhone} onChange={set('docPhone')} />
                  </Field>
                  <Field label={t('refer.docCity')}>
                    <Input value={f.docCity} onChange={set('docCity')} />
                  </Field>
                  <div className="h-px bg-deep/10 sm:col-span-2" />
                  <Field label={t('refer.patientName')}>
                    <Input required value={f.patientName} onChange={set('patientName')} />
                  </Field>
                  <Field label={t('refer.patientPhone')}>
                    <Input required type="tel" dir="ltr" value={f.patientPhone} onChange={set('patientPhone')} />
                  </Field>
                  <Field label={t('refer.caseSummary')} className="sm:col-span-2">
                    <Textarea required value={f.summary} onChange={set('summary')} />
                  </Field>
                  <div className="sm:col-span-2">
                    <span className="mb-2 block text-sm font-medium text-deep/80">{t('refer.urgency')}</span>
                    <Segmented name="urgency" value={f.urgency} onChange={set('urgency')} options={[['routine', t('refer.routine')], ['soon', t('refer.soon')], ['urgent', t('refer.urgent')]]} />
                  </div>
                  {state === 'error' && <p className="text-sm text-[#B8461A] sm:col-span-2">{t('book.error')}</p>}
                  <Button type="submit" size="lg" className="sm:col-span-2 sm:justify-self-start" disabled={state === 'sending'}>
                    {state === 'sending' ? t('cta.sending') : t('cta.refer')}
                  </Button>
                </form>
              )}
            </div>
          </div>
          <aside className="space-y-4 lg:col-span-4">
            {media.for_doctors && <img src={imgSrc(media.for_doctors.url)} alt={L(media.for_doctors.alt)} loading="lazy" className="aspect-[4/3] w-full rounded-[2rem] object-cover" />}
            {promises.map(([Icon, label]) => (
              <div key={label} className="flex items-center gap-4 rounded-2xl bg-deep p-5 text-linen">
                <Icon className="shrink-0 text-amber-soft" size={24} />
                <p className="font-medium">{label}</p>
              </div>
            ))}
            <div className="flex gap-3 rounded-2xl border border-amber/40 bg-amber/10 p-5 text-sm leading-relaxed text-ink/80">
              <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber" />
              <span>{L2(doctorFaqs[0].a)}</span>
            </div>
            <Button href={whatsappHref(s, lang, en ? 'Hello, I am a doctor and would like to refer a patient to Dr. Ayman El Sudany.' : 'السلام عليكم، أنا دكتور وعايز أحوّل حالة لدكتور أيمن السودانى.')} target="_blank" rel="noopener" onClick={() => track('whatsapp')} variant="outline" className="w-full">
              <WhatsAppIcon size={18} /> {en ? 'Refer on WhatsApp instead' : 'أو حوّل على واتساب'}
            </Button>
          </aside>
        </div>
      </section>

      {/* 2. How it works */}
      <section className="bg-deep-900 on-dark py-20 text-linen">
        <div className="mx-auto max-w-7xl px-6">
          <p className="eyebrow mb-4">{en ? 'How it works' : 'بيمشى إزاى'}</p>
          <h2 className="font-display max-w-2xl text-3xl sm:text-4xl">{en ? 'From your referral to the report on your desk' : 'من تحويلك لحد التقرير ما يوصلك'}</h2>
          <AnimatedContent stagger={0.1} className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {referSteps.map((x, i) => (
              <div key={i} className="rounded-3xl border border-white/10 p-7">
                <span className="font-display text-4xl text-amber-soft">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-5 leading-relaxed text-linen/85">{L2(x)}</p>
              </div>
            ))}
          </AnimatedContent>
        </div>
      </section>

      {/* 3. When to refer */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="eyebrow mb-4">{en ? 'When to refer' : 'إمتى تحوّل'}</p>
          <h2 className="font-display max-w-3xl text-3xl text-deep sm:text-4xl">{en ? 'Cases where a neuro-interventional opinion helps' : 'حالات رأى قسطرة المخ بيفرق فيها'}</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {whenToRefer.map((x) => (
              <div key={x.title.en} className="rounded-3xl bg-linen p-7">
                <p className="font-display text-xl text-deep">{L2(x.title)}</p>
                <p className="mt-3 leading-relaxed text-ink/70">{L2(x.body)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. What to send / what you get back */}
      <section className="bg-linen py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-2">
          {[
            [en ? 'What to send with the case' : 'ابعت إيه مع الحالة', whatToSend, FileCheck2],
            [en ? 'What your report includes' : 'التقرير اللى بيرجعلك فيه إيه', reportIncludes, FileText],
          ].map(([title, list, Icon]) => (
            <div key={title} className="rounded-[2rem] border border-deep/10 bg-white p-8 sm:p-10">
              <Icon className="text-calm" size={28} />
              <h3 className="font-display mt-5 text-2xl text-deep">{title}</h3>
              <ul className="mt-6 space-y-3">
                {list.map((x, i) => (
                  <li key={i} className="flex gap-3 text-ink/80">
                    <Check size={18} className="mt-1 shrink-0 text-calm" /> {L2(x)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Procedures */}
      {procedures.length > 0 && (
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <p className="eyebrow mb-4">{t('nav.procedures')}</p>
            <h2 className="font-display text-3xl text-deep sm:text-4xl">{en ? 'Procedures you can refer for' : 'الإجراءات اللى ممكن تحوّل لها'}</h2>
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {procedures.map((p) => (
                <Link key={p.id} to={to(`/procedures/${p.slug}`)} className="flex min-w-0 items-center gap-4 rounded-2xl border border-deep/10 p-4 transition-colors hover:border-deep/30">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-mist text-deep">
                    <ProcedureIcon name={p.icon} className="h-7 w-7" />
                  </span>
                  <span className="truncate font-medium text-deep">{L(p.title)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Questions from colleagues */}
      <section className="bg-linen py-24">
        <div className="mx-auto max-w-4xl px-6">
          <p className="eyebrow mb-4">{en ? 'Questions from colleagues' : 'أسئلة الزملاء'}</p>
          <Accordion items={doctorFaqs.map((x, i) => ({ id: i, q: L2(x.q), a: L2(x.a) }))} defaultOpen={-1} />
          <div className="mt-10">
            <Button href="#refer" onClick={(e) => (e.preventDefault(), document.getElementById('refer')?.scrollIntoView({ behavior: 'smooth' }))}>
              {t('cta.refer')}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
