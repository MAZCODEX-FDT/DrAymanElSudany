import { useLang } from '@/i18n';
import ScrollReveal from '@/components/reactbits/ScrollReveal';

export function Manifesto() {
  const { t, lang } = useLang();
  return (
    <section className="bg-linen pb-28 sm:pb-40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="amber-rule mb-16" />
        <ScrollReveal key={lang} baseOpacity={0.12} enableBlur blurStrength={6} baseRotation={0} splitBy="words" textClassName="font-display text-3xl leading-[1.45] text-deep sm:text-5xl sm:leading-[1.35]">
          {t('manifesto.text')}
        </ScrollReveal>
      </div>
    </section>
  );
}
