import { useLang } from '@/i18n';
import { useContent } from '@/lib/content';
import { Seo } from '@/site/Seo';
import { PageHero } from '@/site/PageHero';
import { ProcedureCard } from '@/site/home/Procedures';
import { Cost } from '@/site/home/Cost';
import { ClosingCta } from '@/site/home/ClosingCta';
import AnimatedContent from '@/components/reactbits/AnimatedContent';

export default function ProceduresIndex() {
  const { t } = useLang();
  const { procedures } = useContent();
  return (
    <>
      <Seo title={t('nav.procedures')} description={t('procedures.sub')} />
      <PageHero eyebrow={t('procedures.eyebrow')} title={t('procedures.title')} sub={t('procedures.sub')} />
      <section className="bg-deep-900 on-dark min-h-[50vh] py-20">
        <AnimatedContent stagger={0.1} className="mx-auto grid max-w-7xl gap-5 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {procedures.map((p, i) => (
            <ProcedureCard key={p.slug} p={p} i={i} />
          ))}
        </AnimatedContent>
      </section>
      <Cost />
      <ClosingCta />
    </>
  );
}
