import { useLang } from '@/i18n';
import { useContent } from './content';

/** Published FAQs from the dashboard (Website > FAQs), in the current language. */
export function useFaqs() {
  const { L, lang } = useLang();
  const { faqs } = useContent();
  return faqs.map((f) => ({ id: f.id, category: L(f.category), q: L(f.q), a: L(f.a), lang }));
}
