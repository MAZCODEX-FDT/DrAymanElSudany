import { useLang } from '@/i18n';
import { useFaqs } from '@/lib/useFaqs';
import { Accordion } from '@/components/ui/Accordion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { ArrowForward } from '@/components/ui/ArrowForward';

export function FaqPreview() {
  const { t, to } = useLang();
  const faqs = useFaqs();
  return (
    <section className="bg-sand/60 py-28 sm:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeader eyebrow={t('faq.eyebrow')} title={t('faq.title')} />
          <Button to={to('/faq')} variant="outline" className="mt-10">
            {t('faq.more')} <ArrowForward size={16} />
          </Button>
        </div>
        <div className="lg:col-span-7">
          <Accordion items={faqs.slice(0, 4)} />
        </div>
      </div>
    </section>
  );
}
