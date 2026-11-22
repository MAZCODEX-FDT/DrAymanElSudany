import { FileScan, Send, MessageCircleQuestion } from 'lucide-react';
import { useLang } from '@/i18n';
import { useContent, imgSrc } from '@/lib/content';
import { useSettings, whatsappHref } from '@/lib/settings';
import { track } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/site/WhatsAppFab';
import AnimatedContent from '@/components/reactbits/AnimatedContent';

/** "Send your scans first": the most common first step for brain-cath patients. */
export function ScanReview() {
  const { lang } = useLang();
  const s = useSettings();
  const en = lang === 'en';
  const steps = en
    ? [
        [FileScan, 'Photograph or scan the report', 'MRI, CT or angiography report, plus the CD if you have it.'],
        [Send, 'Send it on WhatsApp', 'With the patient’s age, the main symptoms and the current medicines.'],
        [MessageCircleQuestion, 'We tell you the next step', 'Whether a visit is needed, how soon, and what to bring.'],
      ]
    : [
        [FileScan, 'صوّر التقرير أو الأشعة', 'تقرير الرنين أو المقطعية أو القسطرة، والسى دى لو موجود.'],
        [Send, 'ابعتها على واتساب', 'مع سن المريض، والأعراض الأساسية، والأدوية الحالية.'],
        [MessageCircleQuestion, 'نقولك الخطوة الجاية', 'محتاج كشف ولا لأ، إمتى، وتجيب معاك إيه.'],
      ];
  const msg = en ? 'Hello, I would like to send scans for Dr. Ayman El Sudany to review.' : 'السلام عليكم، عايز أبعت أشعة لدكتور أيمن السودانى يطّلع عليها.';
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-4">{en ? 'Before you book' : 'قبل ما تحجز'}</p>
            <h2 className="font-display text-3xl leading-snug text-deep sm:text-5xl">{en ? 'Have scans already? Send them first' : 'معاك أشعة؟ ابعتها الأول'}</h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/70">
              {en ? 'A quick look at the report helps us tell you if a visit is needed and how urgent it is. It does not replace the consultation.' : 'نظرة سريعة على التقرير بتساعدنا نقولك محتاج كشف ولا لأ، ومستعجل قد إيه. ده مش بديل عن الكشف.'}
            </p>
          </div>
          <div className="lg:col-span-4 lg:text-end">
            <Button href={whatsappHref(s, lang, msg)} target="_blank" rel="noopener" onClick={() => track('whatsapp')} variant="amber" size="lg">
              <WhatsAppIcon size={20} /> {en ? 'Send scans on WhatsApp' : 'ابعت الأشعة واتساب'}
            </Button>
          </div>
        </div>
        <AnimatedContent stagger={0.1} className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map(([Icon, title, body], i) => (
            <div key={title} className="relative rounded-3xl bg-linen p-8">
              <span className="font-display absolute end-7 top-6 text-5xl text-deep/10">{i + 1}</span>
              <Icon className="text-calm" size={28} />
              <p className="font-display mt-6 text-xl text-deep">{title}</p>
              <p className="mt-2 leading-relaxed text-ink/70">{body}</p>
            </div>
          ))}
        </AnimatedContent>
      </div>
    </section>
  );
}

/** Clinic photos from Website > Images (gallery). Hidden when there are none. */
export function ClinicGallery() {
  const { lang, L } = useLang();
  const { gallery } = useContent();
  if (!gallery.length) return null;
  const pics = gallery.slice(0, 5);
  return (
    <section className="bg-linen py-24">
      <div className="mx-auto max-w-7xl px-6">
        <p className="eyebrow mb-4">{lang === 'en' ? 'The clinic' : 'العيادة'}</p>
        <h2 className="font-display mb-10 text-3xl text-deep sm:text-4xl">{lang === 'en' ? 'A place made for clear conversations' : 'مكان مجهز للكشف والشرح'}</h2>
        <div className="grid auto-rows-[160px] grid-cols-2 gap-4 sm:auto-rows-[220px] md:grid-cols-4">
          {pics.map((g, i) => (
            <img key={g.id} src={imgSrc(g.url)} alt={L(g.alt)} loading="lazy" className={`h-full w-full rounded-3xl object-cover ${i === 0 ? 'col-span-2 row-span-2' : ''}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
