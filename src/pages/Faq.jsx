import { useMemo } from 'react';
import { useLang } from '@/i18n';
import { useFaqs } from '@/lib/useFaqs';
import { Seo } from '@/site/Seo';
import { PageHero } from '@/site/PageHero';
import { Accordion } from '@/components/ui/Accordion';
import { ClosingCta } from '@/site/home/ClosingCta';

export default function Faq() {
  const { t } = useLang();
  const faqs = useFaqs();
  const jsonLd = useMemo(
    () => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }),
    [faqs]
  );
  return (
    <>
      <Seo title={t('nav.faq')} description={t('faq.title')} jsonLd={jsonLd} />
      <PageHero eyebrow={t('faq.eyebrow')} title={t('faq.title')} />
      <section className="bg-linen py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <Accordion items={faqs} />
        </div>
      </section>
      <ClosingCta />
    </>
  );
}
