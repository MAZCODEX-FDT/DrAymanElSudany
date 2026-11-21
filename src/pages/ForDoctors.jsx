import { useState } from 'react';
import { CheckCircle2, PhoneCall, FileCheck2, Undo2 } from 'lucide-react';
import { useLang } from '@/i18n';
import { submitLead, track } from '@/lib/api';
import { Seo } from '@/site/Seo';
import { PageHero } from '@/site/PageHero';
import { Button } from '@/components/ui/Button';
import { Field, Input, Textarea, Segmented } from '@/components/ui/Form';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import AnimatedContent from '@/components/reactbits/AnimatedContent';

export default function ForDoctors() {
  const { t, lang } = useLang();
  const [f, setF] = useState({ docName: '', docSpecialty: '', docPhone: '', docCity: '', patientName: '', patientPhone: '', summary: '', urgency: 'routine' });
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
        payload: { specialty: f.docSpecialty, city: f.docCity, patient: f.patientName, patientPhone: f.patientPhone, summary: f.summary, urgency: f.urgency, lang },
      });
      track('form');
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
  return (
    <>
      <Seo title={t('nav.doctors')} description={t('doctorsBand.sub')} />
      <PageHero eyebrow={t('nav.doctors')} title={t('doctorsBand.title')} sub={t('doctorsBand.sub')} />
      <section className="bg-deep-900 on-dark py-16">
        <AnimatedContent stagger={0.12} className="mx-auto grid max-w-7xl gap-5 px-6 md:grid-cols-3">
          {promises.map(([Icon, label]) => (
            <SpotlightCard key={label} theme="deep" className="!p-8">
              <Icon className="text-amber-soft" size={28} />
              <p className="font-display mt-6 text-xl text-linen">{label}</p>
            </SpotlightCard>
          ))}
        </AnimatedContent>
      </section>
      <section className="bg-linen py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-display text-3xl text-deep sm:text-4xl">{t('refer.title')}</h2>
          <p className="mt-4 text-lg text-ink/70">{t('refer.sub')}</p>
          <div className="mt-10 rounded-[2rem] border border-deep/10 bg-white/60 p-7 sm:p-10">
            {state === 'done' ? (
              <div className="py-14 text-center">
                <CheckCircle2 size={56} className="mx-auto text-calm" />
                <p className="font-display mt-6 text-2xl text-deep">{t('refer.success')}</p>
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
                {state === 'error' && <p className="text-sm text-[#9a5b12] sm:col-span-2">{t('book.error')}</p>}
                <Button type="submit" size="lg" className="sm:col-span-2 sm:justify-self-start" disabled={state === 'sending'}>
                  {state === 'sending' ? t('cta.sending') : t('cta.refer')}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
