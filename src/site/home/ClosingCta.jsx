import { Stethoscope } from 'lucide-react';
import { useLang } from '@/i18n';
import { useSettings, whatsappHref } from '@/lib/settings';
import { track } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/site/WhatsAppFab';
import GradientText from '@/components/reactbits/GradientText';
import Magnet from '@/components/reactbits/Magnet';
import AnimatedContent from '@/components/reactbits/AnimatedContent';

export function DoctorsBand() {
  const { t, to } = useLang();
  return (
    <section className="bg-linen px-4 py-10 sm:px-6">
      <AnimatedContent distance={60} scale={0.96} className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-mist p-10 sm:p-16">
          <div className="absolute -end-20 -top-20 h-72 w-72 rounded-full bg-calm/20 blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Stethoscope className="text-calm" size={30} />
              <h2 className="font-display mt-6 text-3xl leading-snug text-deep sm:text-4xl">{t('doctorsBand.title')}</h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/70">{t('doctorsBand.sub')}</p>
            </div>
            <div className="lg:col-span-4 lg:text-end">
              <Button to={to('/for-doctors')} size="lg">
                {t('cta.refer')}
              </Button>
            </div>
          </div>
        </div>
      </AnimatedContent>
    </section>
  );
}

export function ClosingCta() {
  const { t, to, lang } = useLang();
  const s = useSettings();
  return (
    <section className="bg-linen px-4 pb-24 pt-10 sm:px-6">
      <div className="bg-deep-glow on-dark grain relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] px-8 py-20 text-center text-linen sm:px-16 sm:py-28">
        <p className="eyebrow mb-6">{t('book.eyebrow')}</p>
        <h2 className="font-display mx-auto max-w-4xl text-4xl leading-tight sm:text-6xl">
          <GradientText colors={['#f5f1ea', '#ebc08c', '#d7e5ec', '#f5f1ea']} animationSpeed={10}>
            {t('book.title')}
          </GradientText>
        </h2>
        <p className="mx-auto mt-7 max-w-2xl text-lg text-linen/70">{t('book.sub')}</p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Magnet padding={50} magnetStrength={4}>
            <Button href={whatsappHref(s, lang)} target="_blank" rel="noopener" onClick={() => track('whatsapp')} variant="amber" size="lg">
              <WhatsAppIcon size={20} /> {t('cta.whatsapp')}
            </Button>
          </Magnet>
          <Button to={to('/book')} variant="ghostDark" size="lg">
            {t('cta.book')}
          </Button>
        </div>
      </div>
    </section>
  );
}
