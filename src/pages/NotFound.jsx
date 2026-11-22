import { useLang } from '@/i18n';
import { PageHero } from '@/site/PageHero';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  const { lang, to } = useLang();
  return (
    <PageHero title={lang === 'en' ? 'This page took a different path' : 'الصفحة دى مش موجودة'} sub="404">
      <Button to={to('/')} variant="amber">
        {lang === 'en' ? 'Back home' : 'الرجوع للرئيسية'}
      </Button>
    </PageHero>
  );
}
