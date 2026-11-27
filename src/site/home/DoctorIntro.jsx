import { Quote } from 'lucide-react';
import { useLang } from '@/i18n';
import { useContent, imgSrc } from '@/lib/content';
import { Button } from '@/components/ui/Button';
import { ArrowForward } from '@/components/ui/ArrowForward';
import { LogoMark } from '@/components/ui/Logo';
import AnimatedContent from '@/components/reactbits/AnimatedContent';

/** "About the doctor" right after the banner. Text: Website > About the doctor (intro + statement). Photo: Website > Images (home_doctor). */
export function DoctorIntro() {
  const { t, L, to } = useLang();
  const { about, media } = useContent();
  const photo = media.home_doctor || media.about_doctor;
  const intro = about.intro;
  if (!intro) return null;

  return (
    <section className="bg-linen py-24 sm:py-32">
      <AnimatedContent stagger={0.12} className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          {photo ? (
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2.5rem] bg-deep">
              <img src={imgSrc(photo.url)} alt={L(photo.alt)} className="h-full w-full object-cover object-top" loading="lazy" />
            </div>
          ) : (
            // Built-in cut-out (side pose) on a Mist panel: the navy scrubs need a light ground.
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2.5rem] bg-mist">
              <LogoMark className="absolute end-6 top-6 h-10 w-10 opacity-80" />
              <img src={imgSrc('images/dr-ayman-side.webp')} alt={t('brand.fullName')} width="726" height="1140" className="absolute inset-x-0 bottom-0 mx-auto h-[94%] w-auto max-w-none" loading="lazy" />
            </div>
          )}
        </div>
        <div className="lg:col-span-7">
          <p className="eyebrow mb-5">{L(intro.title) || t('about.eyebrow')}</p>
          <h2 className="font-display text-4xl leading-tight text-deep sm:text-5xl">{t('brand.fullName')}</h2>
          <p className="mt-2 text-lg text-calm-ink">{t('brand.tagline')}</p>
          <p className="mt-8 whitespace-pre-line text-lg leading-loose text-ink/80">{L(intro.body)}</p>
          {about.statement && L(about.statement.body) && (
            <blockquote className="mt-8 flex gap-4 rounded-3xl bg-white p-6 text-ink/75">
              <Quote className="mt-1 shrink-0 text-amber" size={22} />
              <p className="leading-relaxed">{L(about.statement.body)}</p>
            </blockquote>
          )}
          <div className="mt-10">
            <Button to={to('/about')} variant="primary" size="lg">
              {t('cta.readMore')} <ArrowForward size={18} />
            </Button>
          </div>
        </div>
      </AnimatedContent>
    </section>
  );
}
